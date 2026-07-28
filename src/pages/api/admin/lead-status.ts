import type { APIRoute } from 'astro'
import { sendMetaEvents } from '~/lib/meta-capi'
import { ensureGenderColumn, CALLERS } from './coliving-data'

// POST /api/admin/lead-status { id, status?, note?, gender?, assigned_to? }
// Met a jour le statut d'un lead (lead -> call -> match -> paid / no_show / lost)
// ET renvoie l'etape a Meta (CAPI) : l'algo apprend la QUALITE des leads (qui va
// au call, qui matche, qui paie, qui no-show) — pas juste le remplissage du form.
// `note` (optionnelle, cumulable avec le statut) : compte-rendu de call, ajoute
// horodate au champ notes (append-only). Auth par le middleware (cookie signe).

export const prerender = false

const ALLOWED = ['lead', 'call_booked', 'call_done', 'no_show', 'match', 'paid', 'lost']

// Statut -> evenement custom envoye au dataset Meta ('lead' = retour arriere, pas d'event).
const STAGE_EVENTS: Record<string, string> = {
  call_booked: 'CallBooked',
  call_done: 'CallDone',
  no_show: 'NoShow',
  match: 'Match',
  paid: 'Paid',
  lost: 'Disqualified',
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  const tdb = env?.TRACKING_DB
  if (!tdb) {
    return new Response(JSON.stringify({ error: 'TRACKING_DB not configured' }), { status: 500 })
  }

  let body: { id?: number | string; status?: string; note?: string; gender?: string | null; assigned_to?: string | null }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Requête invalide' }), { status: 400 })
  }

  const id = Number(body.id)
  const status = body.status != null ? String(body.status) : ''
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 2000) : ''
  // Override manuel du genre ('h'/'f', null = revenir a l'inference prenom).
  const hasGender = 'gender' in body
  const gender = hasGender ? (body.gender === 'h' || body.gender === 'f' ? body.gender : null) : undefined
  // Affectation manuelle du call (null = revenir a la regle auto).
  const hasAssign = 'assigned_to' in body
  const assignedTo = hasAssign ? (CALLERS.includes(body.assigned_to as any) ? body.assigned_to : null) : undefined
  if (!id || (!status && !note && !hasGender && !hasAssign)) {
    return new Response(JSON.stringify({ error: 'id + statut, note, genre ou affectation requis' }), { status: 400 })
  }
  if (status && !ALLOWED.includes(status)) {
    return new Response(JSON.stringify({ error: 'statut invalide' }), { status: 400 })
  }
  if (hasGender && body.gender != null && body.gender !== 'h' && body.gender !== 'f') {
    return new Response(JSON.stringify({ error: 'genre invalide (h, f ou null)' }), { status: 400 })
  }
  if (hasAssign && body.assigned_to != null && !CALLERS.includes(body.assigned_to as any)) {
    return new Response(JSON.stringify({ error: 'affectation invalide' }), { status: 400 })
  }

  try {
    let res: any
    if (hasGender || hasAssign) {
      await ensureGenderColumn(tdb)
      const sets: string[] = []
      const vals: any[] = []
      if (hasGender) { sets.push('gender = ?'); vals.push(gender) }
      if (hasAssign) { sets.push('assigned_to = ?'); vals.push(assignedTo) }
      res = await tdb.prepare(`UPDATE leads SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`)
        .bind(...vals, id).run()
      if (!res?.meta?.changes) {
        return new Response(JSON.stringify({ error: 'Lead introuvable' }), { status: 404 })
      }
      if (!status && !note) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    if (status && note) {
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
      res = await tdb.prepare(
        `UPDATE leads SET status = ?, notes = COALESCE(notes || char(10), '') || ?, updated_at = datetime('now') WHERE id = ?`,
      ).bind(status, `[${stamp}] ${note}`, id).run()
    } else if (status) {
      res = await tdb.prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(status, id).run()
    } else {
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
      res = await tdb.prepare(
        `UPDATE leads SET notes = COALESCE(notes || char(10), '') || ?, updated_at = datetime('now') WHERE id = ?`,
      ).bind(`[${stamp}] ${note}`, id).run()
    }
    if (!res?.meta?.changes) {
      return new Response(JSON.stringify({ error: 'Lead introuvable' }), { status: 404 })
    }
  } catch (e) {
    console.error('[lead-status] error:', e)
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 })
  }

  // Feedback qualite vers Meta. Non bloquant : le statut est deja sauve.
  let capi: boolean | null = null
  const eventName = STAGE_EVENTS[status]
  if (eventName) {
    try {
      const lead = await tdb.prepare(
        `SELECT l.email, l.phone, l.first_name, l.visitor_id, va.fbc, va.user_agent
         FROM leads l LEFT JOIN visitor_attribution va ON va.visitor_id = l.visitor_id
         WHERE l.id = ?`,
      ).bind(id).first() as { email: string; phone: string | null; first_name: string | null; visitor_id: string | null; fbc: string | null; user_agent: string | null } | null
      if (lead?.email) {
        const res = await sendMetaEvents(
          [{
            event_name: eventName,
            // Idempotent : re-cliquer le meme statut ne cree pas de doublon cote Meta.
            event_id: `lead-${id}-${status}`,
            event_source_url: 'https://laom.fr/coliving-aout/',
            custom_data: { content_category: 'coliving_lead_stage', content_name: status },
            user_data: {
              em: lead.email,
              ph: lead.phone || undefined,
              fn: lead.first_name || undefined,
              external_id: lead.visitor_id || lead.email,
            },
          }],
          // Pas d'IP admin (mauvais signal), mais le user-agent D'ORIGINE du lead
          // (stocké dans visitor_attribution) : requis par Meta pour action_source
          // website, et c'est bien celui du navigateur qui a converti.
          {
            accessToken: env?.META_CAPI_TOKEN || '',
            fbc: lead.fbc || undefined,
            userAgent: lead.user_agent || undefined,
          },
        )
        capi = res.ok
        if (!res.ok) console.error('[lead-status] CAPI stage error:', JSON.stringify(res.result))
      }
    } catch (e) {
      console.error('[lead-status] CAPI error (non-blocking):', e)
      capi = false
    }
  }

  return new Response(JSON.stringify({ ok: true, capi }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}
