import { defineField, defineType } from 'sanity'

export const activity = defineType({
    name: 'activity',
    title: 'Activité',
    type: 'document',
    groups: [
        { name: 'seo', title: 'SEO & Méta-données' },
    ],
    fields: [
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        }),
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'format',
            title: 'Format',
            type: 'string',
            options: {
                list: [
                    { title: 'Mono-activité', value: 'mono' },
                    { title: 'Duo-activités', value: 'duo' },
                    { title: 'Multi-activités / Weekend', value: 'multi' },
                ],
            }
        }),
        defineField({
            name: 'participantsRange',
            title: 'Nombre de participants (Texte)',
            description: 'Ex: "1 à 5 pers." ou "Groupe 4-12". Si vide, la valeur par défaut sera utilisée.',
            type: 'string',
        }),
        defineField({
            name: 'durationMode',
            title: 'Mode de durée',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Demi-journée', value: 'half_day' },
                    { title: 'Journée', value: 'full_day' },
                    { title: 'Variable / Autre', value: 'variable' },
                ],
                // layout: 'checkbox' removed as it is invalid. Default array UI will be used.
            },
            initialValue: ['variable']
        }),
        defineField({
            name: 'categories',
            title: 'Catégories',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }]
        }),

        defineField({
            name: 'hasRental',
            title: 'Proposer de la location de matériel ?',
            description: 'Si coché, un onglet "Location" apparaîtra sur la page de l\'activité.',
            type: 'boolean',
            initialValue: false
        }),
        defineField({
            name: 'rentalDescription',
            title: 'Détails de la location',
            type: 'blockContent',
            hidden: ({ document }) => !document?.hasRental
        }),
        defineField({
            name: 'availableBikes',
            title: 'Vélos disponibles à la location',
            description: 'Sélectionnez les modèles de vélos proposés pour cette activité.',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'bike' } }],
            hidden: ({ document }) => !document?.hasRental
        }),

        defineField({
            name: 'description',
            title: 'Description (L\'expérience)',
            type: 'blockContent',
        }),
        defineField({
            name: 'practicalInfo',
            title: 'Infos pratiques du catalogue',
            description: 'Informations générales (parking, accès...). Pour le lieu de RDV spécifique, utilisez la fiche Séance.',
            type: 'blockContent',
        }),

        defineField({
            name: 'mainImage',
            title: 'Image principale',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texte alternatif',
                }
            ]
        }),

        defineField({
            name: 'requiresHeightWeight',
            title: 'Demander Taille / Poids ?',
            description: 'Si activé, les champs Taille et Poids seront demandés lors de la réservation.',
            type: 'boolean',
            initialValue: false
        }),
        defineField({
            name: 'difficulties',
            title: 'Niveaux de difficulté possibles',
            description: 'Sélectionnez les niveaux de difficulté applicables à cette activité.',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'difficulty' } }]
        }),


        defineField({
            name: 'reviews',
            title: 'Avis Clients',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'author', type: 'string', title: 'Auteur' },
                    { name: 'text', type: 'text', title: 'Avis' },
                    { name: 'rating', type: 'number', title: 'Note (1-5)', validation: Rule => Rule.min(1).max(5) }
                ]
            }]
        })
    ],
})
