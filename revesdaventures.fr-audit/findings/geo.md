# AI Search Readiness (GEO): Rêves d'Aventures (revesdaventures.fr), audited 2026-11-06

## Score: **49/100** (previous audit 2026-06-15: 40/100)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability (passage-level) | 25% | 45 | 11.3 |
| Structural readability | 20% | 55 | 11.0 |
| Multi-modal content | 15% | 40 | 6.0 |
| Authority & brand/entity signals | 20% | 35 | 7.0 |
| Technical accessibility | 20% | 70 | 14.0 |
| **Total** | | | **49** |

Platform estimates (directional): Google AI Overviews / AI Mode 45, ChatGPT Search 40, Perplexity 45, Bing Copilot 35. ChatGPT and Copilot rely heavily on Bing plus third-party listings. Those listings exist, but they contradict the site's NAP and don't name the guide (see F3).

---

## What changed since 2026-06-15

| Previous issue | Status |
|---|---|
| Every page canonicalised to the homepage | **FIXED**. crawl.json shows self-referencing canonicals |
| No `llms.txt` | **FIXED**. `public/llms.txt` is served (200, text/plain), but one entry is stale (F6) |
| Not in Common Crawl | **FIXED**. CC-MAIN-2026-43 (17 Oct 2026) holds 13 pages plus robots.txt, including both blog posts and /guide |
| Placeholder phone in JSON-LD | **FIXED**. `+33 6 83 16 94 02` in `lib/seo.ts:66,100` |
| Add founder `Person` schema | **DONE**, but it carries an inaccurate credential (F1) |
| Add `FAQPage` for the homepage FAQ | **DONE** (homepage plus both blog posts) |

## What works

- **robots.txt** (`User-Agent: * / Allow: / / Disallow: /api/`) allows every crawler. AI search crawlers OAI-SearchBot (ChatGPT Search), Claude-SearchBot (Claude search) and PerplexityBot can all fetch. Googlebot is allowed, so the site is eligible for AI Overviews and AI Mode, and Bingbot is allowed, so Copilot can use it. Training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, cohere-ai) are also allowed, which is a valid choice for a small local business that wants model awareness. No RSL licence (`/license.xml` returns 404), which is optional.
- **SSR/prerender**: activity, guide, blog, niveaux and avis pages return full content in the raw HTML (`is_spa: false`). AI crawlers don't execute JS, so this matters.
- **Blog posts are the best citable assets on the site.** Each opens with a direct answer and a "Points clés" bullet block (level, duration "2h30 à 4h", equipment, place). They use question H2s ("Qu'est-ce que le canyoning ?", "Quel niveau pour débuter ?", "Quelles différences concrètes ?"), a comparison list (sensation/effort/progression/pour qui) and a `FAQPage` with 4 self-contained answers. Each has `BlogPosting` with an author `Person` and dates.
- **/niveaux** has a clear 3-tier rubric (Découverte / Aventure / Warrior × Effort/Technique/Engagement). It is very extractable.
- **/guide** has a strong first-person bio plus a real credentials list in the HTML (`app/guide/page.tsx:106`): "Brevet d'État Escalade/Canyonisme/Via ferrata, BEES 1° Cyclisme option VTT, BEES 1° Canoë-kayak, BEES 1° Voile, Licence STAPS".
- **Off-site listings exist** in the official tourism data chain (Apidae/Geotrek CD05). See F3.

---

## Findings

### F1. The "Guide de haute montagne" claim contradicts the guide's actual diplomas. **High**
"Guide de haute montagne" is a regulated French title (Diplôme d'État d'alpinisme – guide de haute montagne, ENSA). The /guide page lists Brevets d'État in escalade/canyonisme/via ferrata, cycling (VTT), canoë-kayak and voile, but not that diploma. The claim still appears wherever AI systems read entity facts:
- `lib/seo.ts:46` `jobTitle: 'Guide de haute montagne'`
- `lib/seo.ts:47` "guide de haute montagne depuis plus de 30 ans"
- `lib/seo.ts:96` LocalBusiness description "Coaching et guide de haute montagne…"
- `app/layout.tsx:26,27,33` (meta description, keywords, OG description)
- `app/blog/page.tsx:29`, `app/blog/[slug]/page.tsx:61`
- `public/llms.txt:3,8`

LLMs repeat structured claims verbatim. If an answer engine tells a user "Frédéric Buet, guide de haute montagne", that is false and creates legal exposure (Code du sport, title usage). It also clashes with what the listings and the page body say, which weakens entity confidence.
**Fix:** Change the title to what the diplomas support, e.g. `jobTitle: "Moniteur diplômé d'État : escalade, canyoning, via ferrata, VTT, canoë-kayak, voile"`. Add `hasCredential` (`EducationalOccupationalCredential` × 5) and `knowsAbout` to `generateFounderSchema()` in `lib/seo.ts:42-50`. Apply the same wording in layout.tsx, both blog pages and llms.txt. If he does hold the DE guide de haute montagne, list it on /guide. Either way, make the page and the schema say the same thing.

