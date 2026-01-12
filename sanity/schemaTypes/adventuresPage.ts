import { defineField, defineType } from 'sanity'

export const adventuresPage = defineType({
    name: 'adventuresPage',
    title: 'Page Aventures',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro (Haut de page)' },
        { name: 'mono', title: 'Mono-Activité' },
        { name: 'duo', title: 'Duo-Activités' },
        { name: 'multi', title: 'Multi & Sur-mesure' },
        { name: 'pageMono', title: 'Page Détail: Mono-Activité' },
        { name: 'pageDuo', title: 'Page Détail: Duo-Activités' },
        { name: 'pageMulti', title: 'Page Détail: Sur-mesure / Multi' },
        { name: 'seo', title: 'SEO / Métadonnées' },
    ],
    fields: [
        // --- HERO ---
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal',
            type: 'string',
            group: 'hero',
            initialValue: 'Nos Aventures'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre / Accroche',
            type: 'text',
            rows: 3,
            group: 'hero',
            initialValue: 'Mono, Duo ou Multi. Choisissez l\'intensité, l\'élément et le format qui vous correspond pour vivre les Hautes-Alpes intensément.'
        }),
        defineField({
            name: 'heroLabel',
            title: 'Petit Label',
            type: 'string',
            group: 'hero',
            initialValue: 'EXPLOREZ'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            options: { hotspot: true },
            group: 'hero'
        }),

        // --- MONO ---
        defineField({
            name: 'monoTitle',
            title: 'Titre (Mono)',
            type: 'string',
            group: 'mono',
            initialValue: 'Le Mono-Activité'
        }),
        defineField({
            name: 'monoDescription',
            title: 'Description (Mono)',
            type: 'text',
            rows: 4,
            group: 'mono',
            initialValue: 'Découvrir, vous perfectionner ou juste profiter d’un moment autour d’une activité, d’un élément. Pour une expérience unique, concentrée.'
        }),
        defineField({
            name: 'monoButtonText',
            title: 'Texte Bouton (Mono)',
            type: 'string',
            group: 'mono',
            initialValue: 'Voir les Mono-Activités'
        }),
        defineField({
            name: 'monoFeatures',
            title: 'Blocs Eléments (Roche, Eau, Terre)',
            type: 'array',
            group: 'mono',
            description: 'Les 3 cartes qui présentent les éléments',
            of: [{
                type: 'object',
                name: 'featureBlock',
                fields: [
                    { name: 'title', title: 'Titre (ex: Roche)', type: 'string' },
                    { name: 'items', title: 'Liste activités', type: 'array', of: [{ type: 'string' }] },
                    {
                        name: 'icon',
                        title: 'Icône',
                        type: 'string',
                        options: {
                            list: [
                                { title: 'Montagne (Roche)', value: 'mountain' },
                                { title: 'Vague (Eau)', value: 'waves' },
                                { title: 'Vélo (Terre)', value: 'bike' }
                            ]
                        }
                    }
                ]
            }]
        }),

        // --- DUO ---
        defineField({
            name: 'duoTitle',
            title: 'Titre (Duo)',
            type: 'string',
            group: 'duo',
            initialValue: 'Les Duos'
        }),
        defineField({
            name: 'duoDescription',
            title: 'Description (Duo)',
            type: 'text',
            rows: 4,
            group: 'duo'
        }),
        defineField({
            name: 'duoQuote',
            title: 'Citation',
            type: 'string',
            group: 'duo',
            initialValue: 'Le but c’est le chemin !'
        }),
        defineField({
            name: 'duoButtonText',
            title: 'Texte Bouton (Duo)',
            type: 'string',
            group: 'duo',
            initialValue: 'Tout savoir sur les Duos'
        }),
        defineField({
            name: 'duoFavorites',
            title: 'Liste "Mes combinaisons favorites"',
            type: 'array',
            group: 'duo',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'duoMalins',
            title: 'Liste "Les Duos Malins"',
            type: 'array',
            group: 'duo',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'duoMalinsText',
            title: 'Texte explicatif "Duos Malins"',
            type: 'text',
            group: 'duo',
            rows: 3
        }),

        // --- MULTI ---
        defineField({
            name: 'multiTitle',
            title: 'Titre (Multi)',
            type: 'string',
            group: 'multi',
            initialValue: 'Aventures Multi & Week-end'
        }),
        defineField({
            name: 'multiDescription',
            title: 'Description (Multi)',
            type: 'text',
            rows: 4,
            group: 'multi'
        }),
        defineField({
            name: 'multiButtonText',
            title: 'Texte Bouton (Multi)',
            type: 'string',
            group: 'multi',
            initialValue: 'Créer mon séjour sur-mesure'
        }),



        // --- PAGE DÉTAIL: MONO-ACTIVITÉ (/aventures/mono-activite) ---
        defineField({
            name: 'pageMonoHeroTitle',
            title: 'Titre Héro (Page Mono)',
            type: 'string',
            group: 'pageMono',
            description: "Remplace le titre automatique de la formule"
        }),
        defineField({
            name: 'pageMonoHeroSubtitle',
            title: 'Sous-titre Héro (Page Mono)',
            type: 'text',
            rows: 2,
            group: 'pageMono'
        }),
        defineField({
            name: 'pageMonoHeroImage',
            title: 'Image Héro (Page Mono)',
            type: 'image',
            options: { hotspot: true },
            group: 'pageMono'
        }),
        defineField({
            name: 'pageMonoDescription',
            title: 'Description Principale (Page Mono)',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'pageMono'
        }),
        defineField({
            name: 'pageMonoBenefits',
            title: 'Points Clés / Avantages (Page Mono)',
            type: 'array',
            of: [{ type: 'string' }],
            group: 'pageMono'
        }),
        defineField({
            name: 'pageMonoSeoTitle',
            title: 'Titre SEO (Page Mono)',
            type: 'string',
            group: 'pageMono'
        }),
        defineField({
            name: 'pageMonoSeoDescription',
            title: 'Description SEO (Page Mono)',
            type: 'text',
            rows: 3,
            group: 'pageMono'
        }),



        // --- PAGE DÉTAIL: DUO-ACTIVITÉS (/aventures/duo-activites) ---
        defineField({
            name: 'pageDuoHeroTitle',
            title: 'Titre Héro (Page Duo)',
            type: 'string',
            group: 'pageDuo',
            description: "Remplace le titre automatique de la formule"
        }),
        defineField({
            name: 'pageDuoHeroSubtitle',
            title: 'Sous-titre Héro (Page Duo)',
            type: 'text',
            rows: 2,
            group: 'pageDuo'
        }),
        defineField({
            name: 'pageDuoHeroImage',
            title: 'Image Héro (Page Duo)',
            type: 'image',
            options: { hotspot: true },
            group: 'pageDuo'
        }),
        defineField({
            name: 'pageDuoDescription',
            title: 'Description Principale (Page Duo)',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'pageDuo'
        }),
        defineField({
            name: 'pageDuoBenefits',
            title: 'Points Clés / Avantages (Page Duo)',
            type: 'array',
            of: [{ type: 'string' }],
            group: 'pageDuo'
        }),
        defineField({
            name: 'pageDuoSeoTitle',
            title: 'Titre SEO (Page Duo)',
            type: 'string',
            group: 'pageDuo'
        }),
        defineField({
            name: 'pageDuoSeoDescription',
            title: 'Description SEO (Page Duo)',
            type: 'text',
            rows: 3,
            group: 'pageDuo'
        }),



        // --- PAGE DÉTAIL: SUR-MESURE (/aventures/sur-mesure) ---
        defineField({
            name: 'pageMultiHeroTitle',
            title: 'Titre Héro (Page Multi)',
            type: 'string',
            group: 'pageMulti',
            description: "Remplace le titre automatique de la formule"
        }),
        defineField({
            name: 'pageMultiHeroSubtitle',
            title: 'Sous-titre Héro (Page Multi)',
            type: 'text',
            rows: 2,
            group: 'pageMulti'
        }),
        defineField({
            name: 'pageMultiHeroImage',
            title: 'Image Héro (Page Multi)',
            type: 'image',
            options: { hotspot: true },
            group: 'pageMulti'
        }),
        defineField({
            name: 'pageMultiDescription',
            title: 'Description Principale (Page Multi)',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'pageMulti'
        }),
        // Pas de benefits pour le format multi, c'est du sur-mesure. On peut en ajouter si le user le demande mais le layout multi est différent.
        // On met tout de même le SEO
        defineField({
            name: 'pageMultiSeoTitle',
            title: 'Titre SEO (Page Multi)',
            type: 'string',
            group: 'pageMulti'
        }),
        defineField({
            name: 'pageMultiSeoDescription',
            title: 'Description SEO (Page Multi)',
            type: 'text',
            rows: 3,
            group: 'pageMulti'
        }),

        // --- SEO ---
        defineField({
            name: 'seoTitle',
            title: 'Titre SEO',
            type: 'string',
            group: 'seo'
        }),
        defineField({
            name: 'seoDescription',
            title: 'Description SEO',
            type: 'text',
            rows: 3,
            group: 'seo'
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Page Aventures (Contenus)"
            }
        }
    }
})
