# API Leads — guide pour les agents (Torus, NILA…)

Comment lire et alimenter les leads du tunnel coliving (base D1 `laom-tracking`)
depuis un agent, via l'API admin du site. Tout passe par HTTPS + cookie de
session signé — **jamais d'accès direct à la base**.

## Auth (session 8h)

```bash
curl -s -c /tmp/laom.jar -X POST "https://laom.fr/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"<ADMIN_PASSWORD — demander à Charly, ne JAMAIS committer>"}'
```

Rate limit : 10 tentatives / 15 min / IP. Réutiliser le cookie tant qu'il est valide.

## Lire les leads (trouver l'id d'un candidat)

```bash
curl -s -b /tmp/laom.jar "https://laom.fr/api/admin/coliving-data/?period=all&type=candidature"
```

Réponse : `{ leads: [{ id, created_at, status, first_name, last_name, email, phone,
utm_source, utm_campaign, utm_content, answers (JSON string), notes }], funnel, kpis… }`.
Chercher le lead par nom/email pour obtenir son `id`.

## Mettre à jour un lead (statut et/ou note de call)

```bash
curl -s -b /tmp/laom.jar -X POST "https://laom.fr/api/admin/lead-status" \
  -H "Content-Type: application/json" \
  -d '{"id": 42, "status": "lost", "note": "Call 10/07 — pas le bon timing pour lui, à recontacter en octobre."}'
```

- `status` (optionnel) : `lead` · `call_booked` · `call_done` · `no_show` · `match` · `paid` · `lost` (= écarté).
  **Chaque changement de statut envoie automatiquement l'événement qualité à Meta**
  (CallBooked/CallDone/NoShow/Match/Paid/Disqualified) — ne JAMAIS modifier un
  statut directement en base, ça court-circuiterait le feedback vers l'algo pub.
- `note` (optionnel, ≤ 2000 car.) : ajoutée horodatée au fil des notes (append-only).
  Une note seule (sans statut) n'envoie rien à Meta.
- Au moins un des deux est requis. Réponse : `{ ok: true, capi: true|false|null }`
  (`capi` = l'événement Meta est parti ; `null` si pas de changement de statut).

## Workflow type "compte-rendu de call dicté"

1. L'humain dit : « Call avec Cédric : il dit non, pas le timing, à revoir en octobre. »
2. L'agent : login → GET coliving-data → trouve le lead « Cédric » (si ambigu, demander) →
   POST lead-status `{id, status: "lost", note: "Call <date> — non, pas le timing. À recontacter en octobre."}`.
3. Confirmer à l'humain : statut passé, note tracée, signal Meta parti.

## Règles

- Le mot de passe admin se transmet de vive voix / gestionnaire de secrets. Pas en clair dans un repo, un prompt système versionné, ou un ticket.
- Ne pas créer de leads via cette API (les leads naissent des formulaires du site ou du worker meta-leads).
- La base D1 reste la source de vérité unique — pas de copie des leads ailleurs.
