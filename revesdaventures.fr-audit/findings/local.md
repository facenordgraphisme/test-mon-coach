# Local SEO findings - revesdaventures.fr (2026-11-06)

**Local SEO score: 38/100** (SAB, vertical: outdoor guide / sports activities, hybrid-leaning because JSON-LD declares an Embrun address that is not shown on page)

| Dimension | Weight | Score | Note |
|---|---|---|---|
| GBP signals | 25 | 5/25 | No Maps embed, no GBP link, no review-widget link; GBP existence unverifiable |
| Reviews & reputation | 20 | 8/20 | 4 on-site reviews (5.0), no third-party platform links |
| Local on-page | 20 | 9/20 | Strong H-A / Serre-Ponçon wording, but no location/service-area pages |
| NAP & citations | 15 | 5/15 | 3 different address representations; placeholder fixed |
| Local schema | 10 | 5/10 | Wrong-ish type, fake street address, deprecated openingHours, 3-decimal geo |
| Local links/authority | 10 | 6/10 | Instagram/Facebook sameAs only; no tourist-office / Bureau des Guides links |

## What works
- Phone +33 6 83 16 94 02 is now identical in footer/contact (tel: link), /mentions-legales, JSON-LD (lib/seo.ts:66, :98). The June placeholder (+33 6 00 00 00 00) is FIXED in schema (still a hardcoded fallback in app/contact/page.tsx:76, only used if Sanity phone is empty).
- Email consistent (contact@revesdaventures.fr) on live pages.
- /guide lists diplomas: "Brevet d'Etat Escalade/Canyonisme/Via ferrata, BEES 1 Cyclisme option VTT, BEES 1 Canoe-kayak" (strong E-E-A-T and Local trust). CGV states RC Pro insurance with MAIF (app/cgv/page.tsx:387).
- areaServed lists Hautes-Alpes, Serre-Ponçon, Embrun, Guillestre, Gap (lib/seo.ts:112-118).
- AggregateRating (4 reviews, 5.0) rendered on /avis (live JSON-LD) - was MISSING in June, now FIXED (via generateReviewSchema, lib/seo.ts:124-149).
- Instagram and Facebook profiles /revesdaventures respond HTTP 200 (existence only; content not verified).

## NAP audit (source comparison)
| Source | Name | Address | Phone |
|---|---|---|---|
| JSON-LD LocalBusiness (lib/seo.ts:95-106) | Rêves d'Aventures | "Lac de Serre-Ponçon", Embrun 05200 (not a street address) | +33 6 83 16 94 02 |
| JSON-LD Organization (:56-70) | Rêves d'Aventures | none | same |
| Footer / contact (Sanity settings) | - | "Hautes-Alpes" / "Hautes-Alpes, France (Briançon, Embrun, Gap)" (contact page :100) | same |
| /mentions-legales (app/mentions-legales/page.tsx:29) | EI Frédéric BUET | 150 rue de la fontaine, 05160 SAINT APOLLINAIRE | 06 83 16 94 02 |
| GBP / PagesJaunes / TripAdvisor / tourist offices | NOT VERIFIED (see limitations) | - | - |

## Findings

### Critical
1. **No GBP evidence anywhere on site.** No Maps embed, no "Voir sur Google", no link to a Google reviews page/CID; footer shows only "Hautes-Alpes". For a SAB, GBP (primary category + service areas) is the #1 ranking lever. Fix: create/claim GBP as Service-Area Business (address hidden, service areas Embrun, Savines-le-Lac, Les Orres, Guillestre, Chorges, Gap, Champsaur), primary category "Guide d'escalade/ Guide de montagne" or "Service d'activités de plein air" (verify wording in GBP UI); add GBP URL to sameAs (lib/seo.ts:60-63) and a "Laissez un avis Google" link on /avis and in post-booking email (lib/mail.ts).
2. **Schema address inconsistent with legal address and not a real street address.** lib/seo.ts:101 `streetAddress: 'Lac de Serre-Ponçon'`, Embrun 05200, while legal seat is Saint-Apollinaire 05160 (mentions-legales). For a SAB with home address, Google guidelines: hide address; do not publish a fake one. Fix: remove `address.streetAddress` (keep addressLocality/Region/Country only, or Saint-Apollinaire 05160 if a public address is intended), keep `areaServed` as the real signal; make sure GBP address (hidden) matches the legal one.

