# Performance / Core Web Vitals - revesdaventures.fr (2026-11-06)

Score: **82/100** (previous audit 40/100, which had no PSI data). PSI run with Lighthouse 13.6.0.

## Field data (CrUX)
No CrUX data for the origin (API: insufficient Chrome traffic), which is expected at about 924 GSC impressions per 90 days. Field CWV status is unknown. Do not claim pass or fail on field data. Re-check once traffic grows. Lab data only below.

## Lab results (PSI, Lighthouse 13.6.0)
| URL | Mobile perf | LCP | FCP | TBT | CLS | Desktop perf | Desktop LCP |
|---|---|---|---|---|---|---|---|
| / | 83 | **4.7 s (poor)** | 1.1 | 20 ms | 0 | 97 | 1.3 |
| /aventures/via-ferrata | 93 | 3.2 s | 0.9 | 50 | 0 | 99 | 1.0 |
| /aventures/mono-activite | 93 | 3.2 s | 0.9 | 30 | 0 | 100 | 0.6 |
| /calendrier | 88 | 4.0 s (borderline) | 0.9 | 40 | 0 | 95 | 1.5 |
| /blog/canyoning-...-debutant | 89 | 3.2 s | 1.7 | 20 | 0 | 98 | 0.9 |

Mobile is simulated slow 4G with 4x CPU throttling. LCP is the only metric in "needs improvement" or "poor". CLS is 0 everywhere and TBT is 0-100 ms, so INP risk is low. TTFB is a few ms in the lab (Vercel edge, `X-Vercel-Cache: HIT`). Static assets send `max-age=31536000, immutable`; HTML is `max-age=0, must-revalidate` (fine for ISR).

## What works
- Prerendered ISR pages with edge cache hits; TTFB is no longer a concern.
- LCP images are discoverable in the HTML: `<link rel="preload" as="image">` present, `next/image` with `priority`, srcset and `sizes`; below-the-fold images are lazy.
- Fonts self-hosted via `next/font`, preloaded (2 woff2, about 55 KB). CLS 0.
- JS is modest: about 335 KB transferred over 20 scripts. Total page weight 660 KB to 1.3 MB.
- styled-components, `@sanity/ui` and Studio are NOT shipped to public pages (I fetched all 14 home chunks: no styled-components, no Sanity UI).
- GA4 is consent-gated (`components/GoogleAnalytics.tsx`): no gtag in HTML and no third-party request before consent; `afterInteractive`. Lighthouse third-parties shows only sanity.io (1.6 KB).
- DOM is small (430-584 elements).

## Fixed vs 2026-06-15 audit
- FIXED: raw 3 MB Sanity images; they now go through `next/image` (remotePatterns in `next.config.ts:26-29`), served resized (750w, 90-200 KB).
- FIXED: server CPU / TTFB (prerender + ISR).
- STILL OPEN: oversized card images and no AVIF (M1).

## Findings

### H1 - Home mobile LCP 4.7 s (poor): hero image starts at opacity 0 and waits for hydration plus a 1.5 s fade
- `components/Hero.tsx:45-58`: `MotionImage` uses `initial={{opacity:0, scale:1.1}} animate={{opacity:0.8, scale:1}} transition={{duration:1.5}}` inside `AnimatePresence`. SSR HTML ships `style="opacity:0;transform:scale(1.1)"`.
- Chrome counts the image as LCP only once visible, so LCP waits for framer-motion to load, hydrate and animate. This explains home 4.7 s versus inner pages 3.2 s (they use a plain `next/image`, `app/aventures/[slug]/page.tsx:243`). Hero.tsx is `"use client"`, so framer-motion (about 35-40 KB gz) is on the critical path.
- Fix: render slide 0 with no entrance animation (`initial={currentIndex === 0 ? false : {opacity:0, scale:1.1}}`), or render slide 0 as a static `<Image priority className="opacity-80">` and mount the carousel via `next/dynamic` after idle. Drop the `scale(1.1)` on slide 0. Expected: LCP about 4.7 s to about 3.0 s on mobile.
- Hero source is a 1536x1024 PNG on Sanity (`c975964b...png`). Re-upload as JPG/WebP and set `quality={60}` (750w variant is 91 KB).
- The logo uses `priority` (Navbar, `logo-v2.png`) and emits a second preload with a 15-width srcset that competes with the hero. Remove `priority` or restrict the srcset.

