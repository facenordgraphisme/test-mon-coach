# Search Experience (SXO) — revesdaventures.fr — 2026-11-06

**SXO Gap Score: 41/100** (separate from the SEO Health Score)
Scope: `/`, `/aventures/via-ferrata`, `/aventures/canyoning`, `/aventures/escalade`, `/aventures/mono-activite` (+ `/aventures/vtt-et-vtt-electrique`, `/multi` for the e-bike and group queries).
Method: pages rendered with `render_page.py --mode always` (Playwright, post-JS DOM); SERPs gathered with WebSearch for 13 target queries; GSC 90-day queries/pages from `raw/`.

---

## Key insight (lead finding)

**The local SERPs are not won by operator sites. They are won by aggregators that show "listing" content: price from X €, duration, minimum age, exact route or canyon name, meeting point.**
Across the target queries, roughly 75-85% of visible results are (a) Apidae-fed tourist-office fiches (provence-alpes-cotedazur.com, hautes-alpes.net, serreponcon.com, lesorres.com, serre-chevalier.com), (b) OTAs/marketplaces (Funbooker, Manawa, CheckYeti, Yumping, cap-adrenaline), (c) route/topo databases (Geotrek PDFs, viaferrata.org, oblyk, komoot, visugpx), or (d) one local blog (vvanat.fr) for windsurf. Single-guide operator sites like ours almost never appear directly. When they do, it is through their **tourist-office fiche** (Talweg Les Orres, Bureau des Guides La Grave, Canyoning Serre-Ponçon, Horizons Tout Terrain E.asy Bike).

Our activity pages are **thin brand service pages**: the title is just "Via ferrata | Rêves d'Aventures", there is no place name in the title, **no price anywhere**, about 170-200 words, and an empty "Prochains départs" box. They match neither the listing pattern (price, duration, age, meeting point) nor the route-info pattern (which via ferrata, grade, duration).
=> **Page-type mismatch severity: HIGH** for the Hautes-Alpes / Serre-Ponçon / Les Orres via ferrata and canyoning clusters. **CRITICAL** for "planche à voile serre-ponçon" because no page exists any more. **HIGH** for "team building" because no page exists.

---

## What works

