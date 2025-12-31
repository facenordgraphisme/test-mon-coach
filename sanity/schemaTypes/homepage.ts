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
            name: 'heroGallery',
            title: 'Galerie Hero (Carrousel)',
            type: 'array',
            description: "Ajoutez plusieurs images pour créer un carrousel de fond (effet fondu). Si vide, l'image unique ci-dessus sera utilisée.",
            of: [{ type: 'image', options: { hotspot: true } }]
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
            name: 'flexibleOffer1',
            title: 'Offre Flexible - Texte 1',
            type: 'string',
            description: 'Ex: 3 Formules : Mono, Duos, Multi',
            initialValue: '3 Formules : Mono, Duos, Multi'
        }),
        defineField({
            name: 'flexibleOffer2',
            title: 'Offre Flexible - Texte 2',
            type: 'string',
            description: 'Ex: 3 Niveaux : Découverte, Aventure, Warrior',
            initialValue: '3 Niveaux : Découverte, Aventure, Warrior'
        }),
        defineField({
            name: 'flexibleOffer3',
            title: 'Offre Flexible - Texte 3',
            type: 'string',
            description: 'Ex: 3 Durées : ½ journée, Journée, Semaine',
            initialValue: '3 Durées : ½ journée, Journée, Semaine'
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
        }),
        defineField({
            name: 'faq',
            title: 'Foire Aux Questions (FAQ)',
            type: 'array',
            description: 'Questions/Réponses affichées en bas de page.',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'question',
                        title: 'Question',
                        type: 'string',
                    },
                    {
                        name: 'answer',
                        title: 'Réponse',
                        type: 'text',
                        rows: 3
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
