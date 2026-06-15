# SEO Action Plan — Rêves d'Aventures (revesdaventures.fr)

Prioritized by severity (Critical > High > Medium > Low) per the audit's findings. Since this codebase **is** the site, every item below includes the exact file/line to change.

---

## Phase 1: Critical Fixes (Week 1)

These five items are all small, low-risk code changes, but together they touch the canonical tags, sitemap, schema, and content of nearly every page on the site. This phase alone is expected to move the health score from **44 → low-60s/70s**.

### 1.1 Fix the sitewide canonical bug
**Files:** [app/layout.tsx:28-30](app/layout.tsx#L28-L30), [lib/seo.ts](lib/seo.ts)
**Severity:** Critical | **Category:** Technical SEO, GEO

- Remove the hardcoded `alternates: { canonical: '/' }` from the root layout's metadata (or keep it only as the homepage-specific default, applied via the homepage's own `generateMetadata`/static metadata, not the root layout that all routes inherit).
- Update `generateSeoMetadata()` in `lib/seo.ts` to **always** set `alternates: { canonical: fallback.url }` (it currently sets `openGraph.url` and `twitter` fields from `fallback.url` but never sets `alternates.canonical`).
- Every page that calls `generateSeoMetadata()` already passes a `url` in its `fallback` object — so once `generateSeoMetadata` sets `alternates.canonical` from it, every page gets a correct, unique canonical with no per-page changes needed beyond this helper.
- Verify pages that **don't** call `generateSeoMetadata` (if any) get an explicit canonical too.

**Validation:** After deploy, spot-check `<link rel="canonical">` on `/`, `/guide`, `/contact`, and 2-3 `/aventures/{slug}` pages — each should show its own URL, not the homepage.

### 1.2 Rebuild app/sitemap.ts for the current route structure
**File:** [app/sitemap.ts](app/sitemap.ts)
**Severity:** Critical | **Category:** Technical SEO

