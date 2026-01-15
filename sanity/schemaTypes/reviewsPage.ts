import { defineField, defineType } from 'sanity'

export const reviewsPage = defineType({
    name: 'reviewsPage',
    title: 'Page Avis',
    type: 'document',
    groups: [
        { name: 'seo', title: 'SEO & Méta-données' },
        { name: 'content', title: 'Contenu' }
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Titre de la page',
            type: 'string',
            group: 'content',
            initialValue: 'Avis Clients'
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'text',
            group: 'content',
            initialValue: 'Découverte ce que nos aventuriers pensent de leurs expériences avec nous.'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image Hero',
            type: 'image',
            group: 'content',
            options: { hotspot: true }
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        })
    ]
})
