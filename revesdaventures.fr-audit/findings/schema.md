# Schema & Structured Data — Rêves d'Aventures (revesdaventures.fr)

Score: **50/100**

## What works

- Every page (via [app/layout.tsx:46-55](app/layout.tsx#L46-L55)) injects two well-formed JSON-LD blocks sitewide:
  - `SportsActivityLocation` ([lib/seo.ts:58-89](lib/seo.ts#L58-L89)) — full `PostalAddress` (Lac de Serre-Ponçon, Embrun, 05200, FR), `GeoCoordinates`, `areaServed` (Hautes-Alpes, Serre-Ponçon, Embrun, Guillestre, Gap), `priceRange`, `openingHours`. This is a solid local-business foundation.
  - `SportsOrganization` ([lib/seo.ts:37-56](lib/seo.ts#L37-L56)) — `name`, `url`, `logo`, `sameAs` (Instagram + Facebook).
- A `WebSite` schema with `SearchAction` is present on the homepage ([lib/seo.ts:114-126](lib/seo.ts#L114-L126)).
- A `Product` schema generator exists (`generateProductSchema`) for activities with pricing/offers.
- All JSON-LD validates as syntactically correct (parses cleanly as JSON across all sampled pages).

## Critical Issues

### 1. Placeholder phone number in structured data conflicts with the real number used on `/contact`
**Severity: Critical**

Both sitewide schema blocks declare:
```json
"telephone": "+33 6 00 00 00 00"
```

This appears in **`generateOrganizationSchema()`** ([lib/seo.ts:50](lib/seo.ts#L50)) and **`generateLocalBusinessSchema()`** ([lib/seo.ts:65](lib/seo.ts#L65)), both injected into **every page** via the root layout.

The **real, working** phone number — used in a `tel:` link on `/contact` — is **`+33 6 83 16 94 02`**.

**Impact:** This is a NAP (Name/Address/Phone) **inconsistency** baked into the site's own structured data, present on every single page. If Google ever pulls a phone number from this schema for a Knowledge Panel, local pack, or sitelinks search box, it will surface a non-functional placeholder number — actively harmful for a local-service business where phone bookings/inquiries matter. It also undermines trust if cross-checked against Google Business Profile, where the real number should be listed.

**Fix:** Replace `'+33 6 00 00 00 00'` with `'+33683169402'` (E.164 format, no spaces is fine, but match whatever format is used in Google Business Profile) in both functions in `lib/seo.ts`.

## High Issues

### 2. No `Review` / `AggregateRating` schema on `/avis` despite real testimonials
**Severity: High**

`/avis` displays multiple real, attributed, dated customer testimonials (with star ratings rendered visually — see `app/aventures/[slug]/page.tsx:619-642` for the same review-rendering pattern used elsewhere) but ships **zero `Review` or `AggregateRating` JSON-LD**.

**Fix:** Add a `Review[]` array (or `AggregateRating` summary) to the `SportsActivityLocation`/`LocalBusiness` schema on `/avis`, using the existing testimonial data (author, date, review text, rating). Note: Google has restricted self-serving `Review`/`AggregateRating` rich snippets for local businesses on their own sites in some cases — confirm current eligibility, but at minimum this strengthens the page's semantic content for AI answer engines (GEO).

## Medium Issues

### 3. `Product` schema offer price and URL reference the old route structure
**Severity: Medium**

`generateProductSchema()` ([lib/seo.ts:91-112](lib/seo.ts#L91-L112)) builds:
```ts
offers: {
  '@type': 'Offer',
  price: activity.price,       // not present in the /aventures/[slug] data model
  ...
  url: `https://revesdaventures.fr/activities/${activity.slug}`  // old route
}
```
In the current `/aventures/[slug]` data model ([app/aventures/[slug]/page.tsx:23-102](app/aventures/[slug]/page.tsx#L23-L102)), pricing lives on **events** (`upcomingEvents[].price`), not on the `activity` document itself — so `activity.price` is likely `undefined`, which would serialize a `Product` offer with `"price": null` (or omit it), which fails Google's Merchant/Product rich-result requirements (a valid numeric price is mandatory). The hardcoded `url` also points at the old `/activities/{slug}` path.

**Fix:** If `generateProductSchema` is actually wired into `/aventures/[slug]` (verify via the `customJsonLd` / `seo.structuredData` mechanism), update it to source price from the nearest upcoming event and fix the URL to `https://www.revesdaventures.fr/aventures/${slug}`. If it's dead/unused code from the old route, remove it during the `/activities` cleanup (technical issue #3).

## Info

- `openGraph.images` is empty on every page (`generateSeoMetadata` returns `images: []` when `seo.openGraphImage` isn't set in Sanity, and the root layout's `openGraph` config has no fallback `images` array either) — see Images findings for the fix.
