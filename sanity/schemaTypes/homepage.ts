import { defineField, defineType } from 'sanity'

export const homepage = defineType({
    name: 'homepage',
    title: "Page d'accueil",
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro (Haut de page)' },
        { name: 'features', title: 'Philosophie & Points Forts' },
        { name: 'others', title: 'Autres (Offres, FAQ...)' },
        { name: 'seo', title: 'SEO & Méta-données' },
    ],
    fields: [
        // --- SEO ---
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }),
        // --- HERO ---
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal',
            type: 'string',
            group: 'hero',
            description: 'Le gros titre au centre (ex: Mon Coach Plein Air)',
            initialValue: 'Mon Coach Plein Air'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Slogan / Sous-titre',
            type: 'string',
            group: 'hero',
            description: "La phrase d'accroche (ex: Des expériences exclusives...)",
            initialValue: 'Des expériences exclusives, pensées pour vous.'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            group: 'hero',
            description: "Laissez vide pour garder le dégradé de couleurs par défaut.",
            options: { hotspot: true },
            fields: [{ name: 'alt', type: 'string', title: 'Texte alternatif' }]
        }),
        defineField({
            name: 'heroGallery',
            title: 'Galerie Hero (Carrousel)',
            type: 'array',
            group: 'hero',
            description: "Ajoutez plusieurs images pour créer un carrousel de fond (effet fondu). Si vide, l'image unique ci-dessus sera utilisée.",
            of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({
            name: 'ctaText',
            title: 'Texte du Bouton Principal',
            type: 'string',
            group: 'hero',
            initialValue: 'Réserver une sortie'
        }),
        defineField({
            name: 'ctaLink',
            title: 'Lien du Bouton',
            type: 'string',
            group: 'hero',
            initialValue: '/calendrier'
        }),

        // --- FEATURES (PHILOSOPHIE) ---
        defineField({
            name: 'featuresQuote',
            title: 'Citation Manifesto',
            type: 'text',
            rows: 3,
            group: 'features',
            description: "Le texte en italique (ex: 'Ici, je crée des sorties sportives...')",
            initialValue: "Ici, je crée des sorties sportives comme on façonne une pièce artisanale : avec précision, créativité, sensibilité — et un profond respect pour la nature."
        }),
        defineField({
            name: 'featuresIntro',
            title: 'Texte de Bienvenue',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'features',
            description: "Le texte d'introduction (Bienvenue à Rêves d'Aventures...)",
        }),
        // Feature 1: Duos
        defineField({
            name: 'featuresDuoTitle',
            title: 'Titre Bloc 1 (ex: Magie des Duos)',
            type: 'string',
            group: 'features',
            initialValue: 'La Magie des "Duos"'
        }),
        defineField({
            name: 'featuresDuoText',
            title: 'Texte Bloc 1',
            type: 'text',
            rows: 4,
            group: 'features',
            initialValue: "La combinaison des activités rend l’expérience extraordinaire. En prenant le temps de s’immerger dans un élément (Roche, Eau, Terre) ou en créant des complémentarités magiques, l’aventure prend tout son sens."
        }),
        defineField({
            name: 'featuresDuoSubtext',
            title: 'Sous-texte Bloc 1 (Petit gris)',
            type: 'text',
            rows: 2,
            group: 'features',
            initialValue: "Découvrez toutes les facettes des Hautes-Alpes : falaises, lacs, vallons sauvages, crêtes et cols mythiques."
        }),
        // Feature 2: Luxe
        defineField({
            name: 'featuresLuxeTitle',
            title: 'Titre Bloc 2 (ex: Luxe des Sensations)',
            type: 'string',
            group: 'features',
            initialValue: 'Le Luxe des Sensations Pures'
        }),
        defineField({
            name: 'featuresLuxeText',
            title: 'Texte Bloc 2',
            type: 'text',
            rows: 4,
            group: 'features',
            initialValue: "Pas de foule, pas de format standard. Juste vous, la nature, et un encadrement expert. Matériel haut de gamme, approche humaine et sécurisée. Le plaisir de se dépasser sans pression."
        }),
        // Feature 3: Eco (Intense & Responsable)
        defineField({
            name: 'featuresEcoTitle',
            title: 'Titre Bloc 3 (ex: Intense & Responsable)',
            type: 'string',
            group: 'features',
            initialValue: 'Intense & Responsable'
        }),
        defineField({
            name: 'featuresEcoText',
            title: 'Texte Bloc 3',
            type: 'text',
            rows: 4,
            group: 'features',
            initialValue: "Nos déplacements se font majoritairement à vélo ou à pied. Des activités locales pensées pour limiter l’impact écologique sans réduire l’intensité.\nMax de sensations, min d'empreinte."
        }),
        defineField({
            name: 'featuresCtaText',
            title: 'Texte Bouton Features',
            type: 'string',
            group: 'features',
            initialValue: 'Découvrir toutes les aventures'
        }),
        defineField({
            name: 'featuresCtaLink',
            title: 'Lien Bouton Features',
            type: 'string',
            group: 'features',
            initialValue: '/aventures'
        }),

        // --- OTHERS ---
        defineField({
            name: 'flexibleOffer1',
            title: 'Offre Flexible - Texte 1',
            type: 'string',
            group: 'others',
            initialValue: '3 Formules : Mono, Duos, Multi'
        }),
        defineField({
            name: 'flexibleOffer2',
            title: 'Offre Flexible - Texte 2',
            type: 'string',
            group: 'others',
            initialValue: '3 Niveaux : Découverte, Aventure, Warrior'
        }),
        defineField({
            name: 'flexibleOffer3',
            title: 'Offre Flexible - Texte 3',
            type: 'string',
            group: 'others',
            initialValue: '3 Durées : ½ journée, Journée, Semaine'
        }),

        defineField({
            name: 'activityTypes',
            title: 'Formules & Formats',
            type: 'array',
            group: 'others',
            of: [{ type: 'object', fields: [{ name: 'title', type: 'string' }] }]
        }),
        defineField({
            name: 'faq',
            title: 'Foire Aux Questions (FAQ)',
            type: 'array',
            group: 'others',
            of: [{ type: 'object', fields: [{ name: 'question', type: 'string' }, { name: 'answer', type: 'text' }] }]
        })
    ],
    preview: {
        prepare() {
            return {
                title: "Page d'accueil"
            }
        }
    }
})
