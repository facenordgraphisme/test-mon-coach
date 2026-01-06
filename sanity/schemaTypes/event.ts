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
            name: 'title',
            title: 'Titre de la sortie (optionnel)',
            type: 'string',
            description: 'Ex: "Visite du Queyras". Si vide, seul le nom de l\'activité sera affiché.',
        }),
        defineField({
            name: 'image',
            title: 'Image spécifique (optionnel)',
            type: 'image',
            options: { hotspot: true },
            description: "Si renseignée, remplace l'image par défaut de l'activité sur la page de réservation.",
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texte alternatif',
                }
            ]
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
            name: 'seatsAvailable',
            title: 'Places restantes',
            type: 'number',
            description: 'Nombre de places disponibles pour cette session',
            validation: Rule => Rule.min(0)
        }),
        defineField({
            name: 'price',
            title: 'Prix par personne (€)',
            type: 'number',
            description: 'Prix pour cette séance spécifique. Remplace le prix par défaut de l\'activité.',
            validation: Rule => Rule.required().min(0)
        }),
        defineField({
            name: 'privatizationPrice',
            title: 'Prix de privatisation (€)',
            type: 'number',
            description: 'Si renseigné, une option de privatisation sera proposée (uniquement si aucune place n\'est encore réservée).',
            validation: Rule => Rule.min(0)
        }),
        defineField({
            name: 'discounts',
            title: 'Tarifs dégressifs',
            type: 'array',
            description: 'Définir des réductions basées sur le nombre de participants (ex: -10% pour 2 pers). S\'ils ne sont pas privatisés.',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'minParticipants',
                        title: 'Participants minimum',
                        type: 'number',
                        validation: Rule => Rule.required().min(1)
                    },
                    {
                        name: 'discountPercentage',
                        title: 'Réduction (%)',
                        type: 'number',
                        validation: Rule => Rule.required().min(0).max(100)
                    }
                ],
                preview: {
                    select: {
                        min: 'minParticipants',
                        percent: 'discountPercentage'
                    },
                    prepare({ min, percent }) {
                        return { title: `-${percent}% dès ${min} personne(s)` }
                    }
                }
            }]
        }),
        defineField({
            name: 'duration',
            title: 'Durée de la séance',
            type: 'string',
            options: {
                list: [
                    { title: 'Demi-journée', value: 'half_day' },
                    { title: 'Journée complète', value: 'full_day' },
                ],
                layout: 'radio'
            },
            initialValue: 'half_day',
            validation: Rule => Rule.required()
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
        }),
        defineField({
            name: 'description',
            title: 'Description de la séance',
            type: 'blockContent',
        }),
        defineField({
            name: 'difficulty',
            title: 'Niveau de difficulté',
            type: 'reference',
            to: { type: 'difficulty' },
        }),
        defineField({
            name: 'equipment',
            title: 'Matériel requis (à prévoir par le client)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'providedEquipment',
            title: 'Matériel fourni (par le guide)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'program',
            title: 'Programme',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'time', type: 'string', title: 'Horaire/Durée' },
                        { name: 'description', type: 'string', title: 'Description de l\'étape' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'locationInfo',
            title: 'Infos lieu de RDV',
            type: 'text',
        }),
        defineField({
            name: 'locationEmbedUrl',
            title: 'URL Google Maps Embed',
            type: 'url',
        }),
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
