import { defineField, defineType } from 'sanity'

export const cgvPage = defineType({
    name: 'cgvPage',
    title: 'Page Conditions Générales de Vente',
    type: 'document',
    fields: [
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
