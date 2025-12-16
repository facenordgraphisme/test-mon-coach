import { defineField, defineType } from 'sanity'

export const formula = defineType({
    name: 'formula',
    title: 'Formule (Concept Page)',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre de la formule',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de couverture',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description / Concept',
            type: 'array',
            of: [{ type: 'block' }]
        }),
        defineField({
            name: 'benefits',
            title: 'Points clés (Liste à puces)',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'format',
            title: 'Format associé',
            description: 'Sert à filtrer les activités et le calendrier automatiquement.',
            type: 'string',
            options: {
                list: [
                    { title: 'Mono-activité', value: 'mono' },
                    { title: 'Duo-activités', value: 'duo' },
                    { title: 'Sur-mesure / Multi', value: 'multi' },
                ],
            }
        })
    ],
})
