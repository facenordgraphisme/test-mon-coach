# Schema / Structured Data - revesdaventures.fr (2026-11-06)

Score: **58/100** (previous audit: 50)

Method: live HTML fetched for /, /avis, /guide, /aventures/via-ferrata, /aventures/mono-activite, /blog/canyoning-hautes-alpes-guide-debutant, /contact. All ld+json parsed: valid JSON, @context https://schema.org. Code reviewed: lib/seo.ts, app/layout.tsx, per-page scripts.

## Detected schema per page
| Page | Blocks |
|---|---|
| ALL pages (app/layout.tsx:49-52) | SportsActivityLocation + SportsOrganization (nested Person founder, ContactPoint) |
| / | + WebSite/SearchAction + FAQPage (app/page.tsx:60-63) |
| /avis | global blocks + a 2nd SportsActivityLocation copy with AggregateRating (5.0 / 4 reviews) + 4 Review (app/avis/page.tsx:85-91) |
| /guide, /contact | global + an empty `[]` script (app/guide/page.tsx:43-46, app/contact/page.tsx:50) |
| /aventures/via-ferrata, /aventures/mono-activite | global only. No page-level schema (customJsonLd null) |
| blog post | global + BlogPosting + FAQPage |

No BreadcrumbList on any live page. No Service/Offer/Event/Product/TouristTrip.

## What works / FIXED vs previous audit
- FIXED: placeholder phone +33 6 00 00 00 00 replaced by real +33 6 83 16 94 02 (lib/seo.ts:53,77), matches /contact.
- FIXED: dead generateProductSchema removed. Review schema built only from real Sanity reviews (app/avis/page.tsx:84), demo fallback excluded.
- /avis now has AggregateRating + Review (was missing). Ratings match visible reviews.
- BlogPosting valid (author Person, publisher logo, ISO dates, mainEntityOfPage).
- Geo 44.563/6.491 is consistent with Embrun centre; postcode/country OK. Absolute https URLs.

## Findings

### 1. [High] Self-serving AggregateRating on own LocalBusiness (/avis), plus duplicated entity
app/avis/page.tsx:85 and lib/seo.ts:124-150: generateReviewSchema spreads the whole SportsActivityLocation and attaches aggregateRating/review. Google's policy treats reviews about the site's own business as self-serving, so no star rich result should be expected. It also creates a SECOND SportsActivityLocation (no @id) duplicating the layout one. ratingValue is a string ("5.0"). Only 4 reviews. One review text mentions "soleil de décembre" but is dated 2026-08-27: check the Sanity date.
Fix: give the business an @id, reference it via itemReviewed instead of cloning it, make ratingValue numeric, keep it as semantic/GEO value only.

### 2. [High] No @id / entity linking; duplicate entities
Layout emits SportsActivityLocation and SportsOrganization as two unlinked entities for the same business (same name/url/phone). The blog publisher is a third unlinked "Organization"; WebSite has no publisher; founder Person is nested inline; BlogPosting author Person is another anonymous node.
Fix: one @graph (JSON-LD A) with business `#organization`, Person `#frederic-buet`, WebSite `#website`; other blocks reference by `{"@id": ...}`.

### 3. [High] Activity and formula pages carry no schema (largest opportunity)
app/aventures/[slug]/page.tsx:380-389 only prints Sanity `seo.structuredData`, which is empty. mono-activite, duo-activites and multi are the same. The GROQ query (lines 68-90) already provides date, price, seatsAvailable, maxParticipants, duration, difficulty. See JSON-LD C (Service+Offer+Breadcrumb) and D (Event per future session).
Note: pages are ISR 1h, so Event output stays reasonably fresh; emit only future dates.

### 4. [Medium] No BreadcrumbList on live pages
Only /activities has one (app/activities/page.tsx:44-60), a legacy route that points to /activities. Add a helper (JSON-LD E) for /aventures/[slug], /blog/[slug], /guide, /avis, /contact.

### 5. [Medium] Empty `<script type="application/ld+json">[]</script>` on /guide and /contact
guide/page.tsx:43-46 always renders the script. Make it conditional (as aventures/[slug] does). /guide is the natural place for a Person/ProfilePage (JSON-LD B): currently only an inline founder object with no image, knowsAbout or sameAs.

