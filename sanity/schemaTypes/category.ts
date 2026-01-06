import { defineField, defineType } from 'sanity'

export const category = defineType({
    name: 'category',
    title: 'Catégorie',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'element',
            title: 'Élément',
            type: 'string',
            options: {
                list: [
                    { title: 'Eau', value: 'eau' },
                    { title: 'Terre', value: 'terre' },
                    { title: 'Roche', value: 'roche' },
                    { title: 'Neutre', value: 'neutre' },
                ],
                layout: 'radio'
            },
            initialValue: 'neutre'
        }),
    ],
})
