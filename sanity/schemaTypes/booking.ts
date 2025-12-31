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
            readOnly: true,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
            description: 'Pour envoi SMS',
            readOnly: true,
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
            to: [{ type: 'event' }],
            readOnly: true
        }),
        defineField({
            name: 'quantity',
            title: 'Nombre de personnes',
            type: 'number',
            readOnly: true
        }),
        defineField({
            name: 'medicalInfo',
            title: 'Infos médicales / Location (Détail)',
            type: 'text',
            readOnly: true
        }),
        defineField({
            name: 'height',
            title: 'Tailles',
            type: 'string',
            readOnly: true
        }),
        defineField({
            name: 'weight',
            title: 'Poids',
            type: 'string',
            readOnly: true
        }),
        defineField({
            name: 'price',
            title: 'Prix total',
            type: 'number',
            readOnly: true
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
            readOnly: true
        }),
        defineField({
            name: 'createdAt',
            title: 'Créé le',
            type: 'datetime',
            readOnly: true,
            initialValue: () => new Date().toISOString()
        })
    ],
    orderings: [
        {
            title: 'Date de création (Nouveau > Ancien)',
            name: 'createdAtDesc',
            by: [
                { field: 'createdAt', direction: 'desc' }
            ]
        },
        {
            title: 'Date de création (Ancien > Nouveau)',
            name: 'createdAtAsc',
            by: [
                { field: 'createdAt', direction: 'asc' }
            ]
        },
        {
            title: 'Nom du client (A-Z)',
            name: 'customerNameAsc',
            by: [
                { field: 'customerName', direction: 'asc' }
            ]
        },
        {
            title: 'Statut',
            name: 'status',
            by: [
                { field: 'status', direction: 'asc' }
            ]
        }
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
