import { defineArrayMember, defineField, defineType } from 'sanity'

export const post = defineType({
    name: 'post',
    title: 'Article de blog',
    type: 'document',
    groups: [
        { name: 'seo', title: 'SEO & Méta-données' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Extrait',
            type: 'text',
            rows: 3,
            description: "Court résumé affiché dans la liste des articles et utilisé comme description par défaut pour le SEO et le partage.",
            validation: (Rule) => Rule.max(200),
        }),
        defineField({
            name: 'mainImage',
            title: 'Image principale',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'author',
            title: 'Auteur',
            type: 'string',
            initialValue: 'Frédéric Buet',
        }),
        defineField({
            name: 'tags',
            title: 'Tags / Thèmes',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'relatedActivities',
            title: 'Activités liées',
            description: 'Activités mises en avant dans cet article (liens internes en fin de page).',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'activity' }] }],
        }),
        defineField({
            name: 'body',
            title: 'Contenu',
            type: 'blockContent',
        }),
        defineField({
            name: 'faq',
            title: 'Questions fréquentes',
            description: "Affichées en fin d'article et utilisées pour le schema FAQPage (rich results Google).",
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'faqItem',
                    fields: [
                        defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'answer', title: 'Réponse', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
                    ],
                    preview: {
                        select: { title: 'question' },
                    },
                }),
            ],
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            date: 'publishedAt',
        },
        prepare({ title, media, date }) {
            return {
                title,
                subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : '',
                media,
            }
        },
    },
})
