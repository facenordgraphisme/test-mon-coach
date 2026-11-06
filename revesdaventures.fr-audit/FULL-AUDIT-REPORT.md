# Audit SEO complet — Rêves d'Aventures (www.revesdaventures.fr)

**Date :** 2026-11-06 · **URL auditée :** https://www.revesdaventures.fr/ · **Audit précédent :** 2026-06-15 (44/100, archivé dans `archive-2026-06-15/`)
**Type d'activité :** service local (zone de chalandise) — guide outdoor multi-activités (escalade, canyoning, via ferrata, VTT, vélo de route, voile/windsurf, kayak), Lac de Serre-Ponçon / Embrun / Savines-le-Lac, Hautes-Alpes. Réservation et paiement en ligne.
**Méthode :** crawl des 29 URL du sitemap et des liens internes, données Search Console (Search Analytics 90 j + inspection d'URL de 31 pages), PageSpeed Insights (Lighthouse 13.6), captures desktop/mobile, 10 analyses spécialisées, croisées avec le code source (Next.js 16 + Sanity) pour donner les fichiers et lignes en cause.
**Limites :** pas de données terrain CrUX (trafic insuffisant), GA4 non configuré (ID de propriété manquant), pas de clé Moz ; les moteurs de recherche ont bloqué la vérification automatique de la fiche Google Business Profile et des annuaires.

---

## Synthèse

### Score de santé SEO : 60 / 100 (juin : 44)

| Catégorie | Poids | Juin | Nov. | Détail |
|---|---|---|---|---|
| SEO technique | 22 % | 35 | **68** | [technical.md](findings/technical.md) |
| Qualité du contenu | 23 % | 55 | **46** | [content.md](findings/content.md) |
| SEO on-page | 20 % | 45 | **62** | [onpage.md](findings/onpage.md) |
| Données structurées | 10 % | 50 | **58** | [schema.md](findings/schema.md) |
| Performance (CWV) | 10 % | 40 | **82** | [performance.md](findings/performance.md) |
| Préparation à la recherche IA | 10 % | 40 | **55** | [geo.md](findings/geo.md) (49), [agentic.md](findings/agentic.md) (74) |
| Images | 5 % | 35 | **60** | [images.md](findings/images.md) |

Analyses complémentaires (hors score) : SEO local 38/100 ([local.md](findings/local.md)), SXO 41/100 ([sxo.md](findings/sxo.md)), visuel/mobile 66/100 ([visual.md](findings/visual.md)), backlinks : données insuffisantes ([backlinks.md](findings/backlinks.md)).

**Lecture :** les bugs de configuration de juin (canonical, sitemap, redirections, images, en-têtes) sont corrigés, et la Search Console le confirme : les impressions passent d'environ 25/mois (mai-juin) à environ 300/mois (juillet-octobre). Le contenu baisse (46 contre 55) parce que l'audit est plus exigeant sur l'E-E-A-T et que de nouveaux problèmes de confiance sont apparus. Ce qui freine désormais le site, c'est **la découverte de ses pages par Google** (catalogue rendu côté client) et **la minceur et la fiabilité du contenu**, plus que la technique.

### Données Search Console (90 jours, 08/08 → 03/11/2026)
- 924 impressions, 37 clics, CTR 4 %, position moyenne 11,5. Saisonnalité nette (pic août, creux novembre).
- 70 % des clics vont à l'accueil (requêtes de marque). La seule thématique hors marque qui génère des clics (windsurf / planche à voile Serre-Ponçon) pointe vers une page **aujourd'hui en 404**.
- Requêtes à potentiel mal classées : via ferrata Hautes-Alpes / Serre-Ponçon / Les Orres (positions 16 à 55), canyoning Embrun / Serre-Ponçon / La Blache (27 à 38), team building (6,5, 0 clic), « que faire dans le Champsaur » (position 1, aucune page dédiée).
- **Inconnues de Google :** `/aventures/canyoning`, `/aventures/escalade`, `/aventures/velo-de-route-et-via-ferrata`, `/blog` et les 2 articles. **Explorées, non indexées :** `/aventures/vtt-et-escalade`, `/aventures/velo-de-route-et-escalade`. **Indexées à tort :** des pages `/booking/<id>` (7 avec impressions), et `/aventures/planche-a-voile-windsurf` (404).

### Les 5 problèmes critiques
1. **Faux avis dans le HTML de l'accueil.** [components/ReviewSection.tsx:29-52](../components/ReviewSection.tsx#L29-L52) est un composant client avec 3 avis inventés en secours (« Aventurier Anonyme », « Marie L. », « Thomas B. », deux marqués « Google »). Ils sont dans le HTML servi à Google ; les vrais avis ne les remplacent qu'après exécution du JavaScript. Risque de confiance et de conformité (pratique commerciale trompeuse).
2. **Titre « Guide de haute montagne » non étayé.** Utilisé dans les métadonnées, le schéma et `llms.txt` ([lib/seo.ts:46-47,96](../lib/seo.ts#L46), [app/layout.tsx:26-33](../app/layout.tsx#L26)), alors que `/guide` liste des BE Escalade/Canyonisme/Via ferrata et des BEES VTT/Canoë-kayak/Voile. C'est un titre réglementé, et les moteurs IA le reprennent mot pour mot. **À confirmer avec le client.**
3. **Le catalogue d'activités est invisible dans le HTML.** Sur `/aventures/mono-activite`, `/aventures/duo-activites` et `/multi`, [components/ActivityFilterableList.tsx](../components/ActivityFilterableList.tsx) (`useSearchParams` sous `Suspense`) bascule en rendu client : le HTML ne contient que « Chargement... ». Les activités duo n'ont **aucun lien entrant** dans le HTML, et canyoning/escalade ne sont pas découvertes par Google.
4. **Pages de réservation indexées et page windsurf perdue.** `/booking/[id]` n'a ni metadata ni `noindex` (titre générique de l'accueil) ; `/aventures/planche-a-voile-windsurf` (86 impressions, 3 clics) renvoie 404 sans redirection ; `/aventures/vtt` aussi.
5. **Pages d'activité minces et génériques.** 54 à 260 mots, même méta-description modèle sur 14 pages ([app/aventures/[slug]/page.tsx:199-203](../app/aventures/[slug]/page.tsx#L199-L203)), aucun prix, durée, âge minimum ni lieu nommé tant qu'aucune séance n'est programmée (« Pas de dates prévues prochainement »). Sur les requêtes cibles, Google classe des fiches qui affichent « dès X € », une durée et un itinéraire.

### Les 5 gains rapides
1. Redirection 301 de `/aventures/planche-a-voile-windsurf` (et `/aventures/vtt`) vers la page active ; mise à jour de `llms.txt`.
2. `noindex` + vrai titre sur `/booking/[id]` et `/success`.
3. Sitemap : filtrer les slugs nuls (`/aventures/null` est listé en 404), dates `lastModified` réelles.
4. Domaine apex : passer la redirection Vercel `revesdaventures.fr → www` de 307 à **308 permanente** en un seul saut.
5. Supprimer les faux avis et rendre les vrais avis côté serveur.

---

## 1. SEO technique — 68/100

**Corrigé depuis juin :** canonicals propres à chaque page sur l'hôte www, sitemap aux bonnes URL, redirections 308 `/activities/*`, en-têtes de sécurité + CSP + HSTS, vraie 404 en français, pré-rendu de toutes les pages publiques (déployé aujourd'hui), garde-fou sur les slugs.

**Ouvert :**
- **Élevé :** catalogue rendu côté client (voir critique n° 3).
- **Élevé :** `/booking/<id>` et `/success` indexables ([app/booking/[id]/page.tsx](../app/booking/[id]/page.tsx), [app/success/page.tsx](../app/success/page.tsx)). Ajouter `robots: { index: false, follow: true }` sans les bloquer dans robots.txt, pour que Google voie le noindex.
- **Élevé :** anciennes URL en 404 avec impressions (`/aventures/planche-a-voile-windsurf`, `/aventures/vtt`).
- **Élevé :** `/aventures/null` dans le sitemap ([app/sitemap.ts:8](../app/sitemap.ts#L8), pas de `defined(slug.current)` ; idem pour les articles l. 19).
- **Moyen :** `lastModified: new Date()` sur les 13 URL statiques ([app/sitemap.ts:36-110](../app/sitemap.ts#L36)), ce qui envoie un signal de fraîcheur artificiel.
- **Moyen : www / apex.** Le choix de **www** comme hôte canonique est le bon : tout le code, le sitemap et la propriété GSC sont alignés dessus, inutile de changer. En revanche `https://revesdaventures.fr` répond **307 (temporaire)** et `http://revesdaventures.fr` fait **2 sauts** (308 vers https apex puis 307 vers www). Dans Vercel → Domains : garder `www.revesdaventures.fr` en principal, régler `revesdaventures.fr` sur « Redirect to www.revesdaventures.fr » en **308 Permanent**. Google voit encore des liens vers l'apex (referring_urls GSC). Optionnel : ajouter une propriété GSC de type **Domaine** (`sc-domain:revesdaventures.fr`) pour voir apex, www, http et https en un seul endroit.
- **Moyen :** `/Aventures/escalade` (majuscule) répond 200. Le canonical limite l'impact, mais une redirection en minuscules serait plus propre.
- **Faible :** dossier `app/activities/` mort (masqué par les redirections), deux balises `robots` sur la 404, HSTS sans `includeSubDomains; preload`, `script-src 'unsafe-inline'`.

## 2. Qualité du contenu — 46/100

E-E-A-T 44 (Expérience 55, Expertise 58, Autorité 28, Confiance 38).
- **Critique :** faux avis (ci-dessus) ; titre « Guide de haute montagne » non étayé.
- **Élevé :** `/mentions-legales` inachevée : « [Nom Prénom] », hébergeur non renseigné (obligation légale LCEN), e-mail `contact@revesd'aventures.fr` invalide (apostrophe) ([app/mentions-legales/page.tsx:29](../app/mentions-legales/page.tsx#L29)).
- **Élevé :** pages d'activité minces : 14 pages entre 54 et 208 mots de contenu principal, sans prix, durée, âge, lieux, FAQ. Deux sont « explorées, non indexées ».
- **Élevé :** pas de page pour des requêtes déjà visibles : via ferrata par lieu (Les Orres, Serre-Ponçon), canyons nommés (La Blache, Rabou), team building / groupes, familles et ados, « que faire autour de Serre-Ponçon ».
- **Moyen :** contenus dupliqués ou erronés : `velo-de-route-et-escalade` et `velo-de-route-et-via-ferrata` identiques à 41 %, paragraphe windsurf égaré dans `kayak-et-escalade`, articles de blog génériques (environ 600 mots) qui contredisent les pages d'activité (âge minimum, chaussures), « encordée » erroné pour la via ferrata.
- **Moyen :** `/guide` (197 mots, diplômes seulement en badges), `/avis` (4 avis).

## 3. SEO on-page — 62/100
- **Élevé :** titres et descriptions d'activité générés par le même modèle (« Escalade | Rêves d'Aventures », « Découvrez l'activité X… »). À remplir dans Sanity (`seo.title` / `seo.description`), avec le lieu et l'intention.
- **Moyen :** H1 faibles : accueil = la marque seule, `/guide` = « Qui suis-je », `/blog` = « Le Blog », `/calendrier` = « Le Calendrier ». `/cgv` a **12 H1**.
- **Moyen :** descriptions courtes : `/avis` 74 car., `/acces` 93, `/mentions-legales` 98.
- **Moyen :** maillage : articles et activités ne se lient pas entre eux, activités duo orphelines, pas de fil d'Ariane.

## 4. Données structurées — 58/100
**Corrigé :** téléphone réel, Person du fondateur, AggregateRating sur `/avis` construit à partir des vrais avis Sanity.
- **Élevé :** aucune liaison par `@id` : le même commerce est décrit par 2 ou 3 entités sans lien (SportsActivityLocation, SportsOrganization, éditeur du blog). À fusionner dans un `@graph`.
- **Élevé :** pas de schéma propre aux pages d'activité (Service + Offer + BreadcrumbList, Event par séance) alors que la requête GROQ récupère déjà prix, dates et places.
- **Élevé :** notes « auto-attribuées » sur `/avis` (non éligibles aux étoiles), `ratingValue` en chaîne de caractères.
- **Moyen :**
  - `streetAddress: 'Lac de Serre-Ponçon'` n'est pas une adresse ;
  - `openingHours` de 8 h à 20 h tous les jours, probablement faux ;
  - `availableLanguage` inclut l'anglais ;
  - `/guide` et `/contact` émettent un bloc JSON-LD vide `[]` ;
  - le `SearchAction` pointe vers `/search` qui n'existe pas.
- **Info :** FAQPage n'apporte plus de résultat enrichi chez Google. Inoffensif, mais à ne pas multiplier.
Modèles JSON-LD prêts à l'emploi : [findings/schema.md](findings/schema.md).

## 5. Performance — 82/100
Pas de données terrain CrUX. Mesures en laboratoire (PSI) : mobile 83 à 93, desktop 95 à 100, CLS 0, TBT ≤ 100 ms.
- **Élevé :** LCP mobile de l'accueil 4,7 s : l'image du hero apparaît en fondu depuis `opacity:0` ([components/Hero.tsx:45-58](../components/Hero.tsx#L45-L58)). Afficher la 1ʳᵉ diapositive sans animation (environ 3,0 s attendus) et retirer `priority` sur le logo.
- **Élevé :** 2 CSS bloquants (environ 560 ms) : `experimental.inlineCss`.
- **Moyen :** AVIF non activé, `sizes` approximatifs sur les cartes (80 à 130 Ko gaspillés chacune), `minimumCacheTTL` absent, image du hero en PNG 1536 px. `/calendrier` LCP 4,0 s (JS).
- **Faible :** JS legacy et inutilisé (framer-motion `LazyMotion`, `browserslist`).

## 6. Images — 60/100
- **Élevé :** texte alternatif présent mais inutile : 30 « Mon Coach Plein Air » (ancienne marque : [Navbar.tsx:81](../components/Navbar.tsx#L81), [SiteFooter.tsx:55](../components/SiteFooter.tsx#L55)), 11 « Image » (images du corps Sanity sans champ alt ; `mainImage.alt` jamais récupéré).
- **Moyen :** `public/assets` pèse environ 120 Mo, dont un PNG de 30,5 Mo téléchargeable, des HEIC et des fichiers inutilisés.

## 7. Préparation à la recherche IA — 55/100
GEO 49, agentique 74 (Lighthouse Agentic Browsing 2/3).
- **Élevé :** titre de guide (ci-dessus), **incohérence d'identité** : les fiches office de tourisme / Apidae (serreponcon.com, savines-le-lac.fr, Geotrek CD05, provence-alpes-cotedazur.com…) indiquent **Savines-le-Lac 05160** et une adresse Gmail, alors que le site indique Embrun 05200 et que les mentions légales indiquent Saint-Apollinaire 05160.
- **Élevé :** pages d'activité incapables de répondre aux questions de base (prix, durée, âge, lieu), les pages les plus citables sont inconnues de Google.
- **Moyen :** `llms.txt` liste la page windsurf en 404 ; confusion de marque (Rêve de Cimes, Rêves de Rivières…) : ajouter `alternateName` et associer systématiquement la marque à « Frédéric Buet ».
- **Élevé (agents) :** bouton du menu mobile sans nom accessible ([Navbar.tsx:136](../components/Navbar.tsx#L136)), champs du formulaire de réservation sans label lié ([BookingForm.tsx:431-536](../components/BookingForm.tsx#L431)).

## 8. SEO local — 38/100 (hors score)
- **Critique :** aucune trace d'une fiche Google Business Profile depuis le site (ni lien, ni carte, ni lien d'avis Google). **À vérifier par toi : la fiche existe-t-elle ?** Sinon, la créer en zone de chalandise (adresse masquée).
- **Élevé :** NAP incohérent (voir ci-dessus), listes de zones desservies différentes entre `/contact` et le schéma, restes de placeholders (`hello@moncoach.com` dans le footer, e-mails envoyés sous le nom « Mon Coach Plein Air », [lib/mail.ts:16](../lib/mail.ts#L16)).
- **Élevé :** 4 avis seulement, aucun lien vers une plateforme d'avis tierce.

## 9. Expérience de recherche (SXO) — 41/100 (hors score)
Sur 13 requêtes cibles, 75 à 85 % des résultats sont des fiches d'offices de tourisme (alimentées par Apidae), des places de marché (Funbooker, Manawa, CheckYeti) ou des bases d'itinéraires. Rêves d'Aventures n'apparaît sur aucune. Deux leviers : (1) des pages d'activité au format attendu (« dès X € », durée, âge, lieu, photos, avis), (2) être présent **dans** ces fiches (Apidae via l'office de tourisme, places de marché). Persona le plus mal servi : groupes et team building (28/100).

## 10. Visuel / mobile — 66/100 (hors score)
- **Élevé :** la bannière cookies couvre **37 % de l'écran mobile** et masque le seul bouton « Réserver » de l'accueil ([components/CookieBanner.tsx:37-38](../components/CookieBanner.tsx#L37)).
- **Élevé :** aucun bouton « Réserver » visible sur mobile hors du hero de l'accueil (le bouton n'existe que sur desktop, [Navbar.tsx:130](../components/Navbar.tsx#L130)).
- **Moyen :** zones tactiles < 44 px (footer, calendrier avec libellés ARIA en anglais), un filtre qui déborde sur `/aventures/mono-activite`.

## 11. Backlinks — données insuffisantes
Absent du graphe Common Crawl de janvier-mars 2026 (site jeune et petit). Exporter GSC → Liens ou ajouter une clé Moz pour mesurer. Cibles prioritaires : offices de tourisme (Serre-Ponçon, Embrun, Les Orres, Savines), Hautes-Alpes Tourisme, hébergeurs partenaires, fédérations / syndicat des guides.

---
Plan d'action priorisé : [ACTION-PLAN.md](ACTION-PLAN.md) · Données structurées de l'audit : [audit-data.json](audit-data.json)
