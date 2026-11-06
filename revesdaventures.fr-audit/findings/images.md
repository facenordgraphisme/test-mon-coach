# Images — revesdaventures.fr (2026-11-06)

**Images score: 60/100**

Evidence: crawl.json (29 URLs, 0 `<img>` without alt) plus a parse of the raw HTML of 21 pages and the homepage (79 `<img>` tags), the codebase, and curl checks on `/_next/image`.

## What works
- **`next/image` is used everywhere in live code.** The only raw `<img>` is `app/activities/[slug]/page.tsx:79`, which is unreachable because `/activities/*` 301-redirects to `/aventures/*` (`next.config.ts:33-44`). Delete that file.
- Responsive `srcset` and `sizes` on all images. Below-the-fold images get `loading="lazy"`, and heroes use `priority`, which emits `<link rel="preload" as="image">`.
- Optimizer output is WebP (`Content-Type: image/webp`). Example: the home hero, a 1536×1024 PNG on Sanity, is served as 263 KB WebP. Sanity images (`cdn.sanity.io`) are allowed in `next.config.ts:24-29`.
- No image is missing an `alt` attribute (crawl: `imgs_noalt = 0` on all 29 URLs).
- `og-default.png` is 1200×630 and 77 KB.

## Findings

### I-1 · High: alt text exists but is mostly useless or wrong
Distribution of the 79 `<img>` tags across 22 pages:
| alt value | count | source |
|---|---|---|
| "Mon Coach Plein Air" (old brand name, wrong) | 30 | `components/Navbar.tsx:81`, `components/SiteFooter.tsx:55` |
| "Image" | 11 | `components/PortableTextComponents.tsx:22` fallback, because the block-content image type has **no alt field** (`sanity/schemaTypes/blockContent.ts:62-65`) |
| "Hero background" / "Background" | 2 | `components/Hero.tsx:51`, `app/niveaux/page.tsx:68` |
| "Guide photo 1…4" | 4 | `app/guide/page.tsx:134` |
| Page or activity title only ("Canyoning", "Escalade", "Avis Clients", "Mentions Légales"…) | ~30 | `alt={title}` / `alt={activity.title}` |

That leaves about 0 alts that actually describe the image (what, where, who). The activity schema already has `mainImage.alt` (`sanity/schemaTypes/activity.ts:113-117`), but the page never queries it and uses `alt={activity.title}` (`app/aventures/[slug]/page.tsx:245, 397`).
**Fix:**
- Logo: `alt="Rêves d'Aventures"` (Navbar.tsx:81, SiteFooter.tsx:55).
- Add `fields: [{ name: 'alt', type: 'string', title: 'Texte alternatif', validation: r => r.required() }]` to the image member in `blockContent.ts:62`. Set PortableText's fallback to `''`, not `'Image'`.
- Query `"imageAlt": mainImage.alt` in `app/aventures/[slug]/page.tsx` and use `alt={imageAlt || \`${title} dans les Hautes-Alpes\`}`.
- Decorative hero carousel and backgrounds: use `alt=""` (Hero.tsx:51, niveaux/page.tsx:68), or use the Sanity alt when the image carries meaning.
- Guide gallery: add alt or captions in Sanity (`guide.photos[]` has no alt field, `guide.ts:46`), e.g. "Frédéric Buet en tête de cordée au-dessus du lac de Serre-Ponçon".
- In Sanity Studio, write descriptive alts with location for the 11 body images on activity pages. Example: "Saut dans une vasque du canyon de … près d'Embrun".