### H2 - Render-blocking CSS: 2 stylesheets, about 560 ms estimated LCP delay on every page
- `/_next/static/chunks/3f9384a07f1cd795.css` (18 KB) and `7af0e173cf372ed8.css` (2.3 KB).
- Fix: in `next.config.ts` set `experimental: { inlineCss: true }` (pages are fully prerendered and the CSS is small). Also check `app/globals.css` for unused imports and tighten Tailwind content globs.

### M1 - Card images oversized (80-130 KB wasted each), no AVIF
- Image-delivery insight: home "Duos" 128 KB wasted, "Mono-Activité" 82 KB, hero 70 KB; /aventures/mono-activite Canyoning 132 KB, Escalade 130 KB, Vélo de route 99 KB. Sources are 2000-3000 px portrait JPG/PNG shown in boxes about 380x192 px.
- Fix in `next.config.ts`: `images: { formats: ['image/avif','image/webp'], qualities: [60,75], remotePatterns: [...] }`. Use `quality={60}` on cards, a correct `sizes` (e.g. `(max-width:768px) 92vw, 33vw`) and a landscape crop via Sanity hotspot. Same for `components/ActivityFilterableList.tsx`. Gain: about 300-500 KB on mobile.

### M2 - /calendrier mobile LCP 4.0 s (score 88)
- Unused JS (450 ms est.), network dependency chain flagged, 153 KB HTML including the SSR calendar table.
- Fix: `next/dynamic` for booking modal and filters; confirm the LCP element in DevTools and preload it if it is an image.

### M3 - Unused and legacy JS (260-450 ms est.)
- Chunk `d0300bff...js` (64 KB gz, 202 KB raw) holds about 220 ms of scripting (React/Next runtime plus libraries). Legacy-JS insight: 16 KB wasted in `ae7b2070...js`, plus a `noModule` chunk `a6dad97d...js` (40 KB; modern browsers skip it).
- Fix: add a `browserslist` to `package.json` (chrome>=111, safari>=16.4, firefox>=111). Use `LazyMotion` + `m` from framer-motion (about 5 KB instead of about 35 KB) or CSS for simple fades (`Hero.tsx:63-67`). Add `optimizePackageImports: ['lucide-react','framer-motion']` in `next.config.ts` experimental.

### L1 - Client-side Sanity CDN request on home
- `lgiw0vhg.apicdn.sanity.io` is contacted from the browser on home (CSP allows it, `next.config.ts:10`). The page is prerendered, so move that fetch to the server (grep `client.fetch` inside `use client` components in `components/`).

### L2 - Misc
- `public/assets` contains large raw originals and `.HEIC` files (not browser-renderable); clean up repo weight.
- Logo `alt="Mon Coach Plein Air"` is the old brand name.
- Lighthouse accessibility 91: `button-name`, `color-contrast`, `heading-order` failures (not CWV).
- HSTS has no `includeSubDomains` or `preload`. CSP `script-src 'unsafe-inline'` is needed for static Next; nonces would force dynamic rendering, so avoid them.

## Priority order
1. H1 Hero.tsx (about -1.5 s home mobile LCP).
2. H2 `inlineCss` (about -0.3 to -0.5 s LCP everywhere).
3. M1 AVIF plus right-sized card images.
4. M3 browserslist plus LazyMotion.
5. M2 calendrier code-splitting.

Raw PSI JSON (5 URLs, mobile+desktop) is in the scratchpad: ps1.json to ps5.json.
