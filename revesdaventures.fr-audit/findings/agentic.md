# Agentic readiness - revesdaventures.fr (2026-11-06)

Score (AI Search Readiness, agent part): 74/100

## Measurements
- Lighthouse Agentic Browsing: 2/3 (mobile, Lighthouse 13.6.0), 2/3 (desktop, 13.6.0). Notes verified against 13.5.0.
  - agent-accessibility-tree: FAIL. Button without discernible text (mobile menu toggle).
  - cumulative-layout-shift: pass (0). llms-txt: pass.
  - WebMCP (3 audits) and ard-schema: not applicable, not counted.
  - Path: publishing a valid /.well-known/ai-catalog.json adds one counted audit (only if there are agent resources to list; optional).
- Agent-UX heuristic (separate from the Lighthouse fraction, status complete): / = 97, /calendrier = 100, /booking/<id> = 97.
- Server rendering: 889 words without JS on /. Real 404 for unknown URLs (pass).

## Access policy (robots.txt: `User-agent: *`, Allow /, Disallow /api/, Sitemap)
- Training crawlers (GPTBot, Google-Extended, CCBot...): allowed by default (no named group, no Content-Signal).
- Search crawlers/agents (OAI-SearchBot, PerplexityBot, Googlebot): allowed.
- User-triggered agents: ChatGPT-User may not apply robots; Claude-User honours; Perplexity-User and Google-Agent generally ignore it. Nothing blocked.
- Content-Signal (Cloudflare draft, a preference, Google does not act on it; checked 2026-09-23): absent. Optional.

## What works
- llms.txt valid (3411 bytes, H1, links) at public/llms.txt; structured and in French.
- Prerendered HTML, semantic landmarks, 0 div-onclick widgets, calendar page fully named (100).
- Real 404s, sitemap declared, no WebMCP-defect (WebMCP is a W3C CG draft; absence is an opportunity).

## Findings
### P1 / High - Mobile menu button has no accessible name
Evidence: Lighthouse axe "Buttons must have discernible text" on `header > button.md:hidden`; Agent-UX unnamed_interactive=1 on /.
Fix: components/Navbar.tsx:136-138, add `aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}`, `aria-expanded={mobileMenuOpen}`, `aria-controls`. This turns the Lighthouse fraction to 3/3.

### P1 / High - Booking form labels not associated with inputs
Evidence: /booking/<id> HTML has 6 inputs with no id/aria; `<label>` has no htmlFor (components/BookingForm.tsx:431-435 participant fields, :530-536 contact name, and email/tel below). Agents using the accessibility tree see unnamed textboxes (1 unnamed node found); placeholders are the only hint.
Fix: add `id` + `htmlFor` (or wrap input in label) and `autocomplete` (name, email, tel). Also name the remaining unnamed interactive node on this page.

### P1 / High - /booking/<id> is indexable with a generic homepage title
Evidence: no meta robots, title "Rêves d'Aventures | Escalade, Canyoning & VTT Hautes-Alpes" (app/booking/[id]/page.tsx has no metadata export). Already indexed in Google.
Fix: export `metadata = { robots: { index:false, follow:false } }` and a specific title in app/booking/[id]/page.tsx (generateMetadata); keep out of sitemap.

### P1 / High - Activity catalogue is client-only (agents without JS see "Chargement...")
Evidence: /aventures/mono-activite HTML contains "Chargement..." as the Suspense fallback; the activity data is present only in the RSC payload (`initialActivities`), not as anchors. Agent browsers that render JS see it; fetch-only agents (many user-triggered fetchers) do not.
Fix: components/ActivityFilterableList.tsx: render the list server-side (read searchParams in the page, or render a full `<ul>` of links as the Suspense fallback / no-JS default).

### P2 / Medium - llms.txt lists URLs that don't resolve well
Evidence: /aventures/planche-a-voile-windsurf returns 404 yet is listed in public/llms.txt; /aventures/escalade and /aventures/canyoning return 200 but are unknown to Google (GSC). Not listed: /cgv is fine. No llms-full.txt (404; optional).
Fix: remove the 404 line (or restore the page/301), re-check after re-indexing; keep the file in sync with sitemap (and fix /aventures/null in the sitemap).

### P2 / Medium - Redirect hygiene for agents
Apex -> www uses 307 (temporary) and http takes 2 hops. Use a 308/301 single hop (Vercel/DNS domain setting).

### P3 / Low (opportunities, not defects)
- Content-Signal line in robots.txt (app/robots.ts:3-9 uses the Next.js object API; add the line by returning a static text route if desired). Decide policy for training vs search vs user agents first.
- Markdown delivery (Accept: text/markdown, .md siblings): absent (404 on /index.md); no confirmed consumer.
- WebMCP: 0 forms annotated, 0 tools (W3C CG draft, Chrome only, checked 2026-09-23). Booking and contact forms are candidates later; do not prioritise.
- ai-catalog.json (ARD 1.0), api-catalog, OAuth, A2A card, UCP: 404, not applicable (no matching service). Web Bot Auth: proposal, not needed.

## Previous audit (2026-06-15)
No agentic category in the previous audit; the JS-only catalogue, /booking indexing and 404 handling carry over. Real 404 is now FIXED (verified with probe URL). Catalogue and booking noindex STILL OPEN.

## Structured findings (audit-data.json, AI Search Readiness)
[
 {"title":"Mobile menu button has no accessible name","severity":"High","description":"axe button-name fails on header toggle (Navbar.tsx:136); Lighthouse Agentic 2/3 mobile and desktop.","recommendation":"Add aria-label and aria-expanded; reaches 3/3."},
 {"title":"Booking form inputs not programmatically labelled","severity":"High","description":"label without htmlFor, 6 inputs without id/aria (BookingForm.tsx:431,530).","recommendation":"Add id/htmlFor and autocomplete attributes."},
 {"title":"Booking pages indexable with generic title","severity":"High","description":"/booking/<id> has no noindex or metadata.","recommendation":"Export metadata with robots noindex."},
 {"title":"Activity catalogue rendered client-side only","severity":"High","description":"Server HTML shows Chargement...; links absent for non-JS agents.","recommendation":"Server-render the list in ActivityFilterableList."},
 {"title":"llms.txt references a 404 URL","severity":"Medium","description":"planche-a-voile-windsurf returns 404 but is listed.","recommendation":"Remove or redirect; sync with sitemap."},
 {"title":"No Content-Signal, Markdown, WebMCP or ai-catalog","severity":"Low","description":"Opportunities only (drafts, checked 2026-09-23).","recommendation":"Optional; define training/search/user policy first."}
]
