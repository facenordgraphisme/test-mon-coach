import type { Metadata } from 'next';
import { urlFor } from './sanity';

export interface SanitySeo {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: any;
    structuredData?: string;
}

export function generateSeoMetadata(
    seo: SanitySeo | null | undefined,
    fallback: { title: string; description: string; url: string }
): Metadata {
    const title = seo?.metaTitle || fallback.title;
    const description = seo?.metaDescription || fallback.description;
    const imageUrl = seo?.openGraphImage ? urlFor(seo.openGraphImage).width(1200).height(630).url() : null;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: fallback.url,
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: "Rêves d'Aventures",
        url: 'https://revesdaventures.fr',
        logo: 'https://revesdaventures.fr/assets/logo-v2.png',
        sameAs: [
            'https://www.instagram.com/revesdaventures',
            'https://www.facebook.com/revesdaventures',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+33 6 00 00 00 00',
            contactType: 'customer service',
            areaServed: 'FR',
            availableLanguage: ['French', 'English'],
        },
    };
}

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: "Rêves d'Aventures",
        description: "Coaching et guide de haute montagne en Escalade, Canyoning et VTT dans les Hautes-Alpes (Serre-Ponçon, Embrun, Guillestre).",
        url: 'https://revesdaventures.fr',
        telephone: '+33 6 00 00 00 00',
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

export function generateProductSchema(activity: any) {
    if (!activity) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: activity.title,
        description: activity.description?.[0]?.children?.[0]?.text || activity.title,
        image: activity.imageUrl,
        offers: {
            '@type': 'Offer',
            price: activity.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `https://revesdaventures.fr/activities/${activity.slug}`
        },
        brand: {
            '@type': 'Brand',
            name: "Rêves d'Aventures"
        }
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: "Rêves d'Aventures",
        url: 'https://revesdaventures.fr',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://revesdaventures.fr/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }
}

