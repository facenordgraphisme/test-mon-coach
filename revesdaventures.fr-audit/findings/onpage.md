# On-Page SEO — Rêves d'Aventures (revesdaventures.fr)

Score: **45/100**

## What works

- Homepage title and description are well-optimized and keyword-rich:
  - Title: "Rêves d'Aventures | Escalade, Canyoning & VTT Hautes-Alpes"
  - Description targets "Escalade", "Canyoning", "VTT", "Lac de Serre-Ponçon", "guide diplômé"
- `lib/seo.ts` has a centralized `generateSeoMetadata()` helper that correctly sets title, description, OpenGraph and Twitter card fields wherever it's used with real Sanity SEO data.
- The legacy `/activities/[slug]` route ([app/activities/[slug]/page.tsx:54-58](app/activities/[slug]/page.tsx#L54-L58)) has genuinely good, unique, per-activity meta descriptions — this copy already exists, it's just on the wrong/orphaned route.
- All 11 images on the homepage have descriptive `alt` text.

## Critical Issues

### 1. Six activity pages share one identical, generic, off-brand meta description
**Severity: Critical**

`/aventures/escalade`, `/aventures/canyoning`, `/aventures/via-ferrata`, `/aventures/velo-de-route`, `/aventures/vtt-et-vtt-electrique`, and `/aventures/planche-a-voile-windsurf` all output:

```
<meta name="description" content="Mon Coach Plein Air - Aventures dans les Hautes Alpes"/>
```

53 characters, generic, **uses the previous brand name "Mon Coach Plein Air"** instead of the current "Rêves d'Aventures", and gives zero information about the specific activity.

**Root cause** ([app/aventures/[slug]/page.tsx:187-191](app/aventures/[slug]/page.tsx#L187-L191)):

```ts
return generateSeoMetadata(doc?.seo, {
    title: doc?.title,
    description: "Mon Coach Plein Air - Aventures dans les Hautes Alpes",
    url: `https://moncoachpleinair.com/aventures/${slug}`
});
```

This is the **fallback** used when the Sanity `activity` document has no `seo.metaDescription` set — which is currently true for every activity. Two additional problems in this same fallback:
- The `url` field uses **`moncoachpleinair.com`** — a different domain entirely (the old brand's domain), not `revesdaventures.fr`. This value feeds `openGraph.url` in `generateSeoMetadata` ([lib/seo.ts:25](lib/seo.ts#L25)), so the `og:url` meta tag on every `/aventures/*` page points at a third-party/old domain.
- The fallback `title` is just `doc?.title` (e.g. "Escalade") with no keyword context, relying entirely on the layout's `"%s | Rêves d'Aventures"` template.

**Fix:** Replace the hardcoded fallback with the same pattern already proven on the legacy route:
```ts
return generateSeoMetadata(doc?.seo, {
    title: `${doc?.title || 'Activité'} | Rêves d'Aventures Hautes-Alpes`,
    description: `Découvrez l'activité ${doc?.title} avec Rêves d'Aventures. Expérience exclusive au cœur des Hautes-Alpes et du lac de Serre-Ponçon.`,
    url: `https://www.revesdaventures.fr/aventures/${slug}`,
});
```
Longer term, populate `seo.metaTitle` / `seo.metaDescription` per activity in Sanity for fully unique copy per page.

---

### 2. Three pages have a 19-character meta description: "Mon Coach Plein Air"
**Severity: High**

`/aventures/mono-activite`, `/aventures/duo-activites`, and `/multi` all output `<meta name="description" content="Mon Coach Plein Air"/>` — just the old brand name, 19 characters (Google's effective range is ~120-158 characters).

**Root cause:** Same pattern as above — these pages' `generateMetadata` falls back to a hardcoded `"Mon Coach Plein Air"` string when no Sanity `seo` document exists (e.g. [app/multi/page.tsx:106-109](app/multi/page.tsx#L106-L109)).

**Fix:** Same as #1 — replace with descriptive, on-brand, keyword-relevant fallback copy (40-60 words) specific to each page's content (multi-activity stays, custom adventures, etc.).

---

## High Issues

### 3. Title tags mix the old "Mon Coach Plein Air" brand with the new "Rêves d'Aventures" brand
**Severity: High**

- `/niveaux` → `Niveaux d'Engagement | Mon Coach Plein Air | Rêves d'Aventures` (72 chars)
- `/acces` → `Accès & Hébergement | Mon Coach Plein Air | Rêves d'Aventures` (70 chars)
- `/avis` → `Avis Clients | Mon Coach Plein Air | Rêves d'Aventures` (59 chars)

**Root cause:** Page-level `generateMetadata` functions hardcode titles like `"Niveaux d'Engagement | Mon Coach Plein Air"` (e.g. [app/niveaux/page.tsx:40](app/niveaux/page.tsx#L40)) as the fallback, and the root layout's title template (`"%s | Rêves d'Aventures"`, [app/layout.tsx:22-25](app/layout.tsx#L22-L25)) then appends the **current** brand on top — producing two different brand names in one `<title>`, and pushing the longest of these (72 chars) well past Google's typical truncation point (~580px, roughly 50-60 chars depending on characters).

**Fix:** Remove `"Mon Coach Plein Air"` from these three fallback titles — they only need the page-specific part (e.g. `"Niveaux d'Engagement"`), since the layout template already appends `"| Rêves d'Aventures"`.

### 4. Redundant double brand name on /calendrier, /guide, /contact
**Severity: Medium**

- `/calendrier` → `Calendrier des Sorties | Rêves d'Aventures Hautes-Alpes | Rêves d'Aventures` (85 chars)
- `/guide` → `Votre Guide | Rêves d'Aventures | Rêves d'Aventures` (61 chars)
- `/contact` → `Contact | Rêves d'Aventures | Rêves d'Aventures` (57 chars)

These pages' fallback titles already include `"Rêves d'Aventures"`, and the layout's `"%s | Rêves d'Aventures"` template appends it a **second time**. The 85-character `/calendrier` title is the longest on the site and will be heavily truncated in search results.

**Fix:** Drop `"| Rêves d'Aventures"` from these three page-level fallback titles and let the shared layout template add the brand suffix once.

### 5. Duplicate, non-descriptive heading before the H1 on the homepage
**Severity: Medium**

The homepage renders, in DOM order:
```
<h2>Rêves d'Aventures</h2>
...
<h1>Rêves d'Aventures</h1>
```
An `<h2>` with the exact same text as the `<h1>` appears **before** it in the document. Neither heading communicates a value proposition or target keyword — both are just the brand name. The actual descriptive tagline ("Vivre les sports de pleine nature à travers des expériences sur mesure") is rendered as plain text, not as part of the H1.

**Fix:** Make the H1 the primary, keyword-rich statement (e.g. *"Guide de pleine nature en Hautes-Alpes : Escalade, Canyoning, VTT"*), and either remove the duplicate H2 or repurpose it as a visually-hidden/structural element that doesn't duplicate H1 text.

## Info

- Missing `og:image` / `twitter:image` on every page checked (home, `/aventures/escalade`, `/contact`, `/guide`) — see Schema/Images findings for root cause and fix.
