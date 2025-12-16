import { defineField, defineType } from 'sanity'

export const guide = defineType({
    name: 'guide',
    title: 'Profil Guide',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'bio',
            title: 'Biographie',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'diplomas',
            title: 'Diplômes',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'image',
            title: 'Photo de profil',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'photos',
            title: 'Galerie Photos',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }]
        }),
    ],
})
