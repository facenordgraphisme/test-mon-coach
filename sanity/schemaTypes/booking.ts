import { defineField, defineType } from 'sanity'
import { StudioSmsInput } from '../components/StudioSmsInput'

export const booking = defineType({
    name: 'booking',
    title: 'Réservation (Booking)',
    type: 'document',
    fields: [
        defineField({
            name: 'customerName',
            title: 'Nom du client',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
            description: 'Pour envoi SMS',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'smsAction',
            title: 'Actions',
            type: 'string',
            components: {
                // @ts-ignore
                input: StudioSmsInput
            }
        }),
        defineField({
            name: 'event',
            title: 'Séance réservée',
            type: 'reference',
            to: [{ type: 'event' }]
        }),
        defineField({
            name: 'quantity',
            title: 'Nombre de personnes',
            type: 'number',
        }),
        defineField({
            name: 'price',
            title: 'Prix total',
            type: 'number',
        }),
        defineField({
            name: 'status',
            title: 'Statut',
            type: 'string',
            options: {
                list: [
                    { title: 'En attente paiement', value: 'pending' },
                    { title: 'Confirmé', value: 'confirmed' },
                    { title: 'Annulé', value: 'cancelled' }
                ]
            },
            initialValue: 'pending'
        }),
        defineField({
            name: 'stripeSessionId',
            title: 'ID Session Stripe',
            type: 'string',
        }),
        defineField({
            name: 'createdAt',
            title: 'Créé le',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        })
    ],
    preview: {
        select: {
            title: 'customerName',
            subtitle: 'event.activity.title',
            status: 'status',
            date: 'event.date'
        },
        prepare(selection) {
            const { title, subtitle, status, date } = selection
            const dateStr = date ? new Date(date).toLocaleDateString() : ''
            const statusEmoji = status === 'confirmed' ? '✅' : status === 'pending' ? '⏳' : '❌'
            return {
                title: `${statusEmoji} ${title} (${dateStr})`,
                subtitle: subtitle
            }
        }
    }
})
