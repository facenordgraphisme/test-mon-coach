import { defineField, defineType } from 'sanity'

export const levelsPage = defineType({
    name: 'levelsPage',
    title: 'Page Niveaux',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre Principal',
            type: 'string',
            initialValue: '3 Niveaux d\'Engagement'
        }),
        defineField({
            name: 'subtitle',
            title: 'Description / Sous-titre',
            type: 'text',
            rows: 4,
            initialValue: 'Afin d’adapter au plus juste l\'engagement physique, technique et mental de la sortie, je vous propose trois niveaux basés sur l\'Effort, la Technique et l\'Engagement.'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de Fond',
            type: 'image',
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texte Alternatif'
                }
            ]
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        })
    ],
    groups: [
        { name: 'seo', title: 'SEO & Méta-données' }
    ],
    preview: {
        prepare() {
            return {
                title: 'Paramètres de la Page Niveaux'
            }
        }
    }
})
