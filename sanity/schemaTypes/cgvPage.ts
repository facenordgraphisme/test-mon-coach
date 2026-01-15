import { defineField, defineType } from 'sanity'

export const cgvPage = defineType({
    name: 'cgvPage',
    title: 'Page Conditions Générales de Vente',
    type: 'document',
    groups: [
        { name: 'content', title: 'Contenu' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        }),
        defineField({
            name: 'title',
            title: 'Titre de la page',
            type: 'string',
            initialValue: 'Conditions Générales de Vente'
        }),
        defineField({
            name: 'content',
            title: 'Contenu',
            type: 'array',
            of: [{ type: 'block' }]
        })
    ]
})
