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
        '@type': 'SportsOrganization', // Or 'Organization' or 'LocalBusiness' depending on user pref
        name: "Rêves d'Aventures",
        url: 'https://moncoachpleinair.com',
        logo: 'https://moncoachpleinair.com/logo.png', // Replace with actual logo URL if available or use a constantly defined one
        sameAs: [
            // Add social profiles if available
            'https://www.instagram.com/moncoachpleinair',
            'https://www.facebook.com/moncoachpleinair',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+33 6 00 00 00 00', // Replace with dynamic if possible or hardcode for now
            contactType: 'customer service',
            areaServed: 'FR',
            availableLanguage: ['French', 'English'],
        },
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: "Rêves d'Aventures",
        url: 'https://moncoachpleinair.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://moncoachpleinair.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }
}
