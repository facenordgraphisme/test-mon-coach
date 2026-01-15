
import { defineField, defineType } from 'sanity'

export const calendarPage = defineType({
    name: 'calendarPage',
    title: 'Page Calendrier',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro (Haut de page)' },
        { name: 'seo', title: 'SEO / Métadonnées' },
    ],
    fields: [
        // --- HERO ---
        defineField({
            name: 'heroTitle',
            title: 'Titre Héro',
            type: 'string',
            group: 'hero',
            initialValue: 'Le Calendrier'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre Héro',
            type: 'text',
            rows: 2,
            group: 'hero',
            initialValue: 'Retrouvez toutes les prochaines dates confirmées. Premier arrivé, premier servi ! (Max 5 pers.)'
        }),
        defineField({
            name: 'heroLabel',
            title: 'Label Héro (Petit texte au dessus du titre)',
            type: 'string',
            group: 'hero',
            initialValue: 'PLANNING'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            options: { hotspot: true },
            group: 'hero'
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
                title: "Page Calendrier"
            }
        }
    }
})
