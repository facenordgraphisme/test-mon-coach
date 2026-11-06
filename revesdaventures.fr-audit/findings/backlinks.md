# Backlink profile — revesdaventures.fr (2026-11-06)

Tier 0 only (Moz/Bing/DataForSEO not configured). No web-search tool was available in this run, so referring pages were NOT enumerated.

## Score: INSUFFICIENT DATA (no numeric score)
Fewer than 4 scoring factors have data. Estimated qualitative rating: weak / near-zero authority (not a score).

## Data
| Metric | Value | Source |
|---|---|---|
| Common Crawl presence (apex and www, release cc-main-2026-jan-feb-mar) | NOT in crawl, NOT in rankings; no PageRank or harmonic centrality | CC (domain-level, 0.50) |
| Referring domains, DA, spam score, anchors, velocity | Unavailable | no source configured |
| GSC referring_urls (apex) | Provided by orchestrator, not re-fetched | GSC |

Interpretation: absence from CC is a weak signal (the graph covers a limited host sample). It is consistent with a very small local site that has few or no inbound links from well-linked hosts. It is not proof of zero links.

## Findings
1. HIGH — Cannot size the profile. Action: export GSC > Links (top linking sites / pages, top linked pages) and add a free Moz key (2,500 rows/month) or Bing Webmaster key to reach Tier 1/2.
2. MEDIUM — Link equity leak via redirects: apex -> www is a 307 (temporary) and http is 2 hops. Inbound links to the apex (GSC lists apex referring URLs) may pass signals less reliably. Fix: make the apex redirect a 308/301 in next.config.ts or at the host/DNS level, single hop for http.
3. MEDIUM — Entity/sameAs footprint is thin: lib/seo.ts:60-63 lists only Instagram and Facebook. Add Google Business Profile, Tripadvisor, GetYourGuide/Viator if present, Wikidata if eligible, and the guide's brevet/federation profile.
4. LOW — Dead/duplicate targets waste links: /aventures/planche-a-voile-windsurf (404 yet with impressions) and /booking/<id> (indexed). Redirect the windsurf URL (301) to the relevant live page so any links to it count.

## Realistic local link targets (not verified; check each is accepting listings)
Priority 1 (free, high relevance):
- Office de Tourisme Serre-Ponçon (and Embrun / Les Orres / Savines-le-Lac / Chorges bureaux): prestataire/"activités de pleine nature" listing page (typically via the Apidae/SIT partner form).
- Hautes-Alpes Tourisme / Hautes-Alpes.net, Alpes-du-Sud tourism portal (provider listings).
- Commune sites and Communauté de communes Serre-Ponçon "associations / professionnels" pages.
- Google Business Profile, Bing Places, Apple Business Connect, Pages Jaunes, Tripadvisor (Experiences), Facebook/Instagram bio links (nofollow but citation value).

Priority 2 (partnerships):
- Local accommodations (campings, gîtes, hôtels, chambres d'hôtes of Embrun, Les Orres, Savines, Crots): "activités à proximité" pages with a link to specific activity pages (canyoning, via ferrata).
- Base nautique / clubs and sports shops (VTT, kayak, windsurf) in Serre-Ponçon; station de ski Les Orres summer pages.
- Federations/professional bodies: Syndicat national des guides / moniteurs d'escalade, FFME comité territorial (if affiliated), Fédération française de canyon / FFCAM clubs, SNAPEC-type local pro lists, Label "Hautes-Alpes Qualité" or equivalent if eligible.

Priority 3 (content-led):
- Local blogs/press (Dauphiné Libéré, Embrun/Hautes-Alpes news), outdoor bloggers, "que faire à Serre-Ponçon" listicles: pitch with guided-trip stories and seasonal info.
- Publish linkable assets (guide via ferrata Embrun, canyon difficulty map, saison/conditions page) after the blog gets indexed (/blog currently unknown to Google).

## Anchor guidance
Mostly brand ("Rêves d'Aventures"), naked URL, plus a few descriptive ("canyoning à Serre-Ponçon", "via ferrata Embrun") pointed at the matching activity pages. Avoid exact-match anchors at scale. Link to www canonical URLs directly.

## Not done
Verification crawler (verify_backlinks.py) not run: no known backlink list was supplied. Provide GSC "Links" export to verify. No toxic-link assessment possible.

## Previous audit
No backlink category in the archive was compared; treat as STILL OPEN (no data).
