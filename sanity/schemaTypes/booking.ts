import { defineField, defineType } from 'sanity'
import { StudioSmsInput } from '../components/StudioSmsInput'

export const booking = defineType({
    name: 'booking',
    title: 'Réservation (Booking)',
    type: 'document',
    fieldsets: [
        { name: 'customer', title: '👤 Client', options: { collapsible: true, collapsed: false } },
        { name: 'event', title: '📅 Séance & Activité', options: { collapsible: true, collapsed: false } },
        { name: 'participants', title: '👥 Participants', options: { collapsible: true, collapsed: false } },
        { name: 'payment', title: '💳 Paiement & Statut', options: { collapsible: true, collapsed: false } },
    ],
    fields: [
        defineField({
            name: 'customerName',
            title: 'Nom du client',
            type: 'string',
            readOnly: true,
            fieldset: 'customer',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            readOnly: true,
            fieldset: 'customer',
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
            description: 'Pour envoi SMS',
            readOnly: true,
            fieldset: 'customer',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'smsAction',
            title: 'Actions SMS',
            type: 'string',
            fieldset: 'customer',
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
            readOnly: true,
            fieldset: 'event'
        }),
        defineField({
            name: 'quantity',
            title: 'Nombre de personnes',
            type: 'number',
            readOnly: true,
            fieldset: 'participants'
        }),
        defineField({
            name: 'participantsNames',
            title: 'Noms des participants',
            type: 'string',
            readOnly: true,
            fieldset: 'participants'
        }),
        defineField({
            name: 'medicalInfo',
            title: 'Infos médicales / Location (Détail)',
            type: 'text',
            readOnly: true,
            fieldset: 'participants'
        }),
        defineField({
            name: 'height',
            title: 'Tailles',
            type: 'string',
            readOnly: true,
            fieldset: 'participants'
        }),
        defineField({
            name: 'weight',
            title: 'Poids',
            type: 'string',
            readOnly: true,
            fieldset: 'participants'
        }),
        defineField({
            name: 'status',
            title: 'Statut',
            type: 'string',
            fieldset: 'payment',
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
            name: 'price',
            title: 'Prix total',
            type: 'number',
            readOnly: true,
            fieldset: 'payment'
        }),
        defineField({
            name: 'stripeSessionId',
            title: 'ID Session Stripe',
            type: 'string',
            readOnly: true,
            fieldset: 'payment'
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
