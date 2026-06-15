# Full SEO Audit — Rêves d'Aventures (revesdaventures.fr)

**Date:** 2026-06-15
**Audited URL:** https://www.revesdaventures.fr/
**Business type:** Local Service — outdoor adventure sports guide/coaching (Escalade, Canyoning, VTT, Via Ferrata, Vélo de route, Planche à voile/Windsurf), based at Lac de Serre-Ponçon / Embrun, Hautes-Alpes, France. Single operator: Frédéric Buet.
**Method:** Live site crawl (HTTP, rendered HTML, JSON-LD, sitemap, robots.txt) cross-referenced with the project's own Next.js/Sanity source code, giving exact root causes and file/line references for every major finding.

---

## Executive Summary

### SEO Health Score: 44 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 35 |
| Content Quality | 23% | 55 |
| On-Page SEO | 20% | 45 |
| Schema / Structured Data | 10% | 50 |
| Performance (CWV) | 10% | 40 |
| AI Search Readiness (GEO) | 10% | 40 |
| Images | 5% | 35 |

The site is built on a modern, fast, well-structured Next.js/Sanity stack with genuinely good content assets (a credible founder bio, real customer testimonials, live dated availability). However, the score is dragged down by a small number of **sitewide, code-level configuration bugs left over from a brand/URL migration** ("Mon Coach Plein Air" → "Rêves d'Aventures", `/activities/*` → `/aventures/*`). These bugs affect **every page on the site simultaneously**, which is why they dominate the score — and why fixing them is unusually high-leverage.

### Top 5 Critical Issues

