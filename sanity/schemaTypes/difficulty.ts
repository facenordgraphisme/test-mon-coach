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
            title: 'Description',
            type: 'text',
        })
    ]
})
