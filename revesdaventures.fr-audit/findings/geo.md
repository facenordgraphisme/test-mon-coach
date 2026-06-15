# AI Search Readiness (GEO) — Rêves d'Aventures (revesdaventures.fr)

Score: **40/100**

## What works

- `robots.txt` (`Allow: /`, `Disallow: /api/` only) imposes **no restrictions** on AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — content is fully accessible.
- Server-rendered HTML means AI crawlers get full content without executing JavaScript.
- Strong, quotable "About" content on `/guide`: a clear first-person founder narrative ("30 ans d'expérience", "ancien sportif de haut niveau en canoë-kayak") — exactly the kind of passage AI Overviews / ChatGPT / Perplexity like to cite for "who runs this / can I trust them" queries.
- Structured local-business data (`SportsActivityLocation` with full address, geo-coordinates, `areaServed` list of 5 named places) gives AI systems an unambiguous entity + location anchor for "adventure guide near Lac de Serre-Ponçon" type queries.
- `/avis` provides real, attributed, dated testimonials — good raw material for AI-generated "what do customers say" summaries.
- `/calendrier` provides current, dated availability/pricing — useful for "when can I book X" answers, provided it stays fresh.

## Issues

### 1. The canonical bug undermines citability of every non-homepage page
**Severity: Critical (shared with Technical finding #1)**

AI crawlers and answer engines, like Google, respect `rel=canonical`. With every page declaring the homepage as canonical, an AI system that wants to cite "the via ferrata page" or "the guide's bio" may instead resolve/attribute that content to the homepage URL, or simply deprioritize indexing the page's content as a distinct citable unit. Fixing the canonical issue is the highest-leverage GEO fix available.

### 2. No `llms.txt`
**Severity: Low (informational)**

`https://www.revesdaventures.fr/llms.txt` returns 404. `llms.txt` is an emerging (non-standardized) convention some sites use to give LLM crawlers a curated map of key pages/content. Not required, but for a small site with a clear page set (activities, guide bio, levels, access, calendar, reviews), it's a low-effort addition: a Markdown file listing the site's key URLs with one-line descriptions, served at `/llms.txt` (trivial to add as a static file in `public/` or via a new `app/llms.txt/route.ts`).

### 3. Zero presence in Common Crawl
**Severity: Info**

A domain-level Common Crawl index lookup returned `"No Captures found for: revesdaventures.fr"`. Common Crawl underpins training data for many LLMs. This isn't actionable directly (it reflects the site's current external link/authority profile and crawl history more than an on-page fix), but it reinforces that **off-site signals** (backlinks, directory listings, Google Business Profile, social profiles already linked via `sameAs`) matter for this site's AI visibility, not just on-page structure.

### 4. Phone number inconsistency affects AI-generated local answers too
**Severity: High (shared with Schema finding #1)**

If an AI assistant answers "what's the phone number for Rêves d'Aventures" by reading the site's `SportsOrganization`/`SportsActivityLocation` JSON-LD, it will currently surface the placeholder `+33 6 00 00 00 00` rather than the real `+33 6 83 16 94 02`. Fixing this in `lib/seo.ts` (see Schema findings) directly improves answer accuracy.

## Opportunities

- Add `Person`/`founder` schema for Frédéric Buet linked from the `SportsOrganization`, surfacing his 30-year experience and ex-athlete background as structured data — reinforces both classic E-E-A-T and AI-citable "who is the expert" signals.
- Consider a short FAQ schema (`FAQPage`) for the homepage's existing "Questions Fréquentes" section (Apporter son propre matériel, Niveau requis, Annulation, etc.) — this content already exists as an FAQ accordion; marking it up makes it directly answer-engine-friendly.