### I-2 · Medium: very large original files committed to `public/assets` (about 120 MB)
`IMG_9962.png` 30.5 MB, `IMG_9739.png` 22.5 MB, `IMG_9742.png` 19.6 MB, `IMG_9817.JPG` 8.1 MB, `IMG_9526.JPG` 5.7 MB, plus 3 `.HEIC` files (browsers cannot display them). Some are served directly. `https://www.revesdaventures.fr/assets/IMG_9962.png` returns the full 30.5 MB PNG to anyone who hits the raw URL (including image crawlers), and the optimizer has to decode 30 MB sources on cache misses. These are the fallbacks in `app/guide/page.tsx:52` and `components/ActivityFormats.tsx:47,55`.
Unreferenced in code: `217-1784_IMG.JPG`, `DDNO3891.JPG`, `IMG_1814.JPG`, `IMG_20160419_140752.jpg`, `IMG_9526.JPG`, `IMG_9742.*`, `IMG_9817.JPG`, `MGUI9193.JPG`, `P1050729.JPG`, all `.HEIC`, `logo2.png`.
**Fix:** delete the unused files. Re-export the referenced ones as JPEG/WebP at ≤2400 px wide, under 500 KB each. Rename them descriptively (`canyoning-embrun.jpg`, `escalade-serre-poncon.jpg`), because file names count as a minor image-search signal.

### I-3 · Medium: broken fallback image reference
`components/ActivityFormats.tsx:39` references `/assets/IMG_9961.png`, which does not exist in `public/assets`. Today Sanity supplies the format images, so nothing is visibly broken. If the Sanity fetch ever returns empty, the "Mono-Activité" card shows a broken image. **Fix:** point it to an existing optimized asset.

### I-4 · Low/Medium: optimizer cache and AVIF
- `/_next/image?url=%2Fassets%2Flogo-v2.png…` returns `Cache-Control: public, max-age=0, must-revalidate` (`X-Vercel-Cache: MISS`). **Fix:** set `images.minimumCacheTTL: 2678400` (31 days) in `next.config.ts:24`. That cuts browser revalidations and optimizer invocations, which fits today's CPU-reduction goal.
- Only WebP is produced. **Fix:** add `images.formats: ['image/avif', 'image/webp']` for about 20-30% smaller photos. Weigh this against higher first-encode CPU.

### I-5 · Low: logo preloaded on every page, competing with the LCP hero
`components/Navbar.tsx:88` has `priority` on a 208 px logo, so each page preloads two images (logo plus hero). **Fix:** remove `priority` from the logo, or render it as an inline SVG.

### I-6 · Low: original photos lack a visible human/first-hand signal
Activity pages show 2-5 images each, with no captions and no people or place context. For E-E-A-T and Google Images/Discover, add 4-8 captioned real photos per activity: the guide with clients and named spots. Use `ImageObject` with `creator: Frédéric Buet` in the JSON-LD if possible.

### I-7 · Low: dead code with a raw `<img>`
`app/activities/[slug]/page.tsx:79` is the only raw `<img>`, and it is unreachable because of the redirect. Delete the `app/activities/` folder.

## Status vs 2026-06-15 audit
The previous audit had no Images category. `/activities/*` duplicates are now redirected (FIXED), which also neutralizes the only raw `<img>`.

## Structured findings (audit-data.json, category "Images")
```json
{"category":"Images","score":60,"stats":{"img_tags_sampled":79,"missing_alt":0,"generic_or_wrong_alt":47,"raw_img_live":0,"served_format":"webp"},
"findings":[
{"id":"I-1","severity":"High","title":"Alt text generic/wrong: 30x 'Mon Coach Plein Air', 11x 'Image', title-only alts; blockContent image has no alt field","file":"components/Navbar.tsx:81; components/SiteFooter.tsx:55; components/PortableTextComponents.tsx:22; sanity/schemaTypes/blockContent.ts:62; app/aventures/[slug]/page.tsx:245,397"},
{"id":"I-2","severity":"Medium","title":"~120 MB originals in public/assets (30 MB PNG publicly served), HEIC, many unused"},
{"id":"I-3","severity":"Medium","title":"Fallback references missing /assets/IMG_9961.png","file":"components/ActivityFormats.tsx:39"},
{"id":"I-4","severity":"Low","title":"/_next/image max-age=0; no AVIF","file":"next.config.ts:24"},
{"id":"I-5","severity":"Low","title":"Logo preloaded with priority on every page","file":"components/Navbar.tsx:88"},
{"id":"I-6","severity":"Low","title":"Few captioned first-hand photos per activity"},
{"id":"I-7","severity":"Low","title":"Dead raw <img> in redirected app/activities/[slug]/page.tsx:79"}]}
```
