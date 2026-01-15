import { defineField, defineType } from 'sanity'

export const accessPage = defineType({
    name: 'accessPage',
    title: 'Page Accès & Hébergement',
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
            title: 'Titre',
            type: 'string',
            initialValue: 'Accès & Hébergement'
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
            name: 'intro',
            title: 'Introduction',
            type: 'array',
            of: [{ type: 'block' }]
        }),
        defineField({
            name: 'accessMethods',
            title: 'Moyens d\'accès',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', type: 'string', title: 'Titre (ex: Train)' },
                    {
                        name: 'description',
                        title: 'Description',
                        type: 'array',
                        of: [{ type: 'block' }]
                    },
                    { name: 'icon', type: 'string', title: 'Nom de l\'icône Lucide (ex: Train, Car, Plane)' }
                ]
            }]
        }),
        defineField({
            name: 'accommodations',
            title: 'Hébergements Partenaires',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', type: 'string', title: 'Nom' },
                    { name: 'description', type: 'text', title: 'Description' },
                    { name: 'link', type: 'url', title: 'Lien Web' },
                    { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }
                ]
            }]
        })
    ]
})
