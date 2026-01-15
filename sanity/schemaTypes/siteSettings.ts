import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Paramètres du Site (Footer)',
    type: 'document',
    fields: [
        defineField({
            name: 'cardButtonText',
            title: 'Texte Bouton Cartes (Sorties)',
            type: 'string',
            description: 'Texte du bouton sur les cartes des sorties (ex: "Réserver", "Voir les dates")',
            initialValue: 'Réserver'
        }),
        defineField({
            name: 'siteTitle',
            title: 'Titre du Site',
            type: 'string',
            initialValue: 'Mon Coach Plein Air'
        }),
        defineField({
            name: 'footerText',
            title: 'Texte Pied de page (Sous Logo)',
            type: 'text',
            description: 'Petit texte descriptif affiché sous le logo dans le footer.',
            initialValue: 'Des expériences exclusives en Hautes-Alpes, pensées pour vous reconnecter à la nature.'
        }),
        defineField({
            name: 'email',
            title: 'Email de contact',
            type: 'string',
            initialValue: 'contact@moncoachpleinair.com'
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Adresse',
            type: 'string',
            initialValue: 'Hautes-Alpes'
        }),
        defineField({
            name: 'socialLinks',
            title: 'Réseaux Sociaux',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'platform',
                            type: 'string',
                            title: 'Plateforme',
                            options: {
                                list: [
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'Facebook', value: 'facebook' },
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'YouTube', value: 'youtube' }
                                ]
                            }
                        },
                        { name: 'url', type: 'url', title: 'Lien URL' }
                    ],
                    preview: {
                        select: { title: 'platform', subtitle: 'url' }
                    }
                }
            ]
        })
    ]
})
