import { defineField, defineType } from 'sanity'

export const bike = defineType({
    name: 'bike',
    title: 'Vélos (Matériel)',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom du modèle',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'priceHalfDay',
            title: 'Prix Demi-Journée (€)',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        }),
        defineField({
            name: 'priceFullDay',
            title: 'Prix Journée (€)',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2
        }),
        defineField({
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true
            }
        })
    ],
    preview: {
        select: {
            title: 'name',
            priceHalf: 'priceHalfDay',
            priceFull: 'priceFullDay',
            media: 'image'
        },
        prepare(selection) {
            const { title, priceHalf, priceFull, media } = selection
            return {
                title: title,
                subtitle: `1/2j: ${priceHalf}€ | Jour: ${priceFull}€`,
                media: media
            }
        }
    }
})
