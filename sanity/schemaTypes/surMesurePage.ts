
import { defineField, defineType } from 'sanity'

export const surMesurePage = defineType({
    name: 'surMesurePage',
    title: 'Page Sur-Mesure / Multi',
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
            initialValue: 'Sur-Mesure'
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

        // --- INTRO (Migrated) ---
        defineField({
            name: 'introTitle',
            title: 'Titre Intro',
            type: 'string',
            group: 'intro',
            initialValue: 'Aventures Multi & Week-end'
        }),
        defineField({
            name: 'introDescription',
            title: 'Description Intro',
            type: 'text',
            rows: 4,
            group: 'intro'
        }),

        // --- CONTENT ---
        defineField({
            name: 'description',
            title: 'Description Principale',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'content'
        }),
        defineField({
            name: 'benefits',
            title: 'Points Forts / Avantages',
            description: 'Petits points clés (ex: "Accompagnement personnalisé"). Apparaissent "Pourquoi choisir cette formule ?".',
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
                title: "Page Sur-Mesure"
            }
        }
    }
})
