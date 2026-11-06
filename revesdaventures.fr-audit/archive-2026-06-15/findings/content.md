# Content Quality & E-E-A-T — Rêves d'Aventures (revesdaventures.fr)

Score: **55/100**

## What works

- **Strong E-E-A-T foundation on `/guide`**: a first-person bio of Frédéric Buet — 30+ years practicing outdoor sports, former high-level canoe-kayak athlete, framed around safety, passion and authenticity ("Vivre la nature avec passion, sécurité et authenticité"). This is exactly the kind of experience/expertise signal Google (and AI answer engines) look for on a local service site. It is currently under-leveraged (see GEO findings — this content isn't reinforced by `Person`/`founder` schema).
- **Real, attributed customer testimonials on `/avis`** with first names and dates (e.g. "Coline G. — 25 mai 2026", "Bertrand — 2 janvier 2026", "Raphaël — 29 nov..."), describing specific activities (escalade session, vélo weekend, multi-activity school trip). This is genuine social proof, not generic placeholder reviews.
- **`/calendrier` shows real, dated, priced upcoming sessions** (e.g. "MultiNiveau 2", 22-26 June, "Complet", 250€) — a strong freshness signal and useful for both users and search engines.
- Activity pages have a clear topical structure: experience description, equipment, level/difficulty, related activities, upcoming sessions.

## Critical Issues

### 1. Live CMS placeholder text on the `/multi` page
**Severity: Critical**

The `/multi` page renders, as its hero subtitle (directly under the H1 "Multi / Sur-mesure"):

> **"Créez votre aventure (Contenu à configurer dans Sanity)"**

This literally translates to *"Create your adventure (Content to configure in Sanity)"* — a developer placeholder string, live and indexable in production.

**Root cause** ([app/multi/page.tsx:31-42](app/multi/page.tsx#L31-L42)): when no Sanity document of type `multiPage` exists yet, `getData()` falls back to a hardcoded object whose `subtitle` is this placeholder string, which is then rendered directly:

```ts
if (!doc) {
    doc = {
        title: "Multi / Sur-mesure",
        subtitle: "Créez votre aventure (Contenu à configurer dans Sanity)",
        ...
    };
}
```

**Impact:** Beyond the SEO/meta-description issue already noted (this same code path produces the 19-char description), this is a **visible trust/quality issue** for any visitor or crawler landing on `/multi` — it looks unfinished. For a page that should be selling "sur-mesure" (custom/bespoke) trips — likely a high-intent, higher-value page — this is a poor first impression.

**Fix:** Create and publish the `multiPage` singleton document in Sanity Studio with real hero copy. As a safety net, change the code fallback to a real marketing sentence (e.g. *"Créez votre aventure sur-mesure : week-end ou séjour multi-activités adapté à votre groupe."*) rather than a CMS configuration note.

## Medium Issues

### 2. Duplicate topical content between `/activities/*` and `/aventures/*`
**Severity: Medium**

The orphaned `/activities/escalade`, `/activities/canyoning`, etc. cover the same activities, same H1s, and same `SportsActivityLocation`/`SportsOrganization` schema as their `/aventures/*` counterparts (different page sizes — 58KB vs 48KB — indicating different templates but overlapping subject matter). Combined with the canonical bug (technical findings #1), this creates a confusing duplicate-content signal across two URL families for the same set of activities. Resolving technical issue #3 (redirect/remove `/activities/*`) also resolves this.

### 3. Generic fallback copy when activity descriptions are missing
**Severity: Low/Medium**

[app/aventures/[slug]/page.tsx:490](app/aventures/[slug]/page.tsx#L490) renders, when no Portable Text description exists for an activity/session:

> "Description détaillée à venir ou non disponible pour les sessions actuelles."

("Detailed description coming soon or unavailable for current sessions.") This is reasonable as a UI fallback, but if it appears on any currently-linked activity page, that page is thin on unique body content for that topic. Worth a quick content audit per activity to confirm every `/aventures/*` page has a real Portable Text description in Sanity.

## Opportunities

- The `/guide` bio (Frédéric Buet, 30 years of experience, ex-athlete) is a strong asset — consider expanding it slightly with specific qualifications/certifications (e.g. official guide diplomas, first-aid certs) to strengthen both E-E-A-T and the `priceRange`/`SportsActivityLocation` trust signals already in the schema.
- `/avis` testimonials are not yet marked up with `Review`/`AggregateRating` schema (see schema findings) — this is a content asset that's SEO-ready but not yet structured for rich results.
- No blog / guide articles beyond `/guide` (the bio page) were found. For a seasonal outdoor-activity business, short seasonal content (best months for canyoning, via ferrata difficulty guides, "what to bring" articles) would build topical depth and capture long-tail informational queries — but this is a strategic content investment, not a fix.
