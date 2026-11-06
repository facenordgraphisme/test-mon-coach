# Content Quality & E-E-A-T — revesdaventures.fr (2026-11-06)

**Content Quality score: 46/100** (previous audit 2026-06-15: 55/100. Some issues are fixed, but this pass scores things the last one did not: trust/legal defects, fake fallback reviews in the HTML, and the full GSC gap analysis.)

| E-E-A-T factor (internal weights) | Score | Notes |
|---|---|---|
| Experience (20%) | 55 | First-person voice, real local specifics (col du Granon, Chorges, col Lebraut, night train to Embrun), but no stories, trip reports or captioned real photos |
| Expertise (25%) | 58 | Real state diplomas listed on /guide (BE Escalade/Canyonisme/Via ferrata, BEES 1° Cyclisme VTT, Canoë-kayak, Voile), but only as badges, never in body copy or on activity pages. Schema calls him "Guide de haute montagne", which is wrong |
| Authoritativeness (25%) | 28 | 4 reviews on /avis, no link to Google Business reviews, no press, partners, OT/clubs, or federation mentions |
| Trustworthiness (30%) | 38 | Unfinished legal notice (placeholder, empty host, invalid e-mail), fabricated fallback testimonials served in homepage HTML, no prices on activity pages |
| **Weighted E-E-A-T** | **44** | |

**AI citation readiness: 38/100.** The blog posts have a "Points clés" block and question-style H2s, which is good. Activity pages have no quotable facts (no prices, durations in hours, minimum ages, route names with grades, distances), no FAQ, and are 54-208 words of main content.

**Readability (Kandel-Moles, the French Flesch):** blog posts 67-70, activity pages 74-79, /guide 63 (average sentence length 24 words). Good overall, so readability is not a problem.