- One clear operator identity: a single guide (Frédéric Buet), small groups of 2-6, a "Réserver" CTA with Stripe online booking, and a "Demander une date" fallback. This is a real differentiator against OTAs ("pas de foule, pas de format standard").
- The canyoning page states the practical facts the SERP rewards: "A partir de 10 ans", the kit list, and "être à l'aise dans l'eau". Via ferrata names its routes (Les Orres, La Motte-du-Caire, L'Argentière, Ancelle).
- There is a level system (Découverte / Aventure / Warrior) on the homepage and `/niveaux`, which helps the sporty-couple persona self-qualify.
- Real, named testimonials on the homepage, with an AggregateRating on `/avis` (an earlier audit item, now FIXED).
- Two ~900-word blog posts (canyoning beginner guide; via ferrata vs escalade) target the informational intent the SERP shows. But Google does not know about them yet (GSC "URL unknown"), so they give no SXO value today.
- The homepage H2 above the H1 is now a descriptive tagline ("Escalade · Canyoning · VTT · Hautes-Alpes"). The earlier duplicate brand H2/H1 is FIXED.

---

## 1. SERP backwards analysis

Note: WebSearch is not a geo-located google.fr SERP. Local pack, PAA, ads and AI Overview were **not observable** (see Limitations). Classification uses `page-type-taxonomy.md`. Tourist-office/Apidae fiches count as **Local listing**, OTA activity pages as **Product**, and topo/route pages as **Blog/Info**.

| Query cluster (GSC impr / our pos) | What ranks (observed) | Dominant type (confidence) | Our matching page | Fit |
|---|---|---|---|---|
| via ferrata serre-ponçon / serre ponçon (11 impr, pos 16-21) | Geotrek PDFs (Cascade, Orres, Marcellinas), Apidae fiches (Via Ferrata Ancelle – OT Serre-Ponçon), Funbooker category "Via Ferrata Hautes-Alpes", serre-chevalier.com | Route info + local listing (~70%) | `/aventures/via-ferrata` (193 words, routes listed by name only) | **HIGH mismatch**: no grade, duration, minimum age or price per route |
| via ferrata les orres (11 impr, pos 31-33) | lesorres.com fiches (La Cascade, "a guide is advised for a first attempt"), oblyk, via-ferrata.de topo, Funbooker "Via ferrata de Marcelinas près d'Embrun" **38 €/pers, ~3h** | Route info (~60%) + OTA product (~25%) | same | **HIGH**: the SERP says "a guide is recommended", which is exactly our offer, but we have no "Via ferrata des Orres accompagnée" section |
| guide via ferrata hautes alpes (10 impr, pos 55) / via ferrata hautes alpes (13 impr, pos 54-56) | cap-adrenaline, Bureau des Guides La Grave fiches (several OT sites), Funbooker "from ~32 €", glisshop list, viaferrata.org | OTA/OT listing of guided outings (~65%) | same | **HIGH**: our page is a generic department-wide page with no price or "from" anchor |
| canyoning embrun (8+2 impr, pos 28-30) / canyoning serre-ponçon (2 impr, pos 37) | Apidae fiches (Canyoning Serre-Ponçon "from 45 €", Activités Nature Les Orres, Oïe Oïe Oïe), CheckYeti, Yumping ("Canyon de la Rouanette 3h from 60 €"), Manawa, serreponcon.com "most beautiful rivers" | Local listing/Product (~75%) | `/aventures/canyoning` (**not known to Google**) | **MEDIUM type fit, CRITICAL indexing**: page type is roughly right, but it names no canyons (only regions) and has no price. It also cannot rank because Google has not discovered it |
| canyon de la blache / rouannette / la blache (5 impr, pos 11-27) | (canyon-name queries) topo/OT | Route info | none | **Opportunity**: we already get impressions on canyon names with no page about them |
| escalade embrun / serre poncon (1-2 impr) | Fragmented: no operator, mostly generic or irrelevant results (Club Nautique, OT pages, job ads) | No consensus (<40%) | `/aventures/escalade` (**not known to Google**) | **LOW competition, ALIGNED type**: winnable once indexed and the title includes "Embrun / Serre-Ponçon" |
| planche à voile serre-ponçon (7 impr, **1 click**, pos 12.3) / lac de serre poncon windsurf (3 impr, 1 click) | vvanat.fr blog spot guides (6 of the top 10), Apidae fiches (Ecole de voile Serre-Ponçon Windsurf, Base nautique La Voilerie) | Blog/Info (~60%) + Local listing (~30%) | **none**: old `/aventures/planche-a-voile-windsurf` now 404 (86 impr, 3 clicks in 90d), no redirect in `next.config.ts`; only the duo `/aventures/vtt-et-planche-a-voile` remains | **CRITICAL**: the only cluster that produced clicks has lost its page |
| VTT électrique embrun (no GSC query; page pos 6.8) | visugpx/komoot route lists, rental shops (Alpes 2 Roues, Intersport via lokki), guided competitor Horizons Tout Terrain E.asy Bike **"VTT + e-bike 20 km, 55 €"** | Route info (~45%) + rental/local listing (~45%) | `/aventures/vtt-et-vtt-electrique` (160 words) | **MEDIUM**: no price, no e-bike included or rental info, no km/D+ |
| team building serre-ponçon (GSC "team building" pos 6.5, "corporate activity" pos 5) | Manawa provider pages, MICE hotel brochures, receptive agency (Re)Connect Embrun, listicles | Listing/agency (~70%) | none (`/multi` mentions "groupes" in one sentence, `app/multi/page.tsx:41`) | **HIGH**: no page, and the 2-6 group size is not stated against the B2B need |
| activités famille serre-ponçon | sncf-connect / ou-et-quand listicles, OT fiches, CheckYeti "rafting pour enfants", Funbooker "40 activités" | Listicle + OTA (~70%) | `/` or `/aventures/mono-activite` | **MEDIUM**: no family entry point, and no minimum ages shown on the hub |

SERP-wide signals used below:
- Price anchors everywhere (32 / 38 / 45 / 55 / 60 €).
- Durations ("3h", "2h30", "3 à 4h").
- Minimum ages ("dès 7 ans", "à partir de 10 ans", "taille min 135 cm").
- Named routes and canyons.
- "Guide recommandé pour une première" (lesorres.com).
- Weather/cancellation guarantees (Manawa "remboursement en cas de mauvais temps").

---

## 2. Findings

### F1 — CRITICAL — Planche à voile / windsurf page deleted; the one clicking cluster now hits a 404
- **Evidence:** GSC shows `/aventures/planche-a-voile-windsurf` at 86 impressions, 3 clicks, pos 11.3. Queries: "planche a voile serre poncon" (pos 12.3, 1 click) and "lac de serre poncon windsurf" (pos 14.7, 1 click). Crawl shows the URL is gone (404). `next.config.ts` has no redirect for it (only `/activities/*` at lines 34-39). The homepage copy still promises "windsurf".
- **Fix:** Restore a mono-activity page "Planche à voile & windsurf – Lac de Serre-Ponçon (Embrun / Savines)" in Sanity. Cover the thermal wind window (afternoons, Savines→Embrun), level, price and equipment. Until then, add a 301 in `next.config.ts` `redirects()` from `/aventures/planche-a-voile-windsurf` to `/aventures/vtt-et-planche-a-voile`.

### F2 — HIGH — Activity pages fail the SERP's "listing" pattern: no price, no duration, no age, no named spot in title
- **Evidence:** The rendered DOM of via-ferrata, canyoning and escalade contains **0 occurrences of €**. Price is only rendered inside the upcoming-event card (`app/aventures/[slug]/page.tsx:724`). When there are no events, the sidebar shows "Pas de dates prévues prochainement." (`:747`) with no price. `priceHalfDay`/`priceFullDay` exist only for bike rental (`:611`, `:628`). Competitors in the SERP all show "from X €".
- **Evidence:** Titles and descriptions come from a template. The title is `doc.title`, giving "Via ferrata | Rêves d'Aventures". The description is the same sentence for every activity (`app/aventures/[slug]/page.tsx:202-203`), unless a Sanity `seo` override exists. None of the target modifiers (Serre-Ponçon, Embrun, Les Orres, Hautes-Alpes) appears in the activity titles. **STILL OPEN** from the 2026-06-15 action plan, item at ACTION-PLAN.md:58-59.
- **Fix:**
  1. Add a `priceFrom` (and `durationLabel`, `minAge`) field to the `activity` schema in Sanity. Render a fixed "Infos clés" strip under the H1 (À partir de 45 €/pers · ½ journée (3h) · Dès 10 ans · Départ Embrun) whether or not events exist.
  2. Change the empty state at `:747` to "Prochaine saison : avril-octobre. Réservez une date privée dès X €" and send it to the booking form, not `/contact`.
  3. Fill `seo.title` in Sanity, for example "Via ferrata guidée Serre-Ponçon & Les Orres | Rêves d'Aventures" and "Canyoning Embrun & Serre-Ponçon – sortie guidée dès 10 ans". Also make the fallback at `:202-203` include the location.

### F3 — HIGH — Via ferrata page is department-generic while the SERP is route-specific
- **Evidence:** The ranking pages are per-route (Cascade, Marcellinas/Orres, Ancelle, Croix de Toulouse). lesorres.com itself advises a guide for a first attempt. Our page lists 4 route names with no grade, duration, age, or "with guide vs alone" argument. Our position is 31-55 for these queries; Funbooker ranks with a 38 € guided Marcellinas listing.
- **Fix:** On `/aventures/via-ferrata`, add one H2 block per route: "Via ferrata des Orres (Marcellinas / La Cascade) avec guide", giving grade, duration, minimum age or height, why a guide helps, and price. Add `TouristTrip` or `Service` + `Offer` JSON-LD per route. Link the existing blog post "Via ferrata ou escalade" both ways. This turns a service stub into the Hybrid (service + route info) type that matches both the OT and OTA halves of the SERP.

### F4 — HIGH — Canyoning and escalade pages are invisible (not known to Google) and absent from the homepage slider
- **Evidence:** GSC inspection shows `/aventures/canyoning` and `/aventures/escalade` as URL unknown to Google. The rendered homepage "Découvrez nos aventures" slider shows only Escalade, Via ferrata, Vélo de route and VTT (rendered H3s). **Canyoning is missing from the homepage**, although the H1 tagline promises "Canyoning". Probable cause: `components/ActivityPreviewSection.tsx:11` takes `order(_createdAt desc)[0...12]` over all formats, and the slider defaults to `filter='mono'` (`components/ActivitySlider.tsx:23`), so older mono activities can drop out. The mono hub catalogue is client-only (orchestrator finding).
- **Fix:** Order the slider by an explicit `featured`/`order` field, or remove the 12 limit. Add static, server-rendered links to all 6 mono activities on `/` and `/aventures/mono-activite`. Then request indexing.
- **Opportunity:** Canyon-name queries ("canyon de la blache" pos 22-27, "canyon de rouannette" pos 11) already trigger impressions. Name the canyons on the canyoning page (Blache, Rouanne/Rouannette, Couleau, Fournel…) with a short sheet each.

### F5 — HIGH — No page for groups / team building, although GSC shows demand at good positions
- **Evidence:** "team building" ranks at pos 6.5 and "corporate activity" at pos 5 with 0 clicks. No page mentions entreprise, séminaire or team building (grep over `app/` and `components/`). `/multi` has one generic sentence (`app/multi/page.tsx:41`, 203 words). The SERP for team building serre-ponçon is agencies and Manawa provider pages.
- **Fix:** Create `/groupes-entreprises` (or a strong section on `/multi`). State capacity honestly: 2-6 per guide, larger groups by rotating workshops or partner guides. Add sample half-day and day programmes (Duo vélo + via ferrata), a "devis sous 48h" form, a cancellation/weather policy and invoicing/TVA info.

### F6 — MEDIUM — Mono-activité hub uses internal jargon and is not a "things to do" hub
- **Evidence:** H1 "Mono-Activité"; the query "mono activité" (pos 7.8, 9 impr) is untargeted noise. The SERP for family/holiday queries rewards "Que faire à Serre-Ponçon / activités outdoor Embrun" listicles. Rendered page: 481 words, and the activity list depends on client JS.
- **Fix:** Retitle it "Activités outdoor guidées à Serre-Ponçon & Embrun – escalade, canyoning, via ferrata, VTT" (keep "Mono-activité" as an eyebrow). Add a server-rendered comparison table: activity · minimum age · duration · level · from €. This is the comparison format users get from Funbooker and Manawa.

### F7 — MEDIUM — Homepage H1 is the brand only; formats lead before the activity × place promise
- **Evidence:** H1 "Rêves d'Aventures"; brand queries already rank (pos 3.8). The first H2 is "Nos Formules" (Mono/Duo/Multi), a structure users have to learn before seeing activities, prices or ages. There is no "à partir de" anywhere on `/`.
- **Fix:** Use H1 "Guide escalade, canyoning, via ferrata & VTT à Embrun – Lac de Serre-Ponçon". Put a 3-column "Pour qui ?" strip first: Familles (dès 10 ans) / Couples sportifs (Duos) / Groupes & entreprises. Move Mono/Duo/Multi below it.

### F8 — MEDIUM — Trust signals are not on the decision pages
- **Evidence:** On activity pages the "Avis" tab only renders when `activity.reviews.length > 0` (`app/aventures/[slug]/page.tsx:491-498`); none showed in the rendered pages. The guide's diplomas and experience live only on `/guide`. No weather/cancellation guarantee is shown, although Manawa sells on it.
- **Fix:** Add a global trust strip on every activity page: "Guide diplômé d'État · 30 ans d'expérience · 4,9/5 (N avis Google) · Annulation météo = report ou remboursement". Link to `/avis` and `/cgv#annulation`.

### F9 — MEDIUM — Off-site SXO: not present where the SERP actually is
- **Evidence:** Competitor guides (Talweg, Canyoning Serre-Ponçon, E.asy Bike) rank through Apidae fiches on provence-alpes-cotedazur.com, serreponcon.com and lesorres.com, and through Funbooker/Manawa listings. No Rêves d'Aventures fiche appeared in any of the 13 SERPs checked.
- **Fix:** Register with the Office de Tourisme Intercommunal Serre-Ponçon (Apidae fiche per activity, which is syndicated to 4+ ranking domains). Consider one OTA (Funbooker or Manawa) for via ferrata and canyoning. Link those fiches back to the matching `/aventures/*` page. See `/seo local` for the GBP.

### F10 — LOW — VTT électrique page is missing the e-bike specifics the SERP shows
- **Evidence:** The competitor shows "20 km, 260 m D+, niveau moyen, 55 €" and departures from Embrun and Les Orres. Rental shops show half-day/day prices. Our page (160 words) has no distance, D+, e-bike rental price or minimum height.
- **Fix:** Add 2-3 sample loops (km / D+ / duration), whether the e-bike is included, a "from" price, minimum height (about 135-140 cm) and the departure point.

---

## 3. User stories (derived from SERP signals)

1. **Awareness — family holidaymaker:** "As a parent on holiday at Serre-Ponçon, I want to know which outdoor activities my 10- and 13-year-olds can do, so that I can plan one 'big' day." *Signal:* family listicles and "rafting pour enfants" OTA pages; "dès 7 ans / à partir de 10 ans" in the via ferrata SERP; GSC "chose à faire en famille autour de moi" (pos 1), "a 13 ans" (pos 2).
2. **Consideration — route researcher:** "As someone who found via ferrata des Orres, I want to know its difficulty and whether I need a guide, so that I do not get stuck on a D-grade route." *Signal:* lesorres.com "guide advised for a first attempt", Geotrek "Niveau D", oblyk "PD to 7a".
3. **Decision — price comparer:** "As a visitor comparing operators, I want to see a 'from' price and duration, so that I can book without contacting anyone." *Signal:* Funbooker 38 €/3h, Canyoning Serre-Ponçon "from 45 €", Yumping "from 60 €", E.asy Bike 55 €.
4. **Consideration — windsurfer:** "As a windsurfer, I want to know when the thermal wind blows and whether I can get lessons or a guided session, so that I can choose my afternoon." *Signal:* vvanat.fr blog cluster (thermal Savines→Embrun, afternoons); Apidae school fiches.
5. **Decision — team organiser:** "As an HR or team lead, I want a turnkey half-day with a quote and a weather plan, so that I can sell it internally." *Signal:* MICE brochures, (Re)Connect receptive agency, Manawa weather guarantee, GSC "team building" pos 6.5.

---

## 4. SXO Gap Score — 41/100

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 7/15 | Service pages where the SERP wants listing/product (price, duration, age) plus route info; no page at all for windsurf and groups |
| Content Depth | 5/15 | Activity pages 160-200 words (crawl); no routes or canyons described; good 900-word blog posts but not indexed |
| UX Signals | 7/15 | Clear "Réserver" and online payment; but empty "Prochains départs" off-season, no price, "Demander une date" goes to generic `/contact`; homepage leads with format jargon |
| Schema | 5/15 | Activity pages carry only site-wide SportsOrganization/SportsActivityLocation; no Service/Offer/TouristTrip/price; AggregateRating only on `/avis` |
| Media | 7/15 | 3-5 photos per activity, no video, no route map or topo |
| Authority | 5/15 | Testimonials on `/` and `/avis` only; guide qualifications only on `/guide`; no OT/OTA presence in SERPs |
| Freshness | 5/10 | Calendar with dated sessions exists; activity pages show no dates in November; htmldate 2026-01-01 on activity pages |

---

## 5. Persona scoring (Relevance / Clarity / Trust / Action, 25 each)

Weighting: local/transactional intent dominates (OT/OTA listings), so the family and price-comparer personas are weighted highest.

| Persona | Best-fit page | R | C | T | A | Total | Rating |
|---|---|---|---|---|---|---|---|
| **Group / team-building organiser** | `/multi` (no dedicated page) | 6 | 6 | 8 | 8 | **28** | Critical mismatch |
| **Route researcher → guided conversion** ("via ferrata les orres") | `/aventures/via-ferrata` | 9 | 8 | 10 | 10 | **37** | Critical mismatch |
| **Holidaymaker "que faire à Serre-Ponçon"** | `/`, `/aventures/mono-activite` | 12 | 9 | 10 | 9 | **40** | Needs work |
| **Family tourist** (kids 10-14) | `/aventures/canyoning`, `/aventures/via-ferrata` | 15 | 12 | 9 | 8 | **44** | Needs work |
| **Sporty couple** (levels, Duos, autonomy) | `/aventures/escalade`, `/` | 18 | 13 | 11 | 10 | **52** | Needs work |

Per page (average of the 3 requested personas: family / sporty couple / group):

| Page | Family | Sporty couple | Group | Avg | Biggest gap |
|---|---|---|---|---|---|
| `/` | 46 | 55 | 34 | 45 | No "Pour qui ?" entry, no price, canyoning missing from slider |
| `/aventures/via-ferrata` | 38 | 48 | 30 | 39 | No minimum age, grade or duration per route, no price |
| `/aventures/canyoning` | 52 | 47 | 30 | 43 | No price, no canyon names, not indexed |
| `/aventures/escalade` | 40 | 56 | 30 | 42 | No price, no age, no "Embrun/Serre-Ponçon" in title, not indexed |
| `/aventures/mono-activite` | 40 | 45 | 28 | 38 | Jargon H1, catalogue client-only, no comparison table |

Improvements, weakest persona first:
1. **Group (28):** dedicated page (F5); capacity, sample programmes, quote form, weather policy, invoice.
2. **Route researcher (37):** per-route blocks with grade, duration and age, plus a "why a guide" argument and price (F3).
3. **Holidaymaker (40):** hub retitle plus a comparison table (activity / age / duration / from €) (F6, F7).
4. **Family (44):** "Dès X ans" and "From X €" in an "Infos clés" strip on every activity (F2); family-friendly badge on canyoning and via ferrata.
5. **Sporty couple (52):** surface Duos (vélo + via ferrata) on each mono page as "Version Warrior : faites-le en Duo à vélo"; show levels as badges (already present for VTT).

Systemic weakest dimension across personas: **Action**. Every persona hits "no price + no dates", and the fallback CTA leads to a generic contact page.

---

## 6. Status vs 2026-06-15 audit (SXO-relevant items)

| Item | Status |
|---|---|
| Duplicate homepage H2/H1 brand | FIXED (H2 is now a descriptive tagline; H1 still brand-only, see F7) |
| `/multi` placeholder "Contenu à configurer dans Sanity" | FIXED (real fallback copy, `app/multi/page.tsx:41`) |
| Review/AggregateRating on `/avis` | FIXED |
| Seasonal/educational blog content | PARTIALLY FIXED (2 posts written, but unknown to Google) |
| Thin activity descriptions | PARTIALLY FIXED (real copy, still ~200 words) |
| Generic activity title/description template (ACTION-PLAN.md:58-59) | STILL OPEN (`app/aventures/[slug]/page.tsx:202-203`) |
| Price in activity schema (ACTION-PLAN.md:168) | STILL OPEN (no Offer/price on activity pages) |

---

## 7. Limitations

- SERPs came from WebSearch (not a geo-located google.fr desktop/mobile SERP). Local pack, People Also Ask, ads, AI Overview and exact top-10 order could not be observed. Percentages are approximate shares of the returned results.
- Search volumes are unknown (no keyword tool); persona weights rely on GSC impressions (924 in total, so low statistical confidence).
- November is off-season: the empty "Prochains départs" state may differ in season.
- Google Business Profile and reviews count were not checked (recommend `/seo local`).
- Recommended follow-ups: `/seo schema` (Service/Offer/TouristTrip per activity), `/seo content` (E-E-A-T, guide qualifications on activity pages), `/seo local` (GBP + Apidae/OT listing).

---

## Structured findings (for audit-data.json, category "Search Experience")

```json
{
  "category": "Search Experience",
  "score": 41,
  "findings": [
    {"id": "SXO-1", "severity": "Critical", "title": "Windsurf page 404 — only clicking query cluster lost", "fix": "Restore Sanity activity or 301 /aventures/planche-a-voile-windsurf in next.config.ts redirects()"},
    {"id": "SXO-2", "severity": "High", "title": "Activity pages lack price/duration/age/location vs listing-dominated SERP", "file": "app/aventures/[slug]/page.tsx:202-203,724,747"},
    {"id": "SXO-3", "severity": "High", "title": "Via ferrata page generic vs route-specific SERP (Les Orres, Serre-Ponçon)", "file": "Sanity activity via-ferrata"},
    {"id": "SXO-4", "severity": "High", "title": "Canyoning/escalade unknown to Google; canyoning missing from homepage slider", "file": "components/ActivityPreviewSection.tsx:11; components/ActivitySlider.tsx:23"},
    {"id": "SXO-5", "severity": "High", "title": "No group/team-building page despite pos 5-6.5 impressions", "file": "app/multi/page.tsx:41"},
    {"id": "SXO-6", "severity": "Medium", "title": "Mono-activité hub jargon, no comparison table"},
    {"id": "SXO-7", "severity": "Medium", "title": "Homepage H1 brand-only; formats before audience/activity"},
    {"id": "SXO-8", "severity": "Medium", "title": "Trust signals absent from activity pages", "file": "app/aventures/[slug]/page.tsx:491-498"},
    {"id": "SXO-9", "severity": "Medium", "title": "No Apidae/OT or OTA presence where SERP is won"},
    {"id": "SXO-10", "severity": "Low", "title": "VTT électrique page lacks km/D+/price/e-bike specifics"}
  ]
}
```

*Generate a PDF report? Use `/seo google report`.*
