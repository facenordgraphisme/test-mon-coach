import { defineField, defineType } from 'sanity'

export const activity = defineType({
    name: 'activity',
    title: 'Activité',
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
            name: 'format',
            title: 'Format',
            type: 'string',
            options: {
                list: [
                    { title: 'Mono-activité', value: 'mono' },
                    { title: 'Duo-activités', value: 'duo' },
                    { title: 'Multi-activités / Weekend', value: 'multi' },
                ],
            }
        }),
        defineField({
            name: 'categories',
            title: 'Catégories',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }]
        }),
        defineField({
            name: 'difficulty',
            title: 'Niveau de difficulté',
            type: 'reference',
            to: { type: 'difficulty' },
        }),
        defineField({
            name: 'mainImage',
            title: 'Image principale',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texte alternatif',
                }
            ]
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }]
        }),
        defineField({
            name: 'price',
            title: 'Prix par personne',
            type: 'number',
        }),
        defineField({
            name: 'duration',
            title: 'Durée',
            type: 'string', // e.g. "1/2 Day", "Full Day", "2 Days"
        }),
        defineField({
            name: 'equipment',
            title: 'Matériel requis',
            type: 'array',
            of: [{ type: 'string' }]
        })
    ],
})