1. **Every page's canonical tag points to the homepage** ([app/layout.tsx:28-30](app/layout.tsx#L28-L30)) — tells Google every activity page, the contact page, the booking calendar, etc. are duplicates of the homepage and shouldn't be indexed separately. **This is very likely the #1 reason non-homepage pages aren't ranking.**
2. **sitemap.xml is stale** ([app/sitemap.ts](app/sitemap.ts)) — references the old `/activities/{slug}` URLs and is missing all 12 live `/aventures/*`, `/multi`, `/niveaux`, `/acces`, `/avis` pages.
3. **Six activity pages share one identical, generic, off-brand meta description** ("Mon Coach Plein Air - Aventures dans les Hautes Alpes") with an `og:url` pointing at a different domain (`moncoachpleinair.com`) ([app/aventures/[slug]/page.tsx:187-191](app/aventures/[slug]/page.tsx#L187-L191)).
4. **Live developer placeholder text** — "Créez votre aventure (Contenu à configurer dans Sanity)" — is rendered on the public `/multi` page ([app/multi/page.tsx:31-42](app/multi/page.tsx#L31-L42)).
5. **Fake phone number `+33 6 00 00 00 00` is embedded in structured data on every page** ([lib/seo.ts:50,65](lib/seo.ts#L50)), while the real working number on `/contact` is `+33 6 83 16 94 02`.

### Top 5 Quick Wins

1. Replace `'+33 6 00 00 00 00'` with `'+33683169402'` in `lib/seo.ts` — a 2-line fix with sitewide impact on NAP consistency.
2. Fix the `/multi` page's placeholder subtitle and 19-char description.
3. Port the existing, good `/activities/[slug]` meta-description copy into the `/aventures/[slug]` fallback (the good copy already exists in the codebase — it's just on the wrong route).
4. Strip "Mon Coach Plein Air" and duplicate "| Rêves d'Aventures" suffixes from title fallbacks on `/niveaux`, `/acces`, `/avis`, `/calendrier`, `/guide`, `/contact`.
5. Add `cdn.sanity.io` to `next.config.ts` image config and switch to optimized images — the homepage currently ships ~9 images at 1.6–3MB each, unresized and unconverted.

---

## 1. Technical SEO (Score: 35/100)

**What works:** HTTPS + HSTS, clean redirect chain (http→https, non-www→www), clean `robots.txt`, real 404s, fast TTFB (~0.26s) via Vercel, `lang="fr"`, mobile viewport, fully server-rendered.

**Critical:**
- **Sitewide canonical bug** — every page canonicalizes to `https://revesdaventures.fr` (the homepage). Root cause: `alternates: { canonical: '/' }` in the root layout, never overridden per page.
- **Stale sitemap** — lists 15 old `/activities/{slug}` URLs from Sanity activity slugs, missing the 12 live `/aventures/*` + `/multi`/`/niveaux`/`/acces`/`/avis` pages.
- **Orphaned `/activities/*` routes** — still return HTTP 200, not linked anywhere, duplicate `/aventures/*` content.

**Medium:**
- Canonical/og:url/sitemap use the apex domain (`revesdaventures.fr`), which 307-redirects to `www` — should point directly at the serving host.
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`.

Full detail: [findings/technical.md](findings/technical.md)

---

## 2. On-Page SEO (Score: 45/100)

**What works:** Homepage title/description are well-optimized and keyword-rich. Centralized `generateSeoMetadata()` helper works correctly when fed real data. The old `/activities/[slug]` route already has good, unique per-activity descriptions. All homepage images have alt text.

**Critical:**
- Six `/aventures/*` activity pages share one generic 53-char description referencing the old brand "Mon Coach Plein Air", with `og:url` pointing at `moncoachpleinair.com`.

**High:**
- Three pages (`/aventures/mono-activite`, `/aventures/duo-activites`, `/multi`) have a 19-character description: just "Mon Coach Plein Air".
- `/niveaux`, `/acces`, `/avis` titles mix both brand names: e.g. *"Niveaux d'Engagement | Mon Coach Plein Air | Rêves d'Aventures"* (72 chars).
- `og:image`/`twitter:image` missing on every page checked.

**Medium:**
- `/calendrier`, `/guide`, `/contact` titles double up the brand suffix (up to 85 chars).
- Homepage has a duplicate, non-descriptive `<h2>` ("Rêves d'Aventures") immediately before the identical `<h1>`.

Full detail: [findings/onpage.md](findings/onpage.md)

---

## 3. Content Quality & E-E-A-T (Score: 55/100)

**What works:** `/guide` carries a genuinely strong founder bio (Frédéric Buet, 30+ years, ex-high-level canoe-kayak athlete). `/avis` has real, attributed, dated testimonials. `/calendrier` shows live, dated, priced sessions — a freshness signal.

**Critical:**
- `/multi` renders the literal developer placeholder *"Créez votre aventure (Contenu à configurer dans Sanity)"* in its hero — visible to every visitor and crawler.

**Medium:**
- Duplicate topical content between orphaned `/activities/*` and live `/aventures/*` pages for the same activities.
- Generic "description coming soon" fallback text — worth auditing each activity in Sanity for a real description.

Full detail: [findings/content.md](findings/content.md)

---

## 4. Schema & Structured Data (Score: 50/100)

**What works:** Solid `SportsActivityLocation` (full address, geo-coordinates, 5-place `areaServed`, `priceRange`, `openingHours`) + `SportsOrganization` (with `sameAs` Instagram/Facebook) + `WebSite`/`SearchAction`, all injected sitewide and valid JSON.

**Critical:**
- Placeholder telephone `+33 6 00 00 00 00` hardcoded in both schema generators (`lib/seo.ts`), conflicting with the real `+33683169402` used on `/contact`.

**High:**
- No `Review`/`AggregateRating` schema on `/avis` despite real testimonials being present.

**Medium:**
- `generateProductSchema()` likely produces an invalid/null `price` (sourced from a field that doesn't exist on the current data model) and references the old `/activities/{slug}` URL.

Full detail: [findings/schema.md](findings/schema.md)

---

## 5. Performance (Score: 40/100, lab estimate)

> Live CrUX/Lighthouse data unavailable — PageSpeed Insights API quota was exhausted during this audit (`429 RESOURCE_EXHAUSTED`). Findings below are based on direct measurement of page assets and code inspection.

**What works:** Vercel hosting (HTTP/2, Brotli, ISR caching, ~0.26s TTFB). `next/font` for fonts. `Navbar`/`SiteFooter` correctly use `next/image`.

**Critical:**
- Every content image is a raw `<img>` pointing at the **original Sanity upload**, with no resize/quality/format params:
  - Hero background: 1536×1024 **PNG, 3.0 MB**
  - "Vélo de route": 3024×4032 **JPEG, 2.4 MB**
  - "Planche à voile - Windsurf": 4592×3448 **JPEG, 1.7 MB**
  - ...and 6 more in the same range, all on the homepage.
  - Root cause: `next.config.ts` has no `images.remotePatterns` for `cdn.sanity.io`, and 20 raw `<img>` tags bypass both `next/image` and Sanity's own `urlFor().width().quality().auto('format')` builder (which **is** correctly used elsewhere, for `bike.image`).

**Medium:**
- Logo requested at `w=3840` via `next/image` — far larger than needed for a nav/footer logo.
- No `width`/`height` on raw `<img>` tags → CLS risk.

Full detail: [findings/performance.md](findings/performance.md)

---

## 6. AI Search Readiness / GEO (Score: 40/100)

**What works:** `robots.txt` allows all AI crawlers; fully server-rendered content; strong quotable founder narrative on `/guide`; structured local-business data gives a clear entity/location anchor; `/avis` and `/calendrier` provide citable, current data.

**Critical (shared root causes):**
- The canonical bug (Technical #1) likely causes AI answer engines to attribute page content to the homepage rather than the specific activity/guide/contact page.
- The phone-number inconsistency (Schema #1) would surface a fake number in AI-generated local answers.

**Low/Info:**
- No `/llms.txt` (404).
- Zero presence in Common Crawl — reflects a limited off-site authority profile, not an on-page bug.

Full detail: [findings/geo.md](findings/geo.md)

---

## 7. Images (Score: 35/100)

Same root cause as Performance: multi-megabyte, unresized, wrong-format (PNG for a photo) images. Plus the missing `og:image`/`twitter:image` sitewide. All existing `alt` text is good.

Full detail: [findings/performance.md](findings/performance.md) (images covered alongside performance — same fix)

---

## Why the score looks low despite a solid site

Five of the seven categories are dragged down by **the same handful of root causes**, all stemming from an in-progress brand/URL migration ("Mon Coach Plein Air" → "Rêves d'Aventures", `/activities` → `/aventures`):

- One config line (`alternates.canonical: '/'`) affects **every page's** Technical and GEO score.
- One fallback string in `lib/seo.ts` affects **every page's** Schema and GEO score (phone number).
- One fallback object in `app/aventures/[slug]/page.tsx` affects **6 pages'** On-Page score.
- One unfinished Sanity document affects `/multi`'s Content and On-Page score.

Because these are concentrated, code-level issues rather than hundreds of individual content problems, **Phase 1 of the action plan (Week 1) can realistically move the health score from 44 into the 60s-70s** without any new content production — see [ACTION-PLAN.md](ACTION-PLAN.md).
