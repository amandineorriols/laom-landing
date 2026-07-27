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

    return new Response(JSON.stringify({
      totals: {
        spend: Math.round(totalSpend * 100) / 100,
        leads: totalLeads,
        cpl: totalLeads > 0 ? Math.round((totalSpend / totalLeads) * 100) / 100 : null,
        since: CAMPAIGN_START,
        until,
      },
      weeks,
      ads: adsCumul,
      ads_weekly: adsWeekly,
    }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
  } catch (e) {
    console.error('[ads-data] error:', e)
    return new Response(JSON.stringify({ error: 'Meta API query failed' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    })
  }
}
