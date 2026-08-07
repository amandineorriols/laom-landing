import type { APIRoute } from 'astro'

// GET /api/admin/ads-data
// KPI des pubs Meta (campagne coliving) semaine par semaine, via la Graph API.
// Auth assuree par le middleware (cookie de session signe). Le token Meta
// (META_ADS_TOKEN, System User ads_read) vit en secret Worker — jamais en code.

export const prerender = false

const GRAPH = 'https://graph.facebook.com/v21.0'
const ACCOUNT = 'act_1371175461441820'
// Premiere semaine de spend de la campagne coliving aout (lundi).
const CAMPAIGN_START = '2026-06-29'

const FIELDS =
  'spend,impressions,reach,frequency,cpm,unique_clicks,actions,' +
  'video_play_actions,video_thruplay_watched_actions'

type InsightRow = {
  ad_name?: string
  date_start: string
  date_stop: string
  spend: string
  impressions: string
  reach: string
  frequency: string
  cpm: string
  unique_clicks?: string
  actions?: Array<{ action_type: string; value: string }>
  video_play_actions?: Array<{ value: string }>
  video_thruplay_watched_actions?: Array<{ value: string }>
}

// PIEGE verifie sur ce compte : action_type 'lead' est le TOTAL — il agrege
// deja lead_grouped (Instant Forms) et fb_pixel_lead (pixel site). Ne JAMAIS
// additionner les sous-types entre eux (double comptage).
function leads(row: InsightRow): number {
  const a = (row.actions || []).find((x) => x.action_type === 'lead')
  return a ? Number(a.value) : 0
}

function kpis(row: InsightRow) {
  const spend = Number(row.spend)
  const imp = Number(row.impressions)
  const reach = Number(row.reach)
  const uc = Number(row.unique_clicks || 0)
  const v3 = Number(row.video_play_actions?.[0]?.value || 0)
  const tp = Number(row.video_thruplay_watched_actions?.[0]?.value || 0)
  const nLeads = leads(row)
  const r1 = (n: number) => Math.round(n * 10) / 10
  const r2 = (n: number) => Math.round(n * 100) / 100
  return {
    spend: r2(spend),
    impressions: imp,
    reach,
    frequency: r2(Number(row.frequency)),
    cpm: r2(Number(row.cpm)),
    hook_rate: imp > 0 ? r1((v3 / imp) * 100) : null,
    hold_rate: v3 > 0 ? r1((tp / v3) * 100) : null,
    uctr: reach > 0 ? r2((uc / reach) * 100) : null,
    leads: nLeads,
    cpl: nLeads > 0 ? r2(spend / nLeads) : null,
  }
}

