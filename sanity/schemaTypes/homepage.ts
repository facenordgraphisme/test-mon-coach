import { defineField, defineType } from 'sanity'

export const homepage = defineType({
    name: 'homepage',
    title: "Page d'accueil",
    type: 'document',
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal',
            type: 'string',
            description: 'Le gros titre au centre (ex: Mon Coach Plein Air)',
            initialValue: 'Mon Coach Plein Air'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Slogan / Sous-titre',
            type: 'string',
            description: "La phrase d'accroche (ex: Des expériences exclusives...)",
            initialValue: 'Des expériences exclusives, pensées pour vous.'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            description: "Laissez vide pour garder le dégradé de couleurs par défaut.",
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
            name: 'ctaText',
            title: 'Texte du Bouton Principal',
            type: 'string',
            initialValue: 'Réserver une sortie'
        }),
        defineField({
            name: 'ctaLink',
            title: 'Lien du Bouton',
            type: 'string',
            initialValue: '/calendrier'
        }),
        defineField({
            name: 'features',
            title: 'Points Forts (Cartes)',
            type: 'array',
            description: 'Les 3 cartes sous le Hero (Petits groupes, Sur mesure, etc.)',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'title',
                        title: 'Titre',
                        type: 'string'
                    },
                    {
                        name: 'description',
                        title: 'Description',
                        type: 'text',
                        rows: 3
                    },
                    {
                        name: 'icon',
                        title: 'Icône',
                        type: 'string',
                        options: {
                            list: [
                                { title: 'Groupe (Utilisateurs)', value: 'users' },
                                { title: 'Montagne (Aventure)', value: 'mountain' },
                                { title: 'Calendrier (Flexibilité)', value: 'calendar' },
                                { title: 'Coeur (Passion)', value: 'heart' },
                                { title: 'Étoile (Premium)', value: 'star' },
                                { title: 'Sécurité (Bouclier)', value: 'shield' },
                            ]
                        },
                        initialValue: 'users'
                    }
                ]
            }]
        }),
        defineField({
            name: 'activityTypes',
            title: 'Formules & Formats',
            type: 'array',
            description: 'Section présentant les formats (Mono, Duo, À la carte).',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'title',
                        title: 'Titre',
                        type: 'string',
                        initialValue: 'Mono-Activité'
                    },
                    {
                        name: 'description',
                        title: 'Description',
                        type: 'text',
                        rows: 3
                    },
                    {
                        name: 'image',
                        title: 'Image',
                        type: 'image',
                        options: { hotspot: true }
                    },
                    {
                        name: 'benefits',
                        title: 'Avantages (Liste à puces)',
                        type: 'array',
                        of: [{ type: 'string' }]
                    },
                    {
                        name: 'buttonText',
                        title: 'Texte du bouton',
                        type: 'string',
                        initialValue: 'Découvrir'
                    },
                    {
                        name: 'buttonLink',
                        title: 'Lien du bouton',
                        type: 'string',
                        initialValue: '/aventures'
                    }
                ]
            }]
        })
    ],
    preview: {
        prepare() {
            return {
                title: "Paramètres de la page d'accueil"
            }
        }
    }
})