- Replace `/activities/${activity.slug}` with `/aventures/${activity.slug}` (or whatever the canonical activity route prefix is post-migration).
- Add the missing static routes: `/aventures/mono-activite`, `/aventures/duo-activites`, `/multi`, `/niveaux`, `/acces`, `/avis`.
- Remove entries for any routes being deprecated in 1.3 (the old `/activities/*`).
- Use real `lastModified` from `_updatedAt` (already partially done for activities — confirm it's applied to all dynamic entries).

**Validation:** Fetch `https://www.revesdaventures.fr/sitemap.xml` and confirm every URL returns 200 and matches the live navigation.

### 1.3 Decide the fate of /activities/* (redirect or remove)
**Files:** `app/activities/[slug]/page.tsx` and related route files
**Severity:** Critical | **Category:** Technical SEO

- These routes return 200 and duplicate `/aventures/*` content but aren't linked or in the sitemap (orphaned + duplicate).
- **Recommended fix:** add a permanent redirect (`redirect()` in the page, or a `redirects()` entry in `next.config.ts`) from `/activities/{slug}` → `/aventures/{slug}` (308). This consolidates any residual link equity from the old URLs and eliminates duplicate-content risk.
- If these old slugs don't map 1:1 to new ones, redirect to the closest equivalent or to `/` with a note, but a per-slug mapping is preferable if the slugs match.

**Validation:** `curl -I https://www.revesdaventures.fr/activities/{any-old-slug}` should return a 301/308 to `/aventures/{slug}`, not 200.

### 1.4 Fix the activity-page meta description fallback (6 pages, generic + wrong brand)
**File:** [app/aventures/[slug]/page.tsx:174-192](app/aventures/[slug]/page.tsx#L174-L192)
**Severity:** Critical | **Category:** On-Page SEO

Replace the current fallback:
```ts
return generateSeoMetadata(doc?.seo, {
    title: doc?.title,
    description: "Mon Coach Plein Air - Aventures dans les Hautes Alpes",
    url: `https://moncoachpleinair.com/aventures/${slug}`
});
```
with the pattern already proven on the legacy route ([app/activities/[slug]/page.tsx:54-58](app/activities/[slug]/page.tsx#L54-L58)):
```ts
return generateSeoMetadata(doc?.seo, {
    title: `${doc?.title || 'Activité'} | Rêves d'Aventures Hautes-Alpes`,
    description: `Découvrez l'activité ${doc?.title} avec Rêves d'Aventures. Expérience exclusive au cœur des Hautes-Alpes et du lac de Serre-Ponçon.`,
    url: `https://www.revesdaventures.fr/aventures/${slug}`,
});
```
This single change fixes both the 53-char generic description **and** the 19-char description on `/aventures/mono-activite` and `/aventures/duo-activites` (which hit the same `description: doc?.description` path with `doc.description` empty — confirm by checking what `doc?.description` resolves to for those two slugs; if it's a short Sanity field rather than `undefined`, this fallback won't trigger and the Sanity content itself needs editing instead).

**Validation:** Check `<meta name="description">` and `<meta property="og:url">` on all 6 affected `/aventures/*` pages — should be unique per activity and point at `revesdaventures.fr`.

### 1.5 Replace the placeholder phone number in structured data
**File:** [lib/seo.ts:50](lib/seo.ts#L50) and [lib/seo.ts:65](lib/seo.ts#L65)
**Severity:** Critical | **Category:** Schema, GEO

- Replace both occurrences of `'+33 6 00 00 00 00'` with the real number used on `/contact`: `'+33683169402'` (or `'+33 6 83 16 94 02'` to match whatever format is registered in Google Business Profile — keep it consistent across the site and GBP).

**Validation:** Extract the JSON-LD from any page and confirm `telephone` matches the `/contact` page's `tel:` link.

### 1.6 Remove the live placeholder content on /multi
**File:** [app/multi/page.tsx:31-42](app/multi/page.tsx#L31-L42)
**Severity:** Critical | **Category:** Content Quality, On-Page SEO

- Either populate the `multiPage` document in Sanity (preferred — removes the fallback path entirely), or, as an immediate stopgap, rewrite the hardcoded fallback object so `subtitle` and `description` read as real marketing copy instead of `"Créez votre aventure (Contenu à configurer dans Sanity)"`.
- Also fix `generateMetadata()` in the same file: it returns `description: "Aventure Sur-Mesure / Multi - Mon Coach Plein Air"` (old brand, 19-40 chars) when `doc?.seo` is absent — replace with a real ~150-160 char description and `url: 'https://www.revesdaventures.fr/multi'`.

**Validation:** View-source `/multi` and confirm "configurer dans Sanity" no longer appears anywhere in the response.

---

## Phase 2: High-Impact Improvements (Weeks 2-3)

### 2.1 Clean up brand-mixed and oversized `<title>` tags
**Files:** `app/niveaux/page.tsx`, `app/acces/page.tsx`, `app/avis/page.tsx`, `app/calendrier/page.tsx`, `app/guide/page.tsx`, `app/contact/page.tsx`
**Severity:** High/Medium | **Category:** On-Page SEO

- `/niveaux`, `/acces`, `/avis`: titles currently mix both brands, e.g. *"Niveaux d'Engagement | Mon Coach Plein Air | Rêves d'Aventures"* (72 chars). The `%s | Rêves d'Aventures` template in `app/layout.tsx` already appends the new brand — so these page-level fallback titles should **not** include any brand suffix at all. E.g. `app/niveaux/page.tsx`'s fallback should become just `"Niveaux d'Engagement"` (the template adds `| Rêves d'Aventures`).
- `/calendrier`, `/guide`, `/contact`: same issue but with the new brand duplicated (up to 85 chars) — strip the trailing `| Rêves d'Aventures` from each page's fallback title string.

**Validation:** Each `<title>` should read `"{Page Name} | Rêves d'Aventures"` exactly once, ≤60 chars where possible.

### 2.2 Add a sitewide fallback OG/Twitter image
**Files:** [lib/seo.ts](lib/seo.ts), [app/layout.tsx](app/layout.tsx)
**Severity:** High | **Category:** On-Page SEO, Images

- `generateSeoMetadata()` currently returns `images: []` when `seo.openGraphImage` is unset, and the root layout's `openGraph` has no fallback `images` array.
- Add a default 1200x630 image (e.g. derive from `public/assets/logo-v2.png` composited on a brand background, or pick an existing high-quality photo from `public/assets/`) and reference it in `lib/seo.ts`'s default `openGraph`/`twitter` fields, and as a fallback in `generateSeoMetadata()` when `imageUrl` is null.

**Validation:** Test 3-4 page URLs in a social share debugger (Facebook Sharing Debugger / Twitter Card Validator) — every page should show a preview image.

### 2.3 Add Review/AggregateRating schema to /avis
**File:** `app/avis/page.tsx`, [lib/seo.ts](lib/seo.ts)
**Severity:** High | **Category:** Schema

- Add a `Review[]` (or `AggregateRating`) JSON-LD block sourced from the real testimonials already rendered on `/avis`, attached to the `SportsActivityLocation`/`LocalBusiness` entity.
- Confirm current Google eligibility for self-serving review rich snippets before expecting a visible star rating in SERPs — but the structured data still benefits AI answer engines (GEO) regardless.

### 2.4 Fix the homepage duplicate H1/H2
**File:** `app/page.tsx` (homepage hero section)
**Severity:** Medium | **Category:** On-Page SEO

- The homepage has a non-descriptive `<h2>` ("Rêves d'Aventures") immediately preceding an identical `<h1>`. Either remove the duplicate heading or rewrite the `<h2>` as a descriptive subheading (e.g. a tagline mentioning the core activities/location) so heading structure adds semantic value instead of repeating the brand name.

### 2.5 Add cdn.sanity.io to Next.js image config (prerequisite for Phase 3 image fixes)
**File:** [next.config.ts](next.config.ts)
**Severity:** High (enabler) | **Category:** Performance, Images

```ts
const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
};
```
This unblocks the image-optimization work in Phase 3 and can ship independently/immediately since it's purely additive config.

---

## Phase 3: Content & Performance (Month 2)

### 3.1 Replace all raw `<img>` Sanity images with optimized equivalents
**Files:** `app/page.tsx`, `app/aventures/[slug]/page.tsx`, `app/multi/page.tsx`, and any activity card components (20 usages total)
**Severity:** Critical (Performance/Images, deferred to this phase due to scope) | **Category:** Performance, Images

- For each raw `<img src={mainImage/heroImage...}>`, either:
  - Switch to `next/image` (`<Image fill sizes="100vw" .../>` for full-bleed hero/cover images), now that `cdn.sanity.io` is allow-listed (2.5), or
  - Apply Sanity's `urlFor(image).width(1600).quality(75).auto('format').url()` — the same builder already used correctly for `bike.image` ([app/aventures/[slug]/page.tsx:568](app/aventures/[slug]/page.tsx#L568)) — to cap dimensions and enable WebP/AVIF.
- Prioritize the **homepage's 9 images** first (hero PNG at 3MB, 8 activity photos at 1.7-2.4MB each) since they're above-the-fold/LCP-relevant for the highest-traffic page.

**Validation:** Re-run PageSpeed Insights (wait for quota reset, or use the web UI) on `/` — expect LCP to drop significantly given the hero image alone was 3MB.

### 3.2 Right-size the logo image request
**File:** wherever the logo `<Image>` is used in `components/Navbar.tsx` / `components/SiteFooter.tsx`
**Severity:** Medium | **Category:** Performance

- Add an explicit `sizes="160px"` (or appropriate value) to the logo's `<Image>` usage so Next.js stops generating/serving the 3840px device-size variant for a nav/footer logo.

### 3.3 Audit and fill thin/duplicate activity descriptions
**Files:** Sanity Studio content (activity documents), referenced via `app/aventures/[slug]/page.tsx:490`
**Severity:** Medium | **Category:** Content Quality

- For each activity currently falling back to *"Description détaillée à venir ou non disponible pour les sessions actuelles"*, write a real 100-200 word description in Sanity covering what the activity involves, who it's for, duration, and what's included — reusing/expanding the good copy patterns already present in `/guide` and the legacy `/activities/[slug]` descriptions.
- Cross-check for content that's duplicated verbatim between `/activities/{slug}` (pre-redirect, if any content needs preserving) and `/aventures/{slug}` before the 1.3 redirect goes live, so nothing unique is lost.

### 3.4 Clean up the Product schema generator
**File:** [lib/seo.ts:91-112](lib/seo.ts#L91-L112)
**Severity:** Medium | **Category:** Schema

- Determine whether `generateProductSchema()` is actually called from `/aventures/[slug]`. If yes: source `price` from the nearest `upcomingEvents[].price` and fix `url` to `https://www.revesdaventures.fr/aventures/${slug}`. If it's dead code from the old route, remove it as part of the `/activities` cleanup (1.3).

---

## Phase 4: Monitoring & Iteration (Ongoing)

### 4.1 Add security headers
**File:** [next.config.ts](next.config.ts) (via `headers()`) or `middleware.ts`
**Severity:** Medium | **Category:** Technical SEO

- Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (or `DENY`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a `Content-Security-Policy` appropriate for the Sanity/analytics/embed scripts in use.

### 4.2 Normalize apex vs www in canonical/sitemap/OG URLs
**Files:** [app/sitemap.ts](app/sitemap.ts), [lib/seo.ts](lib/seo.ts), [app/layout.tsx](app/layout.tsx)
**Severity:** Medium | **Category:** Technical SEO

- All canonical/`og:url`/sitemap URLs currently use `https://revesdaventures.fr` (apex), which 307-redirects to `https://www.revesdaventures.fr`. Pick the serving host (`www`, per the redirect target) as the single source of truth everywhere, including `metadataBase` in `app/layout.tsx`.

### 4.3 Re-run PageSpeed Insights once quota resets
**Severity:** Info | **Category:** Performance

- Quantify the real-world LCP/CLS impact of the Phase 3 image fixes with live Lighthouse/CrUX data.

### 4.4 Add llms.txt
**Severity:** Low | **Category:** GEO

- Add a `public/llms.txt` (or `app/llms.txt/route.ts`) listing key pages (`/`, `/guide`, `/aventures/*`, `/niveaux`, `/acces`, `/avis`, `/calendrier`, `/contact`) with one-line descriptions, to help AI crawlers map the site.

### 4.5 Add FAQPage and Person/founder schema
**Severity:** Low (opportunity) | **Category:** Schema, GEO

- Mark up the homepage's existing "Questions Fréquentes" accordion as `FAQPage` JSON-LD.
- Add a `Person` entity for Frédéric Buet (30 years experience, ex-competitive canoe-kayak athlete) linked from `SportsOrganization` via `founder` — reinforces E-E-A-T and gives AI answer engines a clear "who" to cite.

### 4.6 Off-site authority signals
**Severity:** Info | **Category:** GEO, Backlinks

- The site has zero presence in Common Crawl. Ensure Google Business Profile is fully populated (with the **correct** phone number, matching 1.5) and consider directory listings relevant to outdoor adventure tourism in Hautes-Alpes — these feed both classic backlink authority and AI training-data crawl coverage over time.

---

## Summary

| Phase | Timeframe | # Items | Primary effect |
|---|---|---|---|
| 1: Critical Fixes | Week 1 | 6 | Fixes sitewide canonical, sitemap, NAP, and 6-page meta description / placeholder-content issues |
| 2: High-Impact | Weeks 2-3 | 5 | Title cleanup, OG images, review schema, heading structure, image-config prerequisite |
| 3: Content & Performance | Month 2 | 4 | Image optimization (biggest CWV win), content depth, schema cleanup |
| 4: Monitoring & Iteration | Ongoing | 6 | Security headers, host normalization, PSI re-check, llms.txt, FAQ/Person schema, off-site signals |

Phase 1 is the highest-leverage block: six small, code-level fixes that touch every page on the site. Recommend starting there.