async function fetchInsights(token: string, level: 'account' | 'ad', until: string, weekly = true): Promise<InsightRow[]> {
  const params = new URLSearchParams({
    access_token: token,
    level,
    fields: level === 'ad' ? `ad_name,${FIELDS}` : FIELDS,
    time_range: JSON.stringify({ since: CAMPAIGN_START, until }),
    limit: '500',
  })
  if (weekly) params.set('time_increment', '7')
  const res = await fetch(`${GRAPH}/${ACCOUNT}/insights?${params}`)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Meta API ${res.status}: ${body.slice(0, 300)}`)
  }
  const json = (await res.json()) as { data: InsightRow[] }
  return json.data || []
}

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env
  const token = env?.META_ADS_TOKEN
  if (!token) {
    return new Response(JSON.stringify({ error: 'META_ADS_TOKEN not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  const until = new Date().toISOString().slice(0, 10)
  try {
    // 3e appel sans time_increment : reach/frequency/uCTR cumules corrects
    // (les metriques "unique" ne se somment pas d'une semaine a l'autre).
    const [accountRows, adRows, adCumulRows] = await Promise.all([
      fetchInsights(token, 'account', until),
      fetchInsights(token, 'ad', until),
      fetchInsights(token, 'ad', until, false),
    ])

    // Semaines (niveau compte), de la plus recente a la plus ancienne.
    const weeks = accountRows
      .map((r) => ({ week_start: r.date_start, week_end: r.date_stop, ...kpis(r) }))
      .sort((a, b) => (a.week_start < b.week_start ? 1 : -1))

    // Detail par pub et par semaine.
    const adsWeekly = adRows.map((r) => ({
      ad_name: r.ad_name || '?', week_start: r.date_start, week_end: r.date_stop, ...kpis(r),
    }))

    // Cumul par pub (lignes cumulees exactes de l'API) + detail hebdo attache.
    const weeklyByAd = new Map<string, InsightRow[]>()
    for (const r of adRows) {
      const list = weeklyByAd.get(r.ad_name || '?') || []
      list.push(r)
      weeklyByAd.set(r.ad_name || '?', list)
    }
    const lastWeekStart = weeks[0]?.week_start || ''
    const adsCumul = adCumulRows.map((r) => {
      const rows = weeklyByAd.get(r.ad_name || '?') || []
      const lastActive = rows.filter((w) => Number(w.spend) > 0).map((w) => w.date_start).sort().pop()
      return {
        ad_name: r.ad_name || '?',
        ...kpis(r),
        active_last_week: lastActive ? lastActive >= lastWeekStart : false,
        weekly: rows
          .map((w) => ({ week_start: w.date_start, spend: Math.round(Number(w.spend) * 100) / 100, leads: leads(w), cpl: leads(w) > 0 ? Math.round((Number(w.spend) / leads(w)) * 100) / 100 : null }))
          .sort((a, b) => (a.week_start < b.week_start ? -1 : 1)),
      }
    }).sort((a, b) => b.spend - a.spend)

    const totalSpend = weeks.reduce((s, w) => s + w.spend, 0)
    const totalLeads = weeks.reduce((s, w) => s + w.leads, 0)

    // ---- Verdicts + conseils (regles du skill KPI : target CPA + paliers de depense) ----
    // Target provisoire 5 €/lead (mediane compte) — a recaler via taux lead→resident.
    const TARGET = 5
    const isFullWeek = (start: string, stop: string) =>
      (Date.parse(stop) - Date.parse(start)) === 6 * 86400000
    const fullWeeks = weeks.filter((w) => isFullWeek(w.week_start, w.week_end))
    const fr = (n: number) => n.toFixed(2).replace('.', ',')

    const adsAdvised = adsCumul.map((a) => {
      const spendX = a.spend / TARGET
      const fw = a.weekly.filter((w) => w.spend > 0 && fullWeeks.some((x) => x.week_start === w.week_start))
      const last = fw[fw.length - 1]
      const prev = fw[fw.length - 2]
      // Fatigue : CPL de la derniere semaine pleine en hausse >25% vs la precedente.
      // Fatigue seulement si la hausse rapproche du target (>80%) — une pub a 2-3 €
      // qui bouge de 25% n'est pas une alerte.
      const fatigue = Boolean(a.active_last_week && last && prev && last.cpl != null && prev.cpl != null && last.cpl > prev.cpl * 1.25 && last.cpl > TARGET * 0.8)

      let grade: string, label: string, decision: string, reason: string
      if (spendX < 3) {
        grade = 'trop_tot'; label = 'Trop tôt'; decision = 'attendre'
        reason = `Seulement ${a.spend.toFixed(0)} € dépensés (< 3× le target) : pas assez de données pour juger.`
      } else if (a.cpl == null) {
        grade = 'loser'; label = 'Loser'; decision = 'kill'
        reason = `${a.spend.toFixed(0)} € dépensés sans aucun lead.`
      } else if (a.cpl <= TARGET) {
        if (spendX >= 25) {
          grade = 'winner'; label = 'Winner'
          decision = fatigue ? 'préparer variation' : 'scale'
          reason = fatigue
            ? `CPL cumul ${fr(a.cpl)} € sous le target mais en hausse (${fr(prev!.cpl!)} → ${fr(last!.cpl!)} €) : la créa s'use, préparer une variation avant qu'elle décroche.`
            : `CPL ${fr(a.cpl)} € sous le target avec ${a.spend.toFixed(0)} € de dépense : solide, monter le budget par paliers de +50 %.`
        } else {
          grade = 'prometteur'; label = 'Prometteur'; decision = 'nourrir'
          reason = `CPL ${fr(a.cpl)} € sous le target mais volume encore faible : laisser tourner, re-juger vers ${Math.round(25 * TARGET)} € de dépense.`
        }
      } else if (a.cpl > TARGET * 1.4) {
        grade = 'loser'; label = 'Loser'; decision = 'kill'
        reason = `CPL ${fr(a.cpl)} € (> 1,4× le target)${last && prev && last.cpl != null && prev.cpl != null && last.cpl > prev.cpl ? `, et ça se dégrade (${fr(prev.cpl)} → ${fr(last.cpl)} €)` : ''} : couper, le budget sert mieux ailleurs.`
      } else {
        grade = 'limite'; label = 'Limite'; decision = 'iterate'
        reason = `CPL ${fr(a.cpl)} € juste au-dessus du target : itérer sur la créa (hook) plutôt que couper ou scaler.`
      }
      if (!a.active_last_week && decision === 'kill') {
        decision = 'déjà coupée'
        reason = reason.replace(' : couper, le budget sert mieux ailleurs.', ' — déjà coupée, ne pas relancer.')
      }
      return { ...a, grade, grade_label: label, decision, reason, fatigue }
    })

    // Conseils globaux, dans l'ordre d'action.
    const advice: Array<{ type: string; text: string }> = []
    const actives = adsAdvised.filter((a) => a.active_last_week)
    const lastFW = fullWeeks[0]
    const prevFW = fullWeeks[1]
    for (const a of actives.filter((x) => x.grade === 'loser')) {
      const wk = a.weekly.find((w) => w.week_start === lastFW?.week_start)
      const daily = wk ? (wk.spend / 7).toFixed(0) : null
      advice.push({ type: 'kill', text: `Couper « ${a.ad_name} »${daily ? ` : ~${daily} €/j récupérés` : ''} — ${a.reason}` })
    }
    const toScale = actives.filter((x) => x.grade === 'winner' && !x.fatigue).sort((x, y) => (x.cpl || 99) - (y.cpl || 99))[0]
    if (toScale) advice.push({ type: 'scale', text: `Scaler « ${toScale.ad_name} » (CPL ${fr(toScale.cpl!)} €) par paliers de +50 % max toutes les 48h.` })
    for (const a of actives.filter((x) => x.fatigue && x.grade !== 'loser')) {
      advice.push({ type: 'watch', text: `Fatigue sur « ${a.ad_name} » : préparer une variation (nouveau hook, même promesse) pour prendre le relais. Ne pas toucher au budget.` })
    }
    for (const a of actives.filter((x) => x.grade === 'limite')) {
      advice.push({ type: 'iterate', text: `Itérer « ${a.ad_name} » : ${a.reason}` })
    }
    if (actives.length <= 4) {
      advice.push({ type: 'produce', text: `Seulement ${actives.length} pub(s) active(s) et aucune créa en test : produire un batch de 2-3 variations sur l'angle gagnant et relancer une campagne testing. C'est le goulot.` })
    }

    // Lecture de la derniere semaine pleine.
    let summary = ''
    if (lastFW) {
      const delta = prevFW && prevFW.cpl != null && lastFW.cpl != null
        ? (lastFW.cpl <= prevFW.cpl ? ` (▼ vs ${fr(prevFW.cpl)} € la semaine d'avant)` : ` (▲ vs ${fr(prevFW.cpl)} € la semaine d'avant — surveiller)`)
        : ''
      const weekAds = adsAdvised
        .map((a) => ({ name: a.ad_name, w: a.weekly.find((w) => w.week_start === lastFW.week_start) }))
        .filter((x) => x.w && x.w.spend > 5)
      const best = weekAds.filter((x) => x.w!.cpl != null).sort((x, y) => x.w!.cpl! - y.w!.cpl!)[0]
      const worst = weekAds.filter((x) => x.w!.cpl != null).sort((x, y) => y.w!.cpl! - x.w!.cpl!)[0]
      summary = `Semaine du ${lastFW.week_start.slice(8, 10)}/${lastFW.week_start.slice(5, 7)} : ${lastFW.spend.toFixed(0)} € · ${lastFW.leads} leads · CPL ${lastFW.cpl == null ? '—' : fr(lastFW.cpl)} €${delta}.`
        + (best ? ` Meilleure pub : ${best.name} (${fr(best.w!.cpl!)} €).` : '')
        + (worst && worst !== best ? ` Pire pub : ${worst.name} (${fr(worst.w!.cpl!)} €).` : '')
    }

    return new Response(JSON.stringify({
      totals: {
        spend: Math.round(totalSpend * 100) / 100,
        leads: totalLeads,
        cpl: totalLeads > 0 ? Math.round((totalSpend / totalLeads) * 100) / 100 : null,
        since: CAMPAIGN_START,
        until,
      },
      weeks,
      ads: adsAdvised,
      ads_weekly: adsWeekly,
      advice,
      summary,
      target_cpa: TARGET,
    }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
  } catch (e) {
    console.error('[ads-data] error:', e)
    return new Response(JSON.stringify({ error: 'Meta API query failed' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    })
  }
}