### F2. Activity pages are thin and have no answer-ready facts. **High**
Activity pages are 92-260 words including chrome (crawl.json). The body is evocative copy, e.g. via-ferrata: "une façon unique de progresser en montagne… Format : à la demi-journée". The facts an AI answer needs are missing:
- **No price anywhere in the static HTML.** Prices are only rendered inside upcoming-event rows (`app/aventures/[slug]/page.tsx:724`). Every audited activity page currently shows "Pas de dates prévues prochainement", so engines can't answer "combien coûte un canyoning à Embrun".
- **No named itineraries with details**, while GSC shows demand for exactly those: "canyon de la blache", "rabou canyoning", "canyon de rouannette", "via ferrata les orres" (6 impr), "via ferrata serre eyraud", "via ferrata savines le lac", "via ferrata serre-ponçon" (11 impr across variants). /aventures/via-ferrata gets 112 impressions at average position 23.9. It lists place names ("La Motte-du-Caire, Les Orres, L'Argentière-la-Bessée, Ancelle") with no text about any of them.
- **Generic H2s** ("Description", "Prochains départs", "Infos Pratiques") carry no query semantics.
- **Inconsistent facts:** the canyoning page says "A partir de 10 ans" while the canyoning blog says "dès le plus jeune âge". Locations also differ: "Champsaur, Gapençais, Embrunais, Ubaye" on the page vs "entre Embrun et Guillestre" in the blog.
- **No per-activity schema.** Activity pages only emit the site-wide LocalBusiness/Org plus optional Sanity `customJsonLd` (`page.tsx:226,380`), which is empty on the audited pages.

**Fix (Sanity content plus a small template change):** On each activity page, add a 130-170-word answer block under a question H2 such as "Canyoning près de Serre-Ponçon : prix, âge, durée". State the price ("à partir de X € / pers., demi-journée"), minimum age, group size (2-6, per the tourism listings), duration, meeting area, season and what's included. Add one short paragraph per named site, e.g. "Via ferrata des Orres : niveau, durée, accès". Add 3-5 FAQs with `FAQPage`, and a `TouristTrip`/`Service` + `Offer` JSON-LD built from `priceHalfDay`/`price` with a static "à partir de" price that doesn't depend on events.

### F3. Off-site entity data conflicts with the site (NAP plus category), and the guide is unnamed. **High**
Listings found (Apidae → Geotrek CD05 → tourism-office syndication):
- serreponcon.com (OT Serre-Ponçon): https://www.serreponcon.com/voile/reves-daventures-7720100/ is categorised under "Voile et sports de glisse" and gives **05160 Savines-le-Lac**. Updated 13/08/2026, season 01/03-30/11.
- savines-le-lac.fr/commerce/reves-daventures gives "Commerçants et Artisans", 05160 Savines-le-Lac, email **fredbuet@gmail.com**.
- alpesrando.net/service/2045 (Geotrek CD05, plus a PDF) gives type "Accompagnateurs VTT", Savines-le-Lac.
- provence-alpes-cotedazur.com (FR + EN), sortie-visite.com, bougeici.fr
- Instagram @revesdaventures (live, 200). Facebook /revesdaventures is a 302 login wall, so it couldn't be verified.

The site says otherwise. Schema gives `addressLocality: 'Embrun'`, `postalCode: '05200'` and `streetAddress: 'Lac de Serre-Ponçon'` (`lib/seo.ts:101-106`), which is not a street. The visible email is contact@revesdaventures.fr. No listing names Frédéric Buet as the guide, and none lists the diplomas. AI engines (especially ChatGPT/Copilot via Bing, and Perplexity) cross-reference these sources, so two towns, two emails and three categories (voile / commerce / VTT) lower entity confidence and can lead to misattribution.
**Fix:** Pick one public base. Savines-le-Lac 05160 matches all third-party data and the lake positioning. Then (1) update `generateLocalBusinessSchema()` in `lib/seo.ts:97-112` with a real street or meeting point and matching geo, and (2) ask the OT Serre-Ponçon to correct the Apidae record. That one record syndicates to every site above: set the category to "Activités sportives encadrées / Moniteur escalade-canyoning", add the guide's name and diplomas, use the same email, and add the site URL with UTM. Add every listing URL to `sameAs` (`lib/seo.ts:60-63`).

