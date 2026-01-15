
import { defineField, defineType } from 'sanity'

export const monoActivitePage = defineType({
    name: 'monoActivitePage',
    title: 'Page Mono-Activité',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro (Haut de page)' },
        { name: 'intro', title: 'Intro (Ancien Bloc)' },
        { name: 'content', title: 'Contenu Principal' },
        { name: 'seo', title: 'SEO / Métadonnées' },
    ],
    fields: [
        // --- HERO ---
        defineField({
            name: 'heroTitle',
            title: 'Titre Héro',
            type: 'string',
            group: 'hero',
            initialValue: 'Le Mono-Activité'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre Héro',
            type: 'text',
            rows: 2,
            group: 'hero'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            options: { hotspot: true },
            group: 'hero'
        }),

        // --- INTRO (Migrated from old /aventures) ---
        defineField({
            name: 'introTitle',
            title: 'Titre Intro',
            type: 'string',
            group: 'intro',
            initialValue: 'Le Mono-Activité'
        }),
        defineField({
            name: 'introDescription',
            title: 'Description Intro',
            type: 'text',
            rows: 4,
            group: 'intro',
            initialValue: 'Découvrir, vous perfectionner ou juste profiter d’un moment autour d’une activité, d’un élément. Pour une expérience unique, concentrée.'
        }),
        defineField({
            name: 'introFeatures',
            title: 'Blocs Eléments (Roche, Eau, Terre)',
            type: 'array',
            group: 'intro',
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

        // --- CONTENT ---
        defineField({
            name: 'description',
            title: 'Description Principale (Bas de page)',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'content'
        }),
        defineField({
            name: 'benefits',
            title: 'Points Clés / Avantages',
            type: 'array',
            of: [{ type: 'string' }],
            group: 'content'
        }),

        // --- SEO ---
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Page Mono-Activité"
            }
        }
    }
})
