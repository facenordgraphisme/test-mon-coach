
import { defineField, defineType } from 'sanity'

export const duoActivitesPage = defineType({
    name: 'duoActivitesPage',
    title: 'Page Duo-Activités',
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
            initialValue: 'Les Duos'
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
            initialValue: 'Les Duos'
        }),
        defineField({
            name: 'introDescription',
            title: 'Description Intro',
            type: 'array',
            of: [{ type: 'block' }],
            group: 'intro'
        }),
        defineField({
            name: 'quote',
            title: 'Citation',
            type: 'string',
            group: 'intro',
            initialValue: 'Le but c’est le chemin !'
        }),
        defineField({
            name: 'favorites',
            title: 'Liste "Mes combinaisons favorites"',
            type: 'array',
            group: 'intro',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'smartDuos',
            title: 'Liste "Les Duos Malins"',
            type: 'array',
            group: 'intro',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'smartDuosText',
            title: 'Texte explicatif "Duos Malins"',
            type: 'text',
            group: 'intro',
            rows: 3
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
                title: "Page Duo-Activités"
            }
        }
    }
})
