import type { Metadata } from 'next';
import { urlFor } from './sanity';

export interface SanitySeo {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: any;
    structuredData?: string;
}

const DEFAULT_OG_IMAGE = 'https://www.revesdaventures.fr/assets/og-default.png';

export function generateSeoMetadata(
    seo: SanitySeo | null | undefined,
    fallback: { title: string; description: string; url: string }
): Metadata {
    const title = seo?.metaTitle || fallback.title;
    const description = seo?.metaDescription || fallback.description;
    const imageUrl = seo?.openGraphImage ? urlFor(seo.openGraphImage).width(1200).height(630).url() : DEFAULT_OG_IMAGE;

    return {
        title,
        description,
        alternates: {
            canonical: fallback.url,
        },
        openGraph: {
            title,
            description,
            url: fallback.url,
            images: [{ url: imageUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export function generateFounderSchema() {
    return {
        '@type': 'Person',
        name: 'Frédéric Buet',
        jobTitle: 'Guide de haute montagne',
        description: "Ancien sportif de haut niveau en canoë-kayak, guide de haute montagne depuis plus de 30 ans et fondateur de Rêves d'Aventures.",
        url: 'https://www.revesdaventures.fr/guide',
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: "Rêves d'Aventures",
        url: 'https://www.revesdaventures.fr',
        logo: 'https://www.revesdaventures.fr/assets/logo-v2.png',
        founder: generateFounderSchema(),
        sameAs: [
            'https://www.instagram.com/revesdaventures',
            'https://www.facebook.com/revesdaventures',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+33 6 83 16 94 02',
            contactType: 'customer service',
            areaServed: 'FR',
            availableLanguage: ['French', 'English'],
        },
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[] | null | undefined) {
    if (!faqs || faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: "Rêves d'Aventures",
        description: "Coaching et guide de haute montagne en Escalade, Canyoning et VTT dans les Hautes-Alpes (Serre-Ponçon, Embrun, Guillestre).",
        url: 'https://www.revesdaventures.fr',
        telephone: '+33 6 83 16 94 02',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Lac de Serre-Ponçon',
            addressLocality: 'Embrun',
            addressRegion: 'Hautes-Alpes',
            postalCode: '05200',
            addressCountry: 'FR',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 44.563,
            longitude: 6.491,
        },
        areaServed: [
            { '@type': 'Place', name: 'Hautes-Alpes' },
            { '@type': 'Place', name: 'Lac de Serre-Ponçon' },
            { '@type': 'Place', name: 'Embrun' },
            { '@type': 'Place', name: 'Guillestre' },
            { '@type': 'Place', name: 'Gap' }
        ],
        priceRange: '€€',
        openingHours: 'Mo-Su 08:00-20:00'
    };
}

export function generateReviewSchema(reviews: { author: string; rating: number; text: string; date: string }[]) {
    if (!reviews || reviews.length === 0) return null;

    const ratingValue = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    return {
        ...generateLocalBusinessSchema(),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingValue.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
        },
        review: reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            datePublished: r.date,
            reviewRating: {
                '@type': 'Rating',
                ratingValue: r.rating,
                bestRating: 5,
                worstRating: 1,
            },
            reviewBody: r.text,
        })),
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: "Rêves d'Aventures",
        url: 'https://www.revesdaventures.fr',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.revesdaventures.fr/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }
}