### F4. Brand-name ambiguity: "Rêves d'Aventures" vs nearby lookalikes. **Medium**
GSC queries show users and Google conflating the brand with similar names: "esprit d'aventure" / "esprit aventure" / "esprit daventure" (10 impressions, pos 37-56), "reve de cimes" / "reve de cime" (4), "reve de bloc" / "rêve de blocs" (3), "rêves de rivières", "reve escalade" (10), "montbrun aventure" (12), "les reves d'ambre". "Rêves de Rivières" is a rafting/hydrospeed base on the Durance at Embrun/Savines (reves-rafting.fr): same "Rêves" prefix, same towns, same outdoor category. That is the most likely confusion for an AI answer about "Rêves … Embrun". The brand query "reve d'aventure" is also singular and unaccented (33 impressions, pos 3.8, the only brand query with a click). Generic "rêve"/"aventure" words give the entity little distinctiveness.
**Fix:** Add disambiguating facts to the entity: `alternateName: ["Reves d'Aventures", "Rêves d'Aventures – Frédéric Buet", "Rêve d'Aventure"]` on the Organization, plus `founder`, `knowsAbout` and `areaServed` (already present). Use the pairing "Rêves d'Aventures – Frédéric Buet, moniteur escalade & canyoning à Savines-le-Lac" in the homepage H1/intro, the /guide title and the GBP name/description. Don't chase "esprit d'aventure" or "reve de cimes": those are other businesses, and those impressions won't convert.

### F5. Weak off-site authority signals (YouTube / Reddit / Wikipedia / reviews). **Medium**
- No Wikipedia/Wikidata entity. That's expected for a micro-business, but a Wikidata item (instance of: business, founder, location, official website) costs little to create and needs no notability bar.
- No YouTube channel or videos found. YouTube mentions show the strongest correlation with AI citation (~0.74). Instagram reels exist, but AI crawlers can't index them.
- No Reddit or forum mentions found.
- Only 4 first-party reviews on /avis (`AggregateRating` 5.0 / 4). A **Google Business Profile could not be verified** from this environment (search-engine scraping was blocked). Confirm in Business Profile Manager that it exists, uses the same name/town/phone/category as F3, and links to the site.
- Web search coverage in this audit was partial: DuckDuckGo results were obtained for 3 queries before rate-limiting. Results for the guide's name alone returned nothing.

**Fix:** Claim or verify GBP (category "Moniteur d'escalade" / "Guide de canyoning"; secondary "Location de vélos"). Ask the 4+ existing reviewers to also post on Google. Publish 3-5 short YouTube videos ("Canyoning à Rabou en famille", "Via ferrata des Orres : à quoi s'attendre") with the site URL and brand plus guide name in titles and descriptions. Create a Wikidata item and add its URL to `sameAs`.

### F6. llms.txt: present but stale and thin. **Low**
`public/llms.txt:35` lists `/aventures/planche-a-voile-windsurf`, which now returns 404. Activity entries (lines 22-35) have no descriptions, unlike the "Pages principales" section. The summary repeats the "Guide de haute montagne" claim (F1).
**Fix:** Remove or redirect the windsurf URL. Add one line per activity with price-from, age-from, duration and places. Correct the job title. Since activities live in Sanity, consider generating it in `app/llms.txt/route.ts` so it can't drift again (the /aventures/null sitemap issue shows the same drift risk).

### F7. Removed windsurf page held the only performing non-brand topic. **Medium**
`/aventures/planche-a-voile-windsurf` now returns 404 but still has 86 impressions and 3 clicks in 90 days. Those are the only non-brand query clicks: "planche a voile serre poncon", "lac de serre poncon windsurf". The tourism-office listing also files the business under "Voile". Losing this page removes the only answer source for windsurf queries.
**Fix:** 301 to `/aventures/vtt-et-planche-a-voile` (or restore a windsurf page) in `next.config.ts` redirects, and update llms.txt.

### F8. Technical gaps that hide content from AI crawlers. **Medium (cross-ref Technical)**
- The activity catalogue (/aventures/mono-activite, /duo-activites, /multi) is client-only ("Chargement…" in HTML), so AI crawlers can't discover duo activities from those hubs (0 HTML inlinks). llms.txt partly compensates.
- 5 key pages are unknown to Google (/blog, both blog posts, /aventures/canyoning, /aventures/escalade). These are the best GEO assets, and AI Overviews/AI Mode can only cite indexed pages. Internal links from the homepage and activity pages to the blog posts, plus a GSC indexing request, are the fastest win.
- `/guide` emits an empty JSON-LD block `[]` when Sanity has no custom JSON-LD (`app/guide/page.tsx:42-45`). It's harmless, but the guide page should emit a full `ProfilePage` + `Person` with `hasCredential`.

