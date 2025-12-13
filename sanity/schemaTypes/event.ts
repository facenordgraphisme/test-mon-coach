import { defineField, defineType } from 'sanity'

export const event = defineType({
    name: 'event',
    title: 'Séance (Session)',
    type: 'document',
    fields: [
        defineField({
            name: 'activity',
            title: 'Activité',
            type: 'reference',
            to: [{ type: 'activity' }]
        }),
        defineField({
            name: 'date',
            title: 'Date et Heure',
            type: 'datetime',
        }),
        defineField({
            name: 'maxParticipants',
            title: 'Participants Max',
            type: 'number',
            initialValue: 5,
            validation: Rule => Rule.min(1).max(10)
        }),
        defineField({
            name: 'bookedCount',
            title: 'Déjà inscrits',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'status',
            title: 'Statut',
            type: 'string',
            options: {
                list: [
                    { title: 'Disponible', value: 'available' },
                    { title: 'Complet', value: 'full' },
                    { title: 'Annulé', value: 'cancelled' },
                ],
            },
            initialValue: 'available'
        })
    ],
    preview: {
        select: {
            title: 'activity.title',
            date: 'date',
            status: 'status'
        },
        prepare(selection) {
            const { title, date, status } = selection
            return {
                title: `${title} - ${date ? new Date(date).toLocaleDateString() : 'Pas de date'}`,
                subtitle: status
            }
        }
    }
})
