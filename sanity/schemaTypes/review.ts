import { defineField, defineType } from 'sanity'

export const review = defineType({
    name: 'review',
    title: 'Avis Clients',
    type: 'document',
    fields: [
        defineField({
            name: 'author',
            title: 'Auteur',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'rating',
            title: 'Note (1-5)',
            type: 'number',
            validation: Rule => Rule.required().min(1).max(5),
            initialValue: 5
        }),
        defineField({
            name: 'text',
            title: 'Commentaire',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM-DD'
            },
            initialValue: () => new Date().toISOString().split('T')[0]
        }),
        defineField({
            name: 'source',
            title: 'Source',
            type: 'string',
            options: {
                list: [
                    { title: 'Google', value: 'google' },
                    { title: 'Direct', value: 'direct' },
                    { title: 'Autre', value: 'other' }
                ],
                layout: 'radio'
            },
            initialValue: 'google'
        })
    ],
    preview: {
        select: {
            title: 'author',
            subtitle: 'text',
            rating: 'rating'
        },
        prepare({ title, subtitle, rating }) {
            return {
                title: `${title} (${rating}/5)`,
                subtitle: subtitle
            }
        }
    }
})
