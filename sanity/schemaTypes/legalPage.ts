import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
    name: 'legalPage',
    title: 'Page Mentions Légales',
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
            initialValue: 'Mentions Légales'
        }),
        defineField({
            name: 'content',
            title: 'Contenu',
            type: 'array',
            of: [{ type: 'block' }]
        })
    ]
})