**Templated metadata (metadata_template.py, 29 pairs):** `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. The heuristic does not catch a manual finding: all 14 `/aventures/*` descriptions use the same sentence, "Découvrez l'activité {title} avec Rêves d'Aventures. Expérience exclusive au cœur des Hautes-Alpes et du lac de Serre-Ponçon.", generated at `app/aventures/[slug]/page.tsx:203`. See C-6.

---

## Status of previous audit (2026-06-15) issues

| Previous issue | Status |
|---|---|
| `/multi` showed "Contenu à configurer dans Sanity" placeholder | **FIXED**: real subtitle now ("Créez votre séjour sur-mesure : combinez escalade, canyoning et VTT…") |
| Duplicate `/activities/*` vs `/aventures/*` | **FIXED**: 301 redirects in `next.config.ts:33-44`. `app/activities/[slug]/page.tsx` is now dead code and can be deleted |
| "Description détaillée à venir…" fallback (`app/aventures/[slug]/page.tsx:511`) | **FIXED in practice**: not rendered on any of the 14 activity pages fetched |
| No blog / informational content | **PARTIAL**: 2 posts published 15 June 2026, both still unknown to Google (GSC inspect) |
| /guide credentials under-used | **STILL OPEN**: diplomas are now shown as badges, but nowhere else (see C-2) |
| /avis not leveraged | **STILL OPEN**: still 4 reviews, no aggregate or Google link |

## What works

- Authentic first-person voice from a real, named operator (Frédéric Buet, EI, SIRET 851411934 00017, address in Saint-Apollinaire 05160).
- Real local detail that cannot be produced by a template: `/aventures/velo-de-route` (Bonette, Cayolle, Izoard, Granon, "la tarte aux myrtilles du col du Granon", Moissières, Pontis…), `/aventures/kayak-et-escalade` (crossing the lake by double kayak to a crag graded 3 to 6c), `/aventures/vtt-et-planche-a-voile` ("vent thermique qui se lève vers 13h"), `/acces` (Paris to Embrun night train with times).
- Real dated reviews on `/avis` with specific places ("aiguilles de Chabrières", "col Lebraut").
- /guide lists real French state qualifications: "Brevet d'État Escalade/Canyonisme/Via ferrata", "BEES 1° Cyclisme Option VTT", "BEES 1° Canoé-kayak", "BEES 1° Voile".
- Blog posts have a byline (Frédéric Buet), a visible date, a "Points clés" summary, question-led H2s and internal links to activity pages and the calendar.
- Readability suits a leisure audience.

---

## Findings

### C-1 · Critical: fabricated testimonials served in the homepage HTML
`components/ReviewSection.tsx:29-52` is a client component (`"use client"`, fetch in `useEffect`). The server-rendered/prerendered HTML therefore always contains the **hard-coded fallback reviews**: "Aventurier Anonyme", "Marie L.", "Thomas B.", dated 2024 and labelled `source: "google"`. Confirmed with `curl https://www.revesdaventures.fr/`: all three names are present. Googlebot's first-pass HTML and every AI crawler that does not run JS see invented reviews. Real reviews only replace them after hydration.
- Risk: QRG "deceptive" trust signal. In France, fake consumer reviews are a deceptive commercial practice (Code de la consommation L121-4; DGCCRF enforcement).
- **Fix:** make `ReviewSection` a server component that fetches the latest 3 `review` docs (same GROQ as `/avis`). Delete the fallback array, or render nothing when there are no reviews.

### C-2 · Critical (Trust/accuracy): "Guide de haute montagne" claim does not match his diplomas
`lib/seo.ts:46` (`jobTitle: 'Guide de haute montagne'`), `lib/seo.ts:47` ("guide de haute montagne depuis plus de 30 ans"), `lib/seo.ts:96`, `app/layout.tsx:26,27,33`, `app/blog/page.tsx:29`, `app/blog/[slug]/page.tsx:61`. "Guide de haute montagne" is a specific regulated diploma (DE de guide de haute montagne, ENSA). The qualifications shown on /guide are BE/BEES escalade-canyon-via ferrata, VTT, kayak and voile. Claiming a title you do not hold is a trust failure for QRG raters and potentially a legal one (Code du sport).
- **Fix:** replace it everywhere with an accurate title, e.g. "Moniteur diplômé d'État escalade, canyonisme, VTT, voile et canoë-kayak". In `Person` schema add `hasCredential` (EducationalOccupationalCredential) per diploma. If he does hold the DE guide HM, add it to the /guide badges instead.

### C-3 · High (Trust): unfinished legal notice
`/mentions-legales` (Sanity `legalPage`) renders:
- "Responsable de la publication : **[Nom Prénom]**", a literal placeholder.
- "Hébergeur du site, Nom : / Adresse : / Téléphone :", all empty. This is mandatory under LCEN art. 6-III (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA).
- Domain written "www.rêvesd'aventures.fr" and e-mail "contact@revesd'aventures.fr". **Both are invalid** (apostrophe/accent), so the only written contact address on the legal page is broken.
- **Fix:** edit the Sanity legalPage document: publisher = Frédéric Buet; host = Vercel; domain `www.revesdaventures.fr`; e-mail `contact@revesdaventures.fr` (check the real mailbox). Also add the **carte professionnelle d'éducateur sportif** number (mandatory to hold, and a strong trust signal) and the RC Pro insurer.

### C-4 · High: thin activity pages (all 14 `/aventures/*`)
Main-content word counts (trafilatura `extracted_text`, without nav and footer): via-ferrata 142, canyoning 153, escalade 129, velo-de-route 205, vtt-et-vtt-electrique 125, kayak-et-escalade 208, vtt-et-planche-a-voile 189, via-ferrata-et-escalade 150, vtt-et-escalade 146, velo-de-route-et-escalade 143, velo-de-route-et-via-ferrata 143, **multi-activite 63**, **programme-tout-a-velo 54**. Service-page floor is about 800 words. All pages currently also show "Pas de dates prévues prochainement".
Missing on every page: price ("à partir de … €", no `€` anywhere in activity HTML), duration in hours, group size (only velo-de-route says "6 max"), minimum age (only canyoning: "à partir de 10 ans"), best season, named routes/canyons with grade, meeting points, the guide's specific diploma, cancellation/weather policy, FAQ, and activity-specific reviews.
`/aventures/via-ferrata` has the most impressions of any activity page (112, avg position 23.9). It is the clearest case of thin content blocking rankings.
- **Fix:** see the page template in the Content plan below.

### C-5 · High: content gap vs GSC demand, and the best-performing activity page was removed
- `/aventures/planche-a-voile-windsurf` is now 404 but still got 86 impressions / 3 clicks (2nd-best activity URL for clicks). Queries "planche a voile serre poncon" (7 impr, pos 12.3, 1 click), "lac de serre poncon windsurf" (pos 14.7, 1 click), "serre ponçon windsurf & wingfoil". The only remaining windsurf content is the duo `vtt-et-planche-a-voile`. There is no standalone windsurf/voile page, and no kayak page either, even though he holds BEES Voile and Canoë-kayak.
- Via ferrata cluster, about 50 impressions, all ranking poorly: "guide via ferrata hautes alpes" (10, pos 54.8), "via ferrata les orres" / "les orres via ferrata" (11, pos ~32), "via ferrata hautes alpes/hautes-alpes" (9, pos ~55), "via ferrata serre-ponçon/serre poncon/serre ponçon" (11, pos 16-21), "via ferrata serre eyraud", "via ferrata embrun" (pos 10), "via ferrata savines le lac". The via ferrata page only lists "La Motte-du-Caire, Les Orres, L'Argentière-la-Bessée, Ancelle…", with no description of any of them.
- Canyoning cluster: "canyoning embrun" (8, pos 27.6), "canyon embrun", "canyon de la blache"/"la blache canyon"/"canyoning la blache" (5 impr, pos 19-27), "rabou canyoning", "canyon de rouannette", "canyoning les orres", "canyoning serre ponçon". The page names regions only ("Champsaur, Gapençais, Embrunais, Ubaye"), no canyons.
- "Things to do" intent, positions 1-7 but no dedicated page: "que faire dans le champsaur ce week-end" (5, pos 1), "que faire aujourd'hui dans les hautes alpes", "vacances les orres" (pos 7), "activités les orres", "team building" (4, pos 6.5), "corporate activity", "pour des ados", "a 13 ans", "chose a faire en famille".
- Cycling: "cyclisme" (6, pos 2.7), "alpine cycling", "vtt french/vtt france/vtt europe" (pos 4-10).

### C-6 · Medium: duplicate and boilerplate copy between activity pages
- 5-gram Jaccard similarity: `velo-de-route-et-escalade` vs `velo-de-route-et-via-ferrata` **0.41**. Three of the four description sentences are identical ("Le vélo devient le moyen d'accès, fluide et bas carbone…", "On explore la montagne à l'horizontale avant de la découvrir à la verticale.", "Deux façons de bouger…").
- **Copy-paste error:** `/aventures/kayak-et-escalade` contains the windsurf paragraph from `vtt-et-planche-a-voile`: "L'énergie du corps fait place à l'énergie du vent, deux façons de jouer avec les forces naturelles. Adapter sa trajectoire au sentier…" (similarity 0.17). That text does not describe kayak + climbing. Fix it in Sanity.
- The mono pages share one template: "Je vous accompagne/guide sur des [itinéraires/voies/parcours] choisis pour leur beauté, leur fluidité…", "Le rythme s'adapte… en toute sécurité", "Une expérience… pour prendre de la hauteur". QRG flags this as "repetitive structure across pages".
- Meta descriptions: 14/14 activity pages share the template at `app/aventures/[slug]/page.tsx:203`. **Fix:** use `doc.seo.metaDescription` per activity (Sanity `seo` object already exists), or build the description from real fields (lieux, durée, âge, prix). Example: "Via ferrata encadrée aux Orres, à Ancelle et à L'Argentière : demi-journée dès 8 ans, matériel fourni, moniteur diplômé d'État. Dès XX €."

### C-7 · Medium: blog posts are generic, with factual contradictions
Both posts (594 and 609 words, below the 1,500-word blog floor) read as generic AI-style explainers. They name no actual canyon or via ferrata, contain no personal anecdote, and use no original photos with captions. They also **contradict the activity pages**:
- Canyoning post: "dès le plus jeune âge" vs activity page "A partir de 10 ans". "chaussures (ou chaussons néoprène)" fournies vs activity page "A prévoir : … chaussures fermées". "entre Embrun et Guillestre" vs activity page "Champsaur, Gapençais, Embrunais, Ubaye". "encadré par un guide diplômé" without saying which diploma.
- Via ferrata post: "progression **encordée** sur câble continu". Via ferrata uses lanyards (longes), not a rope, so this is technically inaccurate. "accessible dès le plus jeune âge" ignores the usual minimum height/age.
- Byline "Frédéric Buet" is not linked to /guide and has no credential line.
- **Fix:** add a "Mon expérience" section (a real outing, a named canyon, a photo), align the facts with the activity pages, add an author box ("Frédéric Buet, BE Escalade/Canyonisme, 30 ans de pratique" → /guide), and expand to 1,200-1,500 words with named sites. Get them indexed (they are "unknown to Google").

### C-8 · Medium: /guide too thin for the site's main E-E-A-T page
197 words in the main text. Credentials appear only as `<Badge>` chips (`app/guide/page.tsx:105-122`), which trafilatura and many AI extractors skip. One typo: "ce qui m'a toujours **fasciner**" → "fasciné". Average sentence length is 24 words. Missing: year he started guiding / year he got each diploma, "ancien sportif de haut niveau en canoë-kayak" with no detail (level, years, results), carte pro number, insurance, first-aid certification (PSC1/PSE), number of clients or years in the Embrunais, photos with descriptive captions (current alt: "Guide photo 1-4").
- **Fix:** expand to 600-800 words with these H2s: "Mon parcours", "Mes diplômes d'État" (as a text list with years), "Sécurité & assurances", "Pourquoi les Hautes-Alpes", "Ma façon d'encadrer". Link to /avis.

### C-9 · Medium: /avis is too thin to build authority
4 reviews (137 words). There is no total count, no average rating, and no link to the Google Business Profile or other platforms. One reviewer ("Bertrand") wrote a single generic sentence.
- **Fix:** collect reviews from past clients (school groups, cyclists), add a link "Voir tous nos avis Google", tag each review with its activity, and show 1-2 relevant reviews on each activity page.

### C-10 · Low: homepage
904 words, which clears the 500 floor. Typos: "Les **possbilités** sont infinies", "cîmes" (twice) → "cimes". The H1 is only the brand ("Rêves d'Aventures"). The keyword phrase is in a pre-heading line, so the H1 could be "Rêves d'Aventures : escalade, canyoning, via ferrata et VTT à Serre-Ponçon". The FAQ is present. Also `/aventures/programme-tout-a-velo` has "moyen **daccès**" (missing apostrophe).

### C-11 · Low: freshness signals
Every activity page shows "Pas de dates prévues prochainement". For off-season, replace this with "Saison 2027 : ouverture des réservations le …" or "Sortie sur demande toute l'année". Blog: 2 posts, both dated 15 June 2026, with nothing new since.

---

## Content plan (priority order)

### Phase 1: trust fixes (1-2 h, no writing needed)
1. C-1: server-render the real reviews and delete the fake fallback (`components/ReviewSection.tsx`).
2. C-2: replace "Guide de haute montagne" with the accurate title in `lib/seo.ts:46,47,96`, `app/layout.tsx:26,27,33`, `app/blog/page.tsx:29`, `app/blog/[slug]/page.tsx:61`.
3. C-3: complete the mentions légales in Sanity (publisher, host, valid e-mail/domain, carte pro).
4. C-6: remove the windsurf paragraph from kayak-et-escalade, rewrite the vélo+escalade / vélo+via ferrata intros, and give each activity a unique meta description.

### Phase 2: standard template for every mono-activity page (target 700-1,000 words)
Add these Sanity fields/sections to `activity` and render them in `app/aventures/[slug]/page.tsx`:
1. **Intro** (keep the current lyrical text, 80-120 words)
2. **"En bref"** fact box (quotable for AI): durée (e.g. 3 h 30), âge minimum, taille du groupe (max 6), niveau, prix dès X €, saison, point de RDV
3. **"Où pratiquer ?"**: one H3 per named site with 60-100 words each (name, grade/difficulty, length/height, time from Embrun, what makes it special)
4. **"Déroulé d'une sortie"**: timeline
5. **"Votre encadrant"**: the specific state diploma + link to /guide
6. **"Matériel fourni / à prévoir"** (existing)
7. **FAQ** (4-6 questions taken from GSC queries)
8. **Avis** for this activity
9. Links to the related duo pages and the blog post

Page-specific content:
| Page | H1 / title target | Sites/sections to add | Target queries |
|---|---|---|---|
| `/aventures/via-ferrata` | "Via ferrata encadrée dans les Hautes-Alpes – Serre-Ponçon, Les Orres, Embrun" | H3 per via ferrata he actually guides: Les Orres, La Motte-du-Caire, L'Argentière-la-Bessée, Ancelle, plus any near Serre-Ponçon/Savines/Embrun he uses. Grade (F→TD), length, duration, min age/height. FAQ "Faut-il un guide pour une via ferrata ?", "À partir de quel âge ?" | via ferrata hautes alpes, guide via ferrata hautes alpes, via ferrata les orres, via ferrata serre-ponçon, via ferrata embrun |
| `/aventures/canyoning` | "Canyoning près d'Embrun et du lac de Serre-Ponçon" | H3 per canyon actually run (e.g. La Blache, Rabou, Rouannette, if he guides them), with level, jumps/rappels, best season, approach time | canyoning embrun, canyon de la blache, rabou canyoning, canyoning serre ponçon, canyoning les orres |
| `/aventures/escalade` | "Escalade encadrée à Serre-Ponçon et dans les Hautes-Alpes" | Savines-le-Lac, Le Sauze-du-Lac, Champsaur, Orcières, Mont-Dauphin crags: grades, exposure, family-friendly or not | escalade serre poncon, escalade hautes alpes |
| **NEW** `/aventures/planche-a-voile-windsurf` (restore the URL, it still has impressions) | "Planche à voile et windsurf sur le lac de Serre-Ponçon" | Thermal wind schedule, spots (Chorges, Savines, Embrun), beginner/improver, BEES Voile, wingfoil yes or no | planche a voile serre poncon, lac de serre poncon windsurf, serre ponçon windsurf & wingfoil |
| **NEW** `/aventures/kayak` (optional) | "Kayak sur le lac de Serre-Ponçon avec un moniteur" | Routes, Demoiselles coiffées, Chorges/Savines departures, BEES canoë-kayak | kayak serre-ponçon |
| `/aventures/velo-de-route` | "Vélo de route dans les Hautes-Alpes : cols mythiques avec un moniteur" | Short block per col (Izoard, Granon, Vars…: km, D+, from Embrun), e-bike rental | cyclisme, alpine cycling, cols hautes alpes |
| `/aventures/multi-activite`, `/aventures/programme-tout-a-velo` | | Sample 3- and 5-day itinerary, day by day, price, accommodation tips (link /acces) | séjour embrun, séjour multi-activités hautes alpes |
| Duo pages (8) | | Rewrite the intros so each is unique. Add "Programme de la journée" with times, route km/D+, and the named crag/via ferrata/spot. Target 500+ words | |

### Phase 3: new pages and blog posts (1 per 2-3 weeks, 1,200-1,800 words, each with a first-hand section and real photos)
1. **"Les via ferrata autour du lac de Serre-Ponçon et d'Embrun : le guide complet"**: comparison table (name, grade, duration, min age, access). Hub for the via ferrata cluster (~50 impr/90 d).
2. **"Canyoning autour d'Embrun : quel canyon choisir ? (La Blache, Rabou, …)"**: canyoning cluster.
3. **"Que faire autour du lac de Serre-Ponçon / à Embrun / aux Orres cet été : 12 activités outdoor"**: matches the "que faire…", "vacances les orres", "activités les orres" queries (already pos 1-7 on the homepage).
4. **Landing page "Team building & séminaire outdoor dans les Hautes-Alpes"** (`/groupes-entreprises`): team building pos 6.5, corporate activity, school trips (Raphaël's collège review).
5. **"Activités outdoor en famille et pour ados dans les Hautes-Alpes : âges minimum par activité"**: matches "pour des ados", "a 13 ans", "chose a faire en famille". Includes a table of minimum ages.
6. **"Windsurf sur le lac de Serre-Ponçon : vent thermique, spots et conseils"**: supports the restored windsurf page.
7. **"Les cols mythiques des Hautes-Alpes à vélo depuis Embrun"**: cycling cluster ("cyclisme" is already pos 2.7).
8. **"Partir à l'aventure sans voiture : le train de nuit Paris–Embrun et le programme Tout à vélo"**: a unique angle no competitor has, based on /acces.

### Phase 4: authority
Get listed or linked by the Office de Tourisme Serre-Ponçon / Embrun / Les Orres, the Hautes-Alpes tourism site, and the SNGM/SNAPEC/FFCK-type professional directories that match his diplomas. Grow Google reviews and link them from /avis.

---

## Structured findings (for audit-data.json, category "Content Quality")
```json
{"category":"Content Quality","score":46,"eeat":{"experience":55,"expertise":58,"authoritativeness":28,"trustworthiness":38,"weighted":44},"ai_citation_readiness":38,
"metadata_template":{"site_risk":"low","templated_ratio":0.0,"shared_cta_phrases":{},"manual_note":"14/14 activity descriptions share template at app/aventures/[slug]/page.tsx:203"},
"findings":[
{"id":"C-1","severity":"Critical","title":"Fake fallback testimonials in SSR homepage HTML","file":"components/ReviewSection.tsx:29-52"},
{"id":"C-2","severity":"Critical","title":"'Guide de haute montagne' title inconsistent with listed diplomas","file":"lib/seo.ts:46,47,96; app/layout.tsx:26,27,33; app/blog/page.tsx:29; app/blog/[slug]/page.tsx:61"},
{"id":"C-3","severity":"High","title":"Mentions légales placeholder [Nom Prénom], empty host, invalid email/domain"},
{"id":"C-4","severity":"High","title":"All 14 activity pages thin (54-208 words main content), no price/age/duration/sites/FAQ"},
{"id":"C-5","severity":"High","title":"GSC content gaps: windsurf page 404, via ferrata/canyoning local clusters, 'que faire', team building, famille/ados"},
{"id":"C-6","severity":"Medium","title":"Duplicate copy (velo+escalade vs velo+via ferrata J=0.41; windsurf text on kayak page); templated meta descriptions","file":"app/aventures/[slug]/page.tsx:203"},
{"id":"C-7","severity":"Medium","title":"Blog posts generic, <1500 words, contradict activity pages (age, shoes, locations), 'encordée' inaccuracy"},
{"id":"C-8","severity":"Medium","title":"/guide 197 words, diplomas only as badges, typo 'fasciner'","file":"app/guide/page.tsx:105-122"},
{"id":"C-9","severity":"Medium","title":"/avis only 4 reviews, no Google link/aggregate"},
{"id":"C-10","severity":"Low","title":"Homepage typos (possbilités, cîmes), brand-only H1; 'daccès' typo"},
{"id":"C-11","severity":"Low","title":"No freshness: 'Pas de dates prévues' everywhere, no posts since June"}]}
```
