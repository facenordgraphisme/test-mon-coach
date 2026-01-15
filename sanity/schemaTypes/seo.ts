import { defineType, defineField } from 'sanity';

export const seo = defineType({
    name: 'seo',
    title: 'SEO & Social',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Titre affiché dans les résultats Google et les onglets du navigateur (50-60 caractères recommandés)',
            validation: (Rule) => Rule.max(60).warning('Les titres plus longs peuvent être tronqués par Google.'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Résumé affiché sous le titre dans Google (150-160 caractères recommandés)',
            validation: (Rule) => Rule.max(160).warning('Les descriptions plus longues peuvent être tronquées par Google.'),
        }),
        defineField({
            name: 'openGraphImage',
            title: 'Image de partage (Open Graph)',
            type: 'image',
            description: 'Image affichée lors du partage sur Facebook, Twitter, WhatsApp, etc. (1200x630px recommandé)',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'structuredData',
            title: 'Données Structurées Personnalisées (JSON-LD)',
            type: 'text',
            rows: 5,
            description: 'Code JSON-LD optionnel pour surcharger ou ajouter des données structurées spécifiques. Ne remplir que si vous savez ce que vous faites.',
        }),
    ],
});
