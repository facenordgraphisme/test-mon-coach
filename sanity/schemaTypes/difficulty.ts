import { defineField, defineType } from 'sanity'

export const difficulty = defineType({
    name: 'difficulty',
    title: 'Niveau de difficulté',
    type: 'document',
    fields: [
        defineField({
            name: 'level',
            title: 'Niveau (Numéro)',
            type: 'number',
            description: '1, 2, ou 3',
            validation: Rule => Rule.required().min(1).max(3)
        }),
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string', // e.g. "Decouverte"
        }),
        defineField({
            name: 'color',
            title: 'Couleur du badge',
            type: 'string',
            options: {
                list: [
                    { title: 'Vert', value: 'green' },
                    { title: 'Orange', value: 'orange' },
                    { title: 'Rouge', value: 'red' },
                ]
            }
        }),
        defineField({
            name: 'description',
            title: 'Description (Courte - Page d\'accueil)',
            type: 'text',
        }),
        defineField({
            name: 'fullDescription',
            title: 'Description Complète (Page dédiée)',
            type: 'text',
        }),
        defineField({
            name: 'prerequisites',
            title: 'Pré-requis',
            type: 'string',
        }),
        defineField({
            name: 'effort',
            title: 'Effort',
            type: 'string',
        }),
        defineField({
            name: 'technique',
            title: 'Technique',
            type: 'string',
        }),
        defineField({
            name: 'engagement',
            title: 'Engagement',
            type: 'string',
        }),
        defineField({
            name: 'goal',
            title: 'Objectif (Phrase de fin)',
            type: 'string',
        })
    ]
})