### High
3. **No location / service-area pages.** GSC shows local intent with no landing page: "canyoning embrun" (8 impr, pos 27.6), "via ferrata les orres" (6 + 5, pos 32), "via ferrata serre-ponçon" (~15 total, pos 16-21), "canyoning les orres" (pos 38), "vacances les orres", "que faire dans le champsaur ce week-end" (5 impr, pos 1!), "guide via ferrata hautes-alpes" (~25 impr, pos 54). Dedicated service pages are the #1 local organic factor. Fix: create `/guide-[activité]-[lieu]` pages with unique content (not doorway swaps): e.g. canyoning-embrun (Rabioux/La Blache/Rouannette canyons seen in GSC), via-ferrata-les-orres, via-ferrata-serre-poncon (Savines/Rocher d'Arthouze/Serre-Eyraud), escalade-serre-poncon, activites-champsaur. Each: meeting point, season, level, price, local FAQ, Maps of meeting point, internal links from /aventures/*. Also fix indexing of existing activity pages (other agent).
4. **Reviews: only 4 first-party reviews, no third-party platform.** Self-hosted AggregateRating is not eligible for stars on a LocalBusiness's own site (Google self-serving policy) and 4 reviews is thin. Fix: collect Google reviews (target 25+, steady cadence), add Google/TripAdvisor review links, reply to each; keep on-site reviews as content, avoid relying on schema stars.
5. **Citations unverified/likely absent.** No links to PagesJaunes, TripAdvisor, Office de Tourisme Serre-Ponçon / Embrun / Les Orres / Champsaur-Valgaudemar, Bureau des Guides, Syndicat National des Guides de Montagne (SNGM), Annuaire Hautes-Alpes Tourisme (Alpes Tourisme/ Hautes-Alpes Tourisme "Prestataires d'activités"), Apidae. Fix: create consistent NAP listings (Name "Rêves d'Aventures", same phone/email, same service area); Apidae/tourist-office listing yields high-authority backlinks.

### Medium
6. **LocalBusiness subtype and fields** (lib/seo.ts:94, 119-120): `SportsActivityLocation` implies a physical venue; prefer `["LocalBusiness","SportsActivityLocation"]` or `TouristInformationCenter`-free alternative `Organization`+`LocalBusiness` with `hasOfferCatalog`; replace `openingHours: 'Mo-Su 08:00-20:00'` with `openingHoursSpecification` (and confirm it is real: seasonal, by appointment); `geo` has 3 decimals (44.563, 6.491) - use 5 decimals (and a real meeting-point/office coordinate, or drop geo for SAB). `priceRange '€€'` fine but add real "à partir de" price. Add `@id` (https://www.revesdaventures.fr/#business) and link Person founder via `@id`; add `hasCredential` for diplomas, `image`, and `knowsAbout`.
7. **Organization and LocalBusiness are separate, unlinked entities** (lib/seo.ts:52 vs :91) with the same name. Merge or link via @id/parentOrganization.
8. **Legal-notice typos hurt trust/NAP**: mentions-legales:29 email `contact@revesd'aventures.fr` (apostrophe, nonexistent domain) vs real contact@revesdaventures.fr; hosting/publisher fields still "[Nom Prénom]" and empty "Nom/Adresse/Téléphone". Fix content in Sanity.
9. **Footer/contact contain no real address or "zone d'intervention" text**; contact page :100 lists "Briançon, Embrun, Gap" whereas schema lists Guillestre, Serre-Ponçon, no Briançon. Align one canonical service-area list (site + schema + GBP).
10. **Guide credentials not in structured data / not stated as "Guide de haute montagne diplômé d'État" on key pages**; add visible badges (Diplôme d'État, RC Pro MAIF, affiliation Bureau des Guides/SNGM if applicable) on home + activity pages. Founder schema (lib/seo.ts:42-50) says "depuis plus de 30 ans" - make sure consistent with /guide.

### Low
11. Hardcoded fallbacks: app/contact/page.tsx:76 `+33 6 00 00 00 00`, components/SiteFooter.tsx:119 `hello@moncoach.com` / `contact@...` leak if Sanity settings are empty. Remove.
12. Contact page contains placeholder `jean.dupont@email.com` (form placeholder; harmless but change).
13. Mail sender name "Mon Coach Plein Air" (lib/mail.ts:16) differs from brand "Rêves d'Aventures" - brand-name inconsistency in outgoing mail, and brand-search query "reve d'aventure"/"reve escalade" is confused with other brands ("Reve de Bloc", "Rêve de Cimes"): reinforce full brand + location ("Rêves d'Aventures Embrun") in titles and GBP.
14. Proximity (~55% of local ranking variance) is outside the site's control; SAB without a visible address will mostly rank on service-area/organic.

## June-2026 issues status
- Placeholder phone in JSON-LD: FIXED.
- Review/AggregateRating missing on /avis: FIXED (live JSON-LD present).
- LocalBusiness schema w/ address: PARTIAL (exists but fake street; STILL OPEN).
- No GBP/Maps/location pages: STILL OPEN.

## Limitations
Search engines (Google, DDG, Bing) blocked automated fetching, so GBP existence/category/rating, PagesJaunes, TripAdvisor, tourist-office listings and social profile NAP/content were NOT verified; only site/code evidence and HTTP 200 for the Instagram/Facebook URLs. No local-pack rank data (DataForSEO not used), no review velocity/response-rate data, no Yelp/BBB (not relevant in FR). Recommend manual check of GBP Insights and a citation scan (Whitespark/BrightLocal).
