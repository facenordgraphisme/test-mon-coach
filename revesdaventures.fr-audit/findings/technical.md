# Technical SEO findings - revesdaventures.fr (2026-11-06)

**Technical score: 68/100** (previous audit 2026-06-15: 44 overall)

| Category | Status |
|---|---|
| Crawlability | PASS (minor) |
| Indexability | FAIL (booking pages, legacy 404, sitemap /null) |
| Security | PASS with gaps (HSTS no includeSubDomains, CSP unsafe-inline) |
| URL structure / redirects | PARTIAL (307 apex, 2-hop http, case-insensitive duplicates) |
| Mobile | PASS (not re-tested in depth) |
| JS rendering | PARTIAL (activity catalogue client-only) |
| Structured data | see schema agent |
| Hreflang | N/A (FR only) |
| IndexNow | Not implemented (low value for a Google-centric local site) |

## Fixed since 2026-06-15
- Canonicals/og:url/sitemap use the https://www host; all 28 crawled 200 pages have a correct self-canonical.
- /activities/:slug -> /aventures/:slug and /activities -> /aventures/mono-activite are 308 (next.config.ts:30-40; verified live on /activities/escalade).
- Security headers added (next.config.ts:46-60): nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP; HSTS present live.
- French static 404 with true 404 status; slug validation (SLUG_PATTERN, app/aventures/[slug]/page.tsx:175) avoids CMS calls on junk URLs.
- Pages prerendered / ISR 1h; trailing slash 308s to canonical.

## What works
robots.txt valid (allow /, disallow /api/, sitemap declared, app/robots.ts); sitemap lists www URLs; unique titles; HSTS on; llms.txt in public/.

## Findings

### HIGH-1 /booking/<id> pages are indexed, no metadata, no noindex
Evidence: GSC pages data shows 7 booking URLs with impressions (e.g. /booking/e0bdf1c0... 16 imp, a69e17f3... 11 imp); GSC inspect: indexed, no canonical, generic homepage title. app/booking/[id]/page.tsx has no `generateMetadata` / `robots` export. They are dated event instances, so duplicate/thin and will expire.
Fix: add `export const metadata = { robots: { index: false, follow: true } }` (or generateMetadata with activity title + noindex). Do NOT block in robots.txt (Google must see the noindex). For past/missing events call `notFound()` or redirect to the parent /aventures/<slug>. Same for /success (200, indexable): add noindex in app/success/page.tsx.

### HIGH-2 Legacy URL still ranking now 404: /aventures/planche-a-voile-windsurf
86 impressions, 3 clicks, position 11.3 (3rd best page by clicks). /aventures/vtt also 404 (probable old URL).
Fix: best, recreate the activity in Sanity with the same slug. Otherwise add to next.config.ts redirects(): `{ source: '/aventures/planche-a-voile-windsurf', destination: '/aventures/vtt-et-planche-a-voile', permanent: true }` (or /aventures/mono-activite). Then review GSC Pages > Not found (404) and add 301s for other former slugs (e.g. /aventures/vtt, /aventures/kayak, /aventures/planche-a-voile).

### HIGH-3 sitemap.xml lists /aventures/null (404)
app/sitemap.ts:8: GROQ `*[_type == "activity"]` lacks `defined(slug.current)`, so a slug-less document yields `/aventures/null`. Posts query (sitemap.ts:19) has the same flaw. The query also ignores `_type == "formula"` while generateStaticParams (app/aventures/[slug]/page.tsx:181) includes formulas: any formula-only document would be missing from the sitemap.
Fix: `*[(_type == "activity" || _type == "formula") && defined(slug.current)]{ "slug": slug.current, _updatedAt }`; add `defined(slug.current)` for posts; make slug required in the Sanity schema and fix the offending doc.

### MEDIUM-1 Sitemap lastModified = new Date() on all 13 static URLs (sitemap.ts:36-110)
Every request claims every static page changed now, so Google learns to ignore lastmod. changeFrequency/priority are ignored by Google.
Fix: fixed ISO dates per page (update when content changes) or Sanity `_updatedAt`; drop changefreq/priority.

### MEDIUM-2 www/apex redirect is 307 and http takes 2 hops
https://revesdaventures.fr -> 307 -> www; http://apex -> 308 https apex -> 307 www.
Fix in Vercel > Project > Settings > Domains: keep `www.revesdaventures.fr` as the primary domain (no redirect); edit `revesdaventures.fr` and choose "Redirect to www.revesdaventures.fr" with **308 Permanent Redirect**. Vercel then sends http/https apex to https://www in one hop. Check no vercel.json or DNS-provider redirect interferes. Verify with `curl -sI http://revesdaventures.fr` (one 308 to https://www.revesdaventures.fr/). Add a GSC Domain property.

### MEDIUM-3 Client-only activity catalogue (mono-activite, duo-activites, multi)
components/ActivityFilterableList.tsx uses useSearchParams inside Suspense; server HTML only has "Chargement...". Activity links absent from HTML; duo activities have 0 HTML inlinks, matching the GSC "unknown / crawled not indexed" status.
Fix: render the full list server-side (pass it as the Suspense fallback / initial state) and apply the filter after hydration.

### MEDIUM-4 Case-insensitive duplicate URLs
/Aventures/escalade returns 200. Canonical mitigates; verify it points to the lowercase URL, or add a lowercase redirect.

### MEDIUM-5 Dead routes app/activities/page.tsx and app/activities/[slug]/page.tsx
Shadowed by the redirects in next.config.ts:30-40; delete the folder.

### MEDIUM-6 404 page emits two robots meta tags
app/not-found.tsx:10 plus layout default. Harmless (noindex wins) but should be single.

### LOW-1 Security header polish
- HSTS `max-age=63072000` without `includeSubDomains; preload`.
- CSP script-src 'unsafe-inline' (move to nonces when feasible). Test the Stripe checkout flow end to end since `form-action 'self'` can block redirected form posts.
- Optional: Cross-Origin-Opener-Policy; `poweredByHeader: false` in next.config.ts.

### LOW-2 robots.txt
Fine. Optionally disallow /studio and /success. Do not disallow /booking/ (use noindex instead).

### LOW-3 Cache-Control `public, max-age=0, must-revalidate` on HTML is normal for Vercel ISR.

## Priority order
1. noindex /booking + /success. 2. Fix sitemap (slug filter, real lastmod). 3. Restore or 301 windsurf URL and sweep GSC 404s. 4. Apex->www 308 in Vercel. 5. Server-render activity catalogue. 6. Header polish. 7. Delete app/activities.
