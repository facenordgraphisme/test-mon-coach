# Performance & Images — Rêves d'Aventures (revesdaventures.fr)

Performance score: **40/100** (lab estimate — see note)
Images score: **35/100**

> **Note on data source:** Google PageSpeed Insights / CrUX field data could not be retrieved (API quota exhausted — `429 RESOURCE_EXHAUSTED` for `pagespeedonline.googleapis.com`). The findings below are based on direct measurement of actual asset sizes and code inspection, which independently point to the same conclusion: large, unoptimized hero/content images are the dominant performance risk (LCP).

## What works

- Hosted on Vercel: HTTP/2, Brotli compression (`Content-Encoding: br`), ISR caching (`X-Vercel-Cache: HIT`, `Cache-Control: public, max-age=0, must-revalidate`), fast TTFB (~0.26s for HTML).
- `Navbar` and `SiteFooter` components correctly use `next/image` (20 usages found across the codebase, but **only** in these two components).
- `font-display`/preloading is handled via `next/font` (`Geist`, `Geist_Mono`), which avoids render-blocking font requests.

## Critical Issues

### 1. Every content image (Sanity CDN) is served at full native resolution with no optimization
**Severity: Critical**

All hero/activity images on the homepage are raw `<img src="https://cdn.sanity.io/...">` tags with **no resizing, quality, or format parameters**. Measured directly:

| Image | Native dimensions | File size | Format |
|---|---|---|---|
| Hero background | 1536×1024 | **3.0 MB** | PNG |
| "Vélo de route" | 3024×4032 | **2.4 MB** | JPEG |
| "Planche à voile - Windsurf" | 4592×3448 | **1.7 MB** | JPEG |
| ...6 more activity images | up to 4032×3024 | ~1-3 MB each | JPEG/PNG |

The homepage alone references **9 such images**, most in the multi-megabyte range, none with `srcset`, `sizes`, `loading="lazy"`, or explicit `width`/`height` attributes (only the logo and footer logo, which go through `next/image`, have any of this).

**Root cause:**
- [next.config.ts](next.config.ts) has **no `images.remotePatterns`** entry for `cdn.sanity.io`, so `next/image` cannot be used for these URLs without config changes.
- The 20 raw `<img>` usages across `app/aventures/[slug]/page.tsx`, `app/multi/page.tsx`, `app/page.tsx`, etc. pull `mainImage.asset->url` / `heroImage.asset->url` directly from Sanity's GROQ response — the **original** uploaded file URL — instead of using Sanity's image URL builder (`urlFor(image).width(...).quality(...).auto('format')`), which is already imported and used elsewhere (`lib/sanity.ts` exports `urlFor`, and it **is** used for `bike.image` in the rental tab, [app/aventures/[slug]/page.tsx:568](app/aventures/[slug]/page.tsx#L568)).

**Impact:** A 1536×1024 PNG hero background (3MB) and 3024×4032 photos (2.4MB) served untouched to mobile devices is a severe LCP penalty — likely pushing LCP well past the 2.5s "good" threshold on 4G, especially since the hero image is above-the-fold and blocks the largest paint.

**Fix (two parts):**
1. Add `cdn.sanity.io` to `images.remotePatterns` in `next.config.ts`.
2. Replace raw `<img src={mainImageUrl}>` / `<img src={heroImage}>` with either:
   - `next/image` (`<Image src={...} fill sizes="100vw" />` for hero/cover images), or
   - Sanity's `urlFor(image).width(1600).quality(75).auto('format').url()` (already used for `bike.image`) applied consistently to `mainImage`/`heroImage` across `app/aventures/[slug]/page.tsx`, `app/multi/page.tsx`, `app/page.tsx`, and the activity card components.

   `auto('format')` lets Sanity serve WebP/AVIF automatically, which alone would cut these files by 60-80%.

## High Issues

### 2. Site logo requested at 3840px width via `next/image`
**Severity: Medium-High**

The logo (`/assets/logo-v2.png`) is requested as `/_next/image?url=%2Fassets%2Flogo-v2.png&w=3840&q=75`. `w=3840` is Next.js's largest default device-size bucket — appropriate for a full-bleed hero photo, not a logo that renders at maybe 150-250px wide in a navbar/footer. This forces Next.js to generate and cache an unnecessarily large image variant.

**Fix:** Add an explicit `sizes` prop to the `<Image>` usage for the logo (e.g. `sizes="160px"`) so Next.js selects an appropriately small device-size bucket, or reduce `next.config.ts`'s `images.deviceSizes`/`imageSizes` if 3840 is never needed for content this small.

### 3. No explicit `width`/`height` on raw `<img>` tags → CLS risk
**Severity: Medium**

Because the 20 raw `<img>` tags have no `width`/`height` (or `aspect-ratio` styling tied to intrinsic size), the browser can't reserve layout space before the image loads, risking Cumulative Layout Shift on slower connections. Fixing issue #1 via `next/image` (which requires/derives intrinsic dimensions) resolves this as a side effect.

## Info

- Could not run Lighthouse/CrUX directly due to PSI API quota exhaustion at audit time. Recommend re-running `PageSpeed Insights` (web UI or API with a valid key) for `https://www.revesdaventures.fr/` after the image fixes above to quantify the LCP improvement.
