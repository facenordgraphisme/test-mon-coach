# Visual / mobile audit — 2026-11-06 (Chromium; desktop 1440x900, mobile iPhone 13 emulation 390x844, touch+UA)
Screenshots: revesdaventures.fr-audit/screenshots/{desktop,mobile}-{home,mono,viaferrata,calendrier,contact,blog}.png (+ -full for home, mono)

**Score: 66/100**

## What works
- No horizontal scroll on any of the 6 pages at either viewport (scrollWidth = viewport). Home carousel overflow (cards to x=1755 / 649) is intentional, in a clipped scroller.
- Exactly one visible H1 per page, above the fold on all pages/viewports, large (36-72px), strong contrast on hero images.
- Body font 16px; no image without alt on the 6 pages; hamburger present on mobile; hero imagery is high quality and loads without visible layout shift.
- Desktop: sticky header has a persistent "RÉSERVER" button (Navbar.tsx:130-131) and home has a hero CTA "RÉSERVER OU OFFRIR UNE SORTIE" (347x56) in view at y=639.

## Findings
### High — Cookie banner covers 37% of the mobile viewport on every page, hides the home hero CTA and content
- components/CookieBanner.tsx:37-38 `fixed bottom-4 left-4 right-4 ... z-50`: 358x315px on 390x844 (37% of viewport; 26% on desktop, 448x237).
- Home mobile: banner top y=514 while hero CTA is at y=602-658 -> the only above-the-fold Réserver CTA is fully covered until the user answers. Also hides the hero bullets ("3 Niveaux...").
- Mono-activité mobile: covers the activity-type cards (Escalade/Canyoning/VTT icons start at y~770). Blog: covers the first paragraph. Persists on every page (a modal-like block for first-time visitors, likely to inflate bounce and hurt LCP/CLS perception).
- Layout on mobile stacks icon + text with a wide left gutter (text column only ~60% width) which makes it tall; buttons are only 34px high (ACCEPTER/REFUSER 216x34), X close 20x20.
- Fix: on mobile make it a compact bottom bar (~120px): drop the icon column (CookieBanner.tsx:43-45), `text-xs`, place buttons side by side (`flex-row` always, line 59), buttons `h-11`, shorten copy. Make the close/REFUSER target >=44px. Ensure Refuser is as prominent as Accepter (CNIL).

### High — No persistent "Réserver" CTA on mobile except home hero
- Mobile header shows only logo + hamburger; the Réserver button is desktop-only (Navbar.tsx:130-131; in mobile menu only at :204, behind the burger). On /aventures/*, /calendrier, /contact, /blog/* mobile has zero visible Réserver CTA above the fold (detected CTAs: none on 5/6 mobile pages).
- Blog post mobile: H1 takes 336px (y=73-409, 48px font, 6 lines) and no CTA in first screen.
- Fix: add a compact "Réserver" pill next to the hamburger on mobile (Navbar.tsx near the Mobile Toggle ~line 135) and/or a sticky bottom CTA bar on activity and blog pages (hide while cookie banner shown or stack above it).

### Medium — Tap targets below 44-48px
- Mobile footer links 358x20 (Accueil, Le Calendrier, Niveaux, Le Guide...: footer, y~10341+ on home) -> add `py-3`.
- Calendar widget (calendrier, mono-activité): day cells 33x33, prev/next month 32x32 (shadcn calendar defaults) -> `[--cell-size:44px]` on mobile. 64 sub-44px targets on /calendrier mobile.
- Contact: phone and email links 21px high, form inputs 36px high (firstname/lastname/email), select 40px; "Voir les détails" links 113x20 on home cards; inline blog links ~21px; instagram icon 40x40; hamburger button 40x40 (OK-ish, raise to 44).
- Cookie "En savoir plus" 84x23, Fermer 20x20.
- Desktop nav links are 20px tall text (fine for mouse; pad the hit area).

### Medium — Mono-activité mobile: filter button overflows viewport
- A `BUTTON.px-6 py-3 rounded-2xl border text-sm` extends to x=404 (viewport 390) on /aventures/mono-activite (ActivityFilterableList.tsx filter chip row; not causing page scroll because the container clips/scrolls, but the label is cut). Also 5 text elements <12px on that page. Fix: make the chip row `overflow-x-auto` with fade/snap or allow wrapping.
- Related to client-only catalogue: server HTML shows "Chargement..." (see context); users on slow connections see an empty list first (layout shift risk).

### Low — Blog H1 oversize on mobile
- 48px / 6 lines over a photo; face of the guide covered by title text (mobile-blog.png). Use `text-3xl sm:text-5xl lg:text-7xl` on blog hero; keeps subtitle/CTA in first screen.

### Low — Header contrast variance
- Blog mobile header is a light/frosted bar with green logo, while hero pages use transparent white logo; on /via-ferrata the H1 sits at y=356 (mobile) / 480 (desktop), lower than others, leaving the top empty hero area (not harmful).
- Small cookie/“Fermer” label is English-free; calendar buttons have English aria-labels ("Go to the Previous Month", "Go to the Next Month") on a French-only site -> localise (react-day-picker `fr` locale/labels).

### Low — Desktop cookie banner
- 448x237 bottom-right on desktop, does not hide the hero CTA (y=639 vs banner top 647 - touches it, minimal gap). OK.

## Accessibility-tree notes
- Navigation landmark present (`nav`). Icon-only hamburger button has no text (aria-label empty in my probe: t='' 40x40 at top 28) -> add `aria-label="Menu"` (Navbar.tsx mobile toggle ~line 135+). Instagram link label "instagram" is fine.

## Status vs 2026-06-15 audit
No visual findings carried over to compare; the cookie/CTA/tap-target issues above are all OPEN.