### 6. [Medium] LocalBusiness data quality (lib/seo.ts:63-113)
- streetAddress "Lac de Serre-Ponçon" is not a street address. Use the real meeting-point address or omit it. /contact says "Hautes-Alpes (Briançon, Embrun, Gap)" while areaServed lists Guillestre and Gap, not Briançon. Align with Google Business Profile.
- openingHours "Mo-Su 08:00-20:00" is probably untrue for a single-guide, booking-based operator. Match GBP or drop; use openingHoursSpecification.
- description mentions only Escalade/Canyoning/VTT, but the site also sells via ferrata, vélo de route, kayak, planche.
- Missing: image (only logo), @id, hasMap, GBP/Tripadvisor in sameAs, paymentAccepted, currenciesAccepted.
- contactPoint.availableLanguage includes "English" on a French-only site: verify it is true.
- SportsOrganization carries no address/phone itself (merging fixes that).

### 7. [Info] FAQPage on homepage and blog post
Google retired FAQ rich results for all sites (May 2026). No SERP value, AI/GEO benefit unconfirmed. Harmless since content is visible; do not invest further, do not add new ones.

### 8. [Low] WebSite SearchAction targets /search?q=, a route that does not exist (lib/seo.ts, generateWebsiteSchema). Google no longer shows a sitelinks searchbox. Remove potentialAction.

### 9. [Low] BlogPosting (lib/seo.ts generateArticleSchema)
Image falls back to the generic og-default.png. No inLanguage, @id, isPartOf. author and publisher should be @id references. Use a post-specific image of at least 1200px.

### 10. [Low] Ensure helpers never run for the null-slug activity (/aventures/null in sitemap).

## Ready-to-use JSON-LD

### A. Layout graph (replace output of generateLocalBusinessSchema + generateOrganizationSchema, app/layout.tsx:44-52)
```json
{
 "@context": "https://schema.org",
 "@graph": [
  {
   "@type": ["SportsActivityLocation", "SportsOrganization"],
   "@id": "https://www.revesdaventures.fr/#organization",
   "name": "Rêves d'Aventures",
   "url": "https://www.revesdaventures.fr/",
   "description": "Sorties encadrées par un guide de haute montagne : escalade, canyoning, via ferrata, VTT, vélo de route, kayak et planche à voile autour du lac de Serre-Ponçon, à Embrun et dans les Hautes-Alpes.",
   "logo": {"@type": "ImageObject", "url": "https://www.revesdaventures.fr/assets/logo-v2.png"},
   "image": ["https://www.revesdaventures.fr/assets/og-default.png"],
   "telephone": "+33683169402",
   "priceRange": "€€",
   "address": {"@type": "PostalAddress", "addressLocality": "Embrun", "postalCode": "05200", "addressRegion": "Provence-Alpes-Côte d'Azur", "addressCountry": "FR"},
   "geo": {"@type": "GeoCoordinates", "latitude": 44.563, "longitude": 6.491},
   "areaServed": [
    {"@type": "AdministrativeArea", "name": "Hautes-Alpes"},
    {"@type": "Place", "name": "Lac de Serre-Ponçon"},
    {"@type": "City", "name": "Embrun"},
    {"@type": "City", "name": "Guillestre"},
    {"@type": "City", "name": "Gap"}
   ],
   "founder": {"@id": "https://www.revesdaventures.fr/#frederic-buet"},
   "sameAs": ["https://www.instagram.com/revesdaventures", "https://www.facebook.com/revesdaventures"],
   "contactPoint": {"@type": "ContactPoint", "telephone": "+33683169402", "contactType": "customer service", "areaServed": "FR", "availableLanguage": ["French"]},
   "currenciesAccepted": "EUR"
  },
  {
   "@type": "WebSite",
   "@id": "https://www.revesdaventures.fr/#website",
   "url": "https://www.revesdaventures.fr/",
   "name": "Rêves d'Aventures",
   "inLanguage": "fr-FR",
   "publisher": {"@id": "https://www.revesdaventures.fr/#organization"}
  }
 ]
}
```
To add once confirmed: openingHoursSpecification matching GBP, GBP/Tripadvisor URL in sameAs, hasMap.

### B. /guide Person
```json
{
 "@context": "https://schema.org",
 "@type": "ProfilePage",
 "@id": "https://www.revesdaventures.fr/guide#profilepage",
 "url": "https://www.revesdaventures.fr/guide",
 "inLanguage": "fr-FR",
 "isPartOf": {"@id": "https://www.revesdaventures.fr/#website"},
 "mainEntity": {
  "@type": "Person",
  "@id": "https://www.revesdaventures.fr/#frederic-buet",
  "name": "Frédéric Buet",
  "jobTitle": "Guide de haute montagne",
  "description": "Ancien sportif de haut niveau en canoë-kayak, guide de haute montagne depuis plus de 30 ans et fondateur de Rêves d'Aventures.",
  "url": "https://www.revesdaventures.fr/guide",
  "image": "GUIDE_PHOTO_ABSOLUTE_URL",
  "worksFor": {"@id": "https://www.revesdaventures.fr/#organization"},
  "knowsAbout": ["Escalade", "Canyoning", "Via ferrata", "VTT", "Vélo de route", "Kayak", "Planche à voile"]
 }
}
```
Replace GUIDE_PHOTO_ABSOLUTE_URL with the real photo URL (do not ship the placeholder). Add hasCredential only with the real diploma name once confirmed.

