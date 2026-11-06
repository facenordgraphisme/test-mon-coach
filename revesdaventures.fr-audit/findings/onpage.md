# On-Page SEO findings - revesdaventures.fr (2026-11-06)

**On-Page score: 62/100**

Data: raw/crawl.json (28 pages 200 + 1 404). All titles unique, all canonicals self-referencing, a single H1 on every page except /cgv.

## What works
- Titles all <=61 chars, branded `X | Rêves d'Aventures`; home title is keyword-rich ("Escalade, Canyoning & VTT Hautes-Alpes").
- Meta description present on every page; home, blog and key pages are well written (120-180 chars).
- Blog posts: keyword-targeted title/H1/description, 886-920 words.
- OG image set on all pages.

## Findings

### HIGH-1 Activity pages: templated title and description (app/aventures/[slug]/page.tsx:199-203)
Title = doc.title only ("Escalade | Rêves d'Aventures", "Canyoning", "Via ferrata"). Description fallback = "Découvrez l'activité {title} avec Rêves d'Aventures. Expérience exclusive au cœur des Hautes-Alpes et du lac de Serre-Ponçon." — identical on about 16 pages, no location, price, duration or CTA. These are the money pages (vélo de route pos 6.0, VTT pos 6.8, via ferrata pos 23.9 with 112 impressions).
Fix: fill Sanity `seo.title` / `seo.description` per activity, e.g. "Escalade à Embrun et Serre-Ponçon avec guide | Rêves d'Aventures" and a 140-155 char description with level, duration, "dès X €", "Réservez en ligne". Improve the fallback to use `doc.description` truncated.

### HIGH-2 Thin activity content
Word counts (including nav/footer): programme-tout-a-velo 92, multi-activite 105, escalade 172, via-ferrata 193, canyoning 202, velo-de-route 237. Google reports vtt-et-escalade and velo-de-route-et-escalade as "crawled - not indexed" (thin/templated).
Fix: 300-500 unique words per activity (content, spot, level, equipment, safety, season, FAQ).

### MEDIUM-1 Weak H1s
Home H1 is only the brand "Rêves d'Aventures"; /guide "Qui suis-je"; /blog "Le Blog"; /calendrier "Le Calendrier". Add keywords/location, e.g. "Guide de haute montagne à Serre-Ponçon : escalade, canyoning, VTT" and "Qui suis-je ? Guide diplômé à Embrun".

### MEDIUM-2 /cgv has 12 H1
Articles should be H2 (app/cgv/page.tsx). Keep one H1.

### MEDIUM-3 Short meta descriptions
/avis 74, /acces 93, /mentions-legales 98, /cgv 114, /niveaux 122 chars. Extend /avis and /acces to 140-155 chars with keywords (avis clients escalade canyoning Embrun; accès et hébergement Serre-Ponçon).

### MEDIUM-4 Title tuning
Short generic titles (28-35 chars): "Contact", "Escalade", "Canyoning", "Mono-Activité", "Les Duos", no keyword/location. Blog titles at 60-61 chars risk truncation; trim to <=58. The crawler showed a mangled "à" in "VTT et planche à voile" H1 (probably crawler decoding; verify in a browser).

### MEDIUM-5 Internal linking
- Duo/multi activity pages have 0 HTML inlinks (client-only catalogue, see technical.md MEDIUM-3).
- Blog posts and /blog are unknown to Google; link /blog from home, and link each post to the matching activity page (canyoning, via ferrata, escalade) and back.
- Use descriptive anchor text on cards (avoid "En savoir plus").
- Add breadcrumbs (+ BreadcrumbList JSON-LD) on activity and blog pages.

### LOW-1 /aventures/null 404 has generic homepage description; resolved by fixing the sitemap.

## Priority
1. Unique SEO titles/descriptions for the single activities in Sanity. 2. Expand activity content. 3. Keyword H1s (home, guide). 4. Fix /cgv H1s. 5. Blog<->activity internal links. 6. Lengthen short descriptions.
