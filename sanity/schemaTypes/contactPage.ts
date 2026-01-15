import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
    name: 'contactPage',
    title: 'Page Contact',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro (Haut de page)' },
        { name: 'contact', title: 'Infos & Coordonnées' },
        { name: 'seo', title: 'SEO / Métadonnées' },
    ],
    fields: [
        // --- HERO ---
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal',
            type: 'string',
            group: 'hero',
            initialValue: 'Contact'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre',
            type: 'text',
            rows: 2,
            group: 'hero',
            initialValue: 'Une envie particulière ? Un projet de groupe ? Écrivez-nous, réponse rapide garantie.'
        }),
        defineField({
            name: 'heroLabel',
            title: 'Label (Petit texte au dessus)',
            type: 'string',
            group: 'hero',
            initialValue: 'ÉCHANGEZ'
        }),
        defineField({
            name: 'heroImage',
            title: 'Image de fond',
            type: 'image',
            options: { hotspot: true },
            group: 'hero'
        }),

        // --- CONTACT INFOS ---
        defineField({
            name: 'phone',
            title: 'Numéro de téléphone',
            type: 'string',
            group: 'contact',
            initialValue: '+33 6 00 00 00 00'
        }),
        defineField({
            name: 'email',
            title: 'Adresse Email',
            type: 'string',
            group: 'contact',
            initialValue: 'contact@moncoachpleinair.com'
        }),
        defineField({
            name: 'locationTitle',
            title: 'Titre Localisation',
            type: 'string',
            group: 'contact',
            initialValue: 'Localisation'
        }),
        defineField({
            name: 'locationText',
            title: 'Texte Localisation',
            type: 'text',
            rows: 3,
            group: 'contact',
            initialValue: 'Hautes-Alpes, France\n(Briançon, Embrun, Gap)'
        }),

        // --- PROMO CALENDRIER ---
        defineField({
            name: 'calendarPromoTitle',
            title: 'Titre Bloc Calendrier',
            type: 'string',
            group: 'contact',
            initialValue: 'Déjà une date en tête ?'
        }),
        defineField({
            name: 'calendarPromoText',
            title: 'Texte Bloc Calendrier',
            type: 'text',
            rows: 2,
            group: 'contact',
            initialValue: "Vérifiez d'abord si une sortie est déjà programmée dans le calendrier."
        }),
        defineField({
            name: 'calendarPromoButtonText',
            title: 'Bouton Calendrier',
            type: 'string',
            group: 'contact',
            initialValue: 'Voir le calendrier'
        }),

        // --- SEO ---
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo'
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Page Contact (Contenus)"
            }
        }
    }
})