### F9. Few verifiable data points or source attributions. **Low**
Blog posts state facts ("2h30 à 4h", "fonte des neiges") but cite no sources and include no local figures (number of canyons, approach times, water temperatures, via ferrata grades). Bylines show the author, but the visible page doesn't show his credentials next to the article.
**Fix:** Add an author box under each post with the name, diplomas and a link to /guide. Add 2-3 concrete local data points per post: named canyons with grade (v/a/E), height of the biggest jump, via ferrata grade (F/PD/AD/D), with a link to the official source (Geotrek CD05, FFME/FFS topo).

---

## Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Correct "Guide de haute montagne" everywhere; add `hasCredential` with the actual BE/BEES diplomas (F1) | High: accuracy plus legal | 30 min (code) |
| 2 | Align NAP: one town/address/email across schema, GBP and the Apidae record (tourism office); name the guide and diplomas in the listing; add listing URLs to `sameAs` (F3) | High: entity confidence on all engines | 1-2 h + OT email |
| 3 | Add a facts block (price-from, age, duration, group size, places, season) plus 3-5 FAQs and `Offer` schema on each activity page; add named-site paragraphs for via ferrata and canyoning (F2) | High: makes pages answerable/citable | 1-2 days of content |
| 4 | Get blog posts, canyoning and escalade indexed: link the blog from home/activity pages, request indexing (F8) | High: unlocks AIO/AI Mode citations | 1 h |
| 5 | 301 the windsurf URL; refresh llms.txt (descriptions, no 404, correct title) (F6/F7) | Medium | 30 min |

Next tier: verify/claim GBP and gather Google reviews; add `alternateName` disambiguation; start short YouTube videos; create a Wikidata item.

## AI crawler access

| Crawler | Governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed (wildcard) |
| Claude-SearchBot | Claude search citations | Allowed |
| PerplexityBot | Perplexity | Allowed |
| Googlebot | Google Search + AI Overviews / AI Mode | Allowed |
| Bingbot | Bing + Copilot | Allowed |
| GPTBot | OpenAI training only | Allowed |
| ClaudeBot | Anthropic training only | Allowed |
| Google-Extended | Gemini/Vertex training & grounding (not AIO) | Allowed |
| Applebot-Extended | Apple Intelligence training (not Siri/Spotlight) | Allowed |
| CCBot, cohere-ai | Training | Allowed |

llms.txt: **present**, well-formed, partly stale (F6). RSL: absent (optional).

## Structured data for audit-data.json (AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 49,
  "previous_score": 40,
  "subscores": {"citability": 45, "structure": 55, "multimodal": 40, "authority": 35, "technical": 70},
  "findings": [
    {"id": "GEO-1", "severity": "High", "title": "Unsupported 'Guide de haute montagne' title in schema/meta/llms.txt", "files": ["lib/seo.ts:46-47,96", "app/layout.tsx:26-33", "app/blog/page.tsx:29", "app/blog/[slug]/page.tsx:61", "public/llms.txt:3,8"]},
    {"id": "GEO-2", "severity": "High", "title": "Activity pages thin, no static price, no named itineraries, generic H2s, no per-activity schema", "files": ["app/aventures/[slug]/page.tsx:724", "app/aventures/[slug]/page.tsx:380"]},
    {"id": "GEO-3", "severity": "High", "title": "NAP conflict: listings say 05160 Savines-le-Lac + fredbuet@gmail.com, schema says Embrun 05200; guide unnamed off-site", "files": ["lib/seo.ts:60-63,97-112"]},
    {"id": "GEO-4", "severity": "Medium", "title": "Brand ambiguity (Rêves de Rivières, esprit d'aventure, reve de cimes); add alternateName and disambiguation"},
    {"id": "GEO-5", "severity": "Medium", "title": "No YouTube/Reddit/Wikidata presence; GBP unverified; 4 reviews"},
    {"id": "GEO-6", "severity": "Low", "title": "llms.txt lists 404 windsurf URL, activities lack descriptions", "files": ["public/llms.txt:22-35"]},
    {"id": "GEO-7", "severity": "Medium", "title": "Windsurf page 404 still has 86 impressions / 3 clicks; needs 301", "files": ["next.config.ts"]},
    {"id": "GEO-8", "severity": "Medium", "title": "Blog posts + canyoning/escalade unknown to Google; catalogue CSR-only; empty JSON-LD on /guide", "files": ["app/guide/page.tsx:42-45", "components/ActivityFilterableList.tsx"]},
    {"id": "GEO-9", "severity": "Low", "title": "No sourced local data points or author box on blog posts"}
  ],
  "fixed_since_previous": ["canonical bug", "llms.txt added", "Common Crawl presence", "placeholder phone", "founder Person schema", "FAQPage"]
}
```