### C. /aventures/[slug] (build near app/aventures/[slug]/page.tsx:380)
```json
{
 "@context": "https://schema.org",
 "@graph": [
  {
   "@type": "Service",
   "@id": "https://www.revesdaventures.fr/aventures/via-ferrata#service",
   "name": "Via ferrata encadrée à Embrun - Serre-Ponçon",
   "serviceType": "Via ferrata guidée",
   "description": "FROM activity.description",
   "url": "https://www.revesdaventures.fr/aventures/via-ferrata",
   "image": "FROM activity hero image, absolute URL",
   "provider": {"@id": "https://www.revesdaventures.fr/#organization"},
   "areaServed": {"@type": "Place", "name": "Embrun, Hautes-Alpes"},
   "offers": {
    "@type": "Offer",
    "url": "https://www.revesdaventures.fr/aventures/via-ferrata",
    "priceCurrency": "EUR",
    "price": "FROM lowest upcomingEvents price (numeric string)",
    "availability": "https://schema.org/InStock",
    "seller": {"@id": "https://www.revesdaventures.fr/#organization"}
   }
  },
  {
   "@type": "BreadcrumbList",
   "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.revesdaventures.fr/"},
    {"@type": "ListItem", "position": 2, "name": "Activités", "item": "https://www.revesdaventures.fr/aventures/mono-activite"},
    {"@type": "ListItem", "position": 3, "name": "Via ferrata"}
   ]
  }
 ]
}
```
Capitalised "FROM ..." strings are values to inject from Sanity. Omit the Offer if no numeric price exists (never output null or 0).

### D. Dated session (one per future upcomingEvents item)
```json
{
 "@context": "https://schema.org",
 "@type": "Event",
 "name": "Via ferrata encadrée - 14 décembre",
 "startDate": "2026-12-14T09:00:00+01:00",
 "endDate": "2026-12-14T13:00:00+01:00",
 "eventStatus": "https://schema.org/EventScheduled",
 "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
 "location": {"@type": "Place", "name": "FROM event.locationInfo", "address": {"@type": "PostalAddress", "addressLocality": "Embrun", "postalCode": "05200", "addressCountry": "FR"}},
 "image": ["FROM activity image"],
 "description": "FROM event.description",
 "organizer": {"@id": "https://www.revesdaventures.fr/#organization"},
 "performer": {"@id": "https://www.revesdaventures.fr/#frederic-buet"},
 "maximumAttendeeCapacity": 6,
 "remainingAttendeeCapacity": 4,
 "offers": {"@type": "Offer", "url": "https://www.revesdaventures.fr/aventures/via-ferrata", "price": "65", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"}
}
```
Values are illustrative. Map from event.date, duration, price, seatsAvailable/maxParticipants. Use SoldOut when seatsAvailable = 0 and EventCancelled when status says so. Event is the only dated-session type with a Google rich result; TouristTrip is optional and has none.

### E. Breadcrumb helper (blog, guide, avis, contact)
```ts
export const breadcrumb = (items: { name: string; path?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    ...(it.path ? { item: `https://www.revesdaventures.fr${it.path}` } : {}),
  })),
});
```

### F. BlogPosting fix (generateArticleSchema)
Set author to `{"@id": "https://www.revesdaventures.fr/#frederic-buet"}`, publisher to `{"@id": "https://www.revesdaventures.fr/#organization"}`, add `inLanguage: "fr-FR"` and `isPartOf: {"@id": ".../#website"}`, and use a post-specific image.

### G. /avis
Keep the Review items but use `"itemReviewed": {"@id": "https://www.revesdaventures.fr/#organization"}` instead of cloning the business; ratingValue numeric. Treat as not star-eligible.

## Priorities
1. Merge layout entities into a @graph with @id (A).
2. Add Service+Offer / Event / Breadcrumb on /aventures/[slug] and formula pages (C, D, E).
3. Person on /guide (B); make empty scripts conditional.
4. Clean LocalBusiness data (street address, hours, description, languages); remove dead SearchAction.
5. Stop spreading the business in generateReviewSchema.
Do not add HowTo or new FAQPage.
