# Plan d'action SEO — Rêves d'Aventures (2026-11-06)

Score actuel : **60/100** (juin : 44). Objectif réaliste après les phases 1 et 2 : environ 75.
Chaque action est marquée selon qui peut la faire :
- **[Code]** : modification du dépôt, faisable tout de suite ;
- **[Sanity]** : contenu à saisir dans le Studio ;
- **[Client]** : information ou validation de Frédéric ;
- **[Externe]** : Vercel, GSC, Google Business Profile, office de tourisme.

---

## Phase 1 — Corrections critiques (semaine 1)

| # | Action | Qui | Fichiers | Effort |
|---|---|---|---|---|
| 1.1 | Supprimer les faux avis de secours et rendre les vrais avis **côté serveur** (composant serveur ou données passées en props) | Code | [components/ReviewSection.tsx:29-52](../components/ReviewSection.tsx#L29-L52), [app/page.tsx](../app/page.tsx) | 30 min |
| 1.2 | Corriger le titre « Guide de haute montagne », ou l'étayer si Frédéric a bien ce diplôme ; ajouter `hasCredential` pour chaque diplôme dans le schéma | Client → Code | [lib/seo.ts:46-47,96](../lib/seo.ts#L46), [app/layout.tsx:26-33](../app/layout.tsx#L26), [app/blog/page.tsx:29](../app/blog/page.tsx#L29), [app/blog/[slug]/page.tsx:61](../app/blog/[slug]/page.tsx#L61), `public/llms.txt` | 30 min |
| 1.3 | Rendre le catalogue d'activités **côté serveur** : liste rendue dans le HTML, filtre initial lu sans `useSearchParams` au rendu (ou filtres en liens `?format=`) | Code | [components/ActivityFilterableList.tsx](../components/ActivityFilterableList.tsx), pages mono, duo et multi | 1-2 h |
| 1.4 | `noindex, follow` + vrai titre sur `/booking/[id]` et `/success` ; `notFound()` pour les séances passées ou inexistantes | Code | [app/booking/[id]/page.tsx](../app/booking/[id]/page.tsx), [app/success/page.tsx](../app/success/page.tsx) | 20 min |
| 1.5 | 301 `/aventures/planche-a-voile-windsurf` et `/aventures/vtt` vers la page active (ou recréer la page windsurf : à décider), mettre à jour `llms.txt` | Code (+ Client) | [next.config.ts](../next.config.ts), `public/llms.txt` | 15 min |
| 1.6 | Sitemap : `defined(slug.current)`, `lastModified` réel (`_updatedAt`), suppression de changefreq et priority, `revalidate` pour intégrer les nouveaux contenus | Code | [app/sitemap.ts](../app/sitemap.ts) | 20 min |
| 1.7 | Mentions légales : nom du responsable de publication, hébergeur (Vercel Inc.), e-mail valide | Client → Code | [app/mentions-legales/page.tsx:29](../app/mentions-legales/page.tsx#L29) | 15 min |
| 1.8 | Vercel → Domains : `revesdaventures.fr` → « Redirect to www » en **308 Permanent** (un seul saut) | Externe (toi) | — | 5 min |
| 1.9 | GSC : demander l'indexation de `/aventures/canyoning`, `/aventures/escalade`, `/blog` et des 2 articles après le déploiement de 1.3 ; resoumettre le sitemap | Externe (toi) | — | 10 min |

## Phase 2 — Améliorations à fort impact (semaines 2-3)

| # | Action | Qui | Effort |
|---|---|---|---|
| 2.1 | Bandeau « Infos clés » sur chaque page d'activité : dès X €, durée, âge minimum, niveau, lieu de rendez-vous, encadrement diplômé, toujours affiché même sans séance. Ajouter les champs `priceFrom`, `minAge`, `meetingPoint` au schéma Sanity si absents | Code + Sanity | 2-3 h code |
| 2.2 | Titres et descriptions SEO uniques par activité, avec le lieu (« Via ferrata à Serre-Ponçon et aux Orres avec un moniteur diplômé ») | Sanity (je peux rédiger les propositions) | 1-2 h |
| 2.3 | Schéma : `@graph` unique (entreprise, Person, WebSite avec `@id`), Service + Offer + BreadcrumbList sur les activités, Event par séance, Person + `hasCredential` sur `/guide` ; suppression du SearchAction, des blocs `[]` vides, de l'adresse factice, des horaires et de l'anglais | Code | 2-3 h |
| 2.4 | Identité (NAP) : choisir **une** base (Savines-le-Lac ? Embrun ?), une adresse e-mail et une liste de zones desservies, puis les aligner sur le site, le schéma, la fiche Google Business Profile et Apidae | Client → Code + Externe | 1 h + e-mail à l'office de tourisme |
| 2.5 | Google Business Profile : vérifier, créer ou revendiquer (zone de chalandise), ajouter le lien dans `sameAs` et un bouton « Laisser un avis Google » sur `/avis` | Externe + Code | 1 h |
| 2.6 | Mobile : bannière cookies compacte (environ 120 px, boutons côte à côte, « Refuser » aussi visible qu'« Accepter ») et bouton « Réserver » visible sur mobile (pilule dans l'en-tête ou barre fixe en bas) | Code | 1-2 h |
| 2.7 | LCP de l'accueil : 1ʳᵉ diapositive du hero sans fondu, retirer `priority` du logo, `experimental.inlineCss`, `images.formats` AVIF + WebP, `minimumCacheTTL` | Code | 1 h |
| 2.8 | On-page : H1 descriptifs (accueil, `/guide`, `/blog`, `/calendrier`), 12 H1 → H2 sur `/cgv`, descriptions trop courtes (`/avis`, `/acces`, `/mentions-legales`) | Code | 45 min |
| 2.9 | Maillage : liens articles ↔ activités, liens vers les activités duo, fil d'Ariane visible + BreadcrumbList | Code | 1-2 h |
| 2.10 | Accessibilité et agents : `aria-label` / `aria-expanded` sur le bouton du menu, labels `htmlFor` / `id` / `autocomplete` dans le formulaire de réservation, libellés FR du calendrier, zones tactiles ≥ 44 px | Code | 1 h |
| 2.11 | Alt : remplacer « Mon Coach Plein Air » par la bonne marque, récupérer `mainImage.alt`, ajouter un champ alt aux images du corps Sanity ; renommer l'expéditeur des e-mails ([lib/mail.ts:16](../lib/mail.ts#L16)) et retirer `hello@moncoach.com` | Code | 45 min |

## Phase 3 — Contenu et autorité (mois 2)

| # | Action | Qui |
|---|---|---|
| 3.1 | Enrichir les 14 pages d'activité (300 à 500 mots uniques chacune) : déroulé, lieux nommés (via ferrata des Orres, de Cascade, de Marcellinas ; canyons de la Blache, Rabou…), matériel, sécurité, FAQ, avis liés. Corriger les doublons (vélo + escalade / vélo + via ferrata) et le paragraphe windsurf dans kayak + escalade | Client (infos) + rédaction |
| 3.2 | Nouvelles pages ou articles, par ordre de priorité : via ferrata autour de Serre-Ponçon et des Orres ; canyoning près d'Embrun ; groupes et team building ; « que faire à Serre-Ponçon / Les Orres » ; familles et ados ; windsurf et voile à Serre-Ponçon ; cols à vélo ; « tout à vélo » + accès en train | Rédaction + Client |
| 3.3 | Retravailler les 2 articles (cohérence avec les pages d'activité, retirer « encordée » pour la via ferrata, ajouter l'expérience vécue du guide) | Rédaction + Client |
| 3.4 | `/guide` enrichi (parcours, diplômes en texte, assurance RC Pro MAIF, photos terrain) ; diplômes et assurance visibles sur l'accueil et les activités | Client + Code |
| 3.5 | Présence dans les fiches qui occupent la première page de Google : mise à jour de la fiche Apidae via l'office de tourisme de Serre-Ponçon (lien vers le site), offices d'Embrun et des Orres, éventuellement places de marché (Funbooker, Manawa, CheckYeti) | Externe |
| 3.6 | Liens locaux : hébergeurs partenaires (pages « activités à proximité »), Hautes-Alpes Tourisme, fédérations, presse locale | Externe |
| 3.7 | Collecte d'avis Google après chaque sortie (lien direct dans l'e-mail de confirmation) | Code + Client |
| 3.8 | Nettoyage de `public/assets` (environ 120 Mo dont un PNG de 30 Mo, des HEIC), suppression de `app/activities/` (code mort) | Code |

## Phase 4 — Suivi (continu)
- Search Console mensuelle : couverture (pages découvertes / indexées), requêtes via ferrata / canyoning / team building, CTR des pages d'activité.
- Configurer l'ID de propriété GA4 dans `~/.config/claude-seo/google-api.json` pour les prochains audits ; ajouter une propriété GSC « Domaine ».
- Configurer le webhook Sanity → `/api/revalidate` (sinon délai de mise à jour de 1 h).
- Nouvel audit au printemps 2027, avant la saison.

---

## Questions pour le client (à poser avant la phase 1)
1. Frédéric est-il **guide de haute montagne** (diplôme d'État) ? Sinon, quel intitulé utiliser (« moniteur d'escalade et de canyoning diplômé d'État » ?).
2. Quelle **base officielle** : Savines-le-Lac, Embrun, Saint-Apollinaire ? Quelle adresse e-mail publique ?
3. Une **fiche Google Business Profile** existe-t-elle ? Qui y a accès ?
4. L'activité **windsurf / planche à voile seule** existe-t-elle encore ? Si oui, on recrée la page ; sinon, redirection vers VTT + planche à voile.
5. Prix « à partir de », durées et âges minimums par activité (pour le bandeau d'infos clés).
6. Responsable de publication à indiquer dans les mentions légales.
