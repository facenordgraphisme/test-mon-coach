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

// ---------------------------------------------------------------------------
// Données structurées : un seul graphe d'entités reliées par @id.
// Le layout émet l'entreprise, le guide et le site ; les pages y font référence
// par @id au lieu de recopier l'entreprise (évite les entités en double).
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://www.revesdaventures.fr';
export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#frederic-buet`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/assets/logo-v2.png`;
const PHONE = '+33683169402';

const ACTIVITIES = ['Escalade', 'Canyoning', 'Via ferrata', 'VTT', 'Vélo de route', 'Kayak', 'Planche à voile'];

// À confirmer avec le client : intitulé exact du métier (diplômes d'État) et ville de rattachement.
const JOB_TITLE = 'Guide de haute montagne';

/** Sérialise un ou plusieurs objets JSON-LD ; `null` s'il n'y a rien à émettre. */
export function jsonLdString(data: unknown): string | null {
    const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
    if (items.length === 0) return null;
    // Échappe "<" pour qu'un contenu CMS ne puisse pas fermer la balise <script>.
    return JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, '\\u003c');
}

function founderNode() {
    return {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Frédéric Buet',
        jobTitle: JOB_TITLE,
        description: "Ancien sportif de haut niveau en canoë-kayak, guide de haute montagne depuis plus de 30 ans et fondateur de Rêves d'Aventures.",
        url: `${SITE_URL}/guide`,
        worksFor: { '@id': ORG_ID },
        knowsAbout: ACTIVITIES,
    };
}

function businessNode() {
    return {
        '@type': ['SportsActivityLocation', 'SportsOrganization'],
        '@id': ORG_ID,
        name: "Rêves d'Aventures",
        url: `${SITE_URL}/`,
        description: "Sorties encadrées par un moniteur diplômé d'État : escalade, canyoning, via ferrata, VTT, vélo de route, kayak et planche à voile autour du lac de Serre-Ponçon, à Embrun et dans les Hautes-Alpes.",
        logo: { '@type': 'ImageObject', url: LOGO_URL },
        image: [DEFAULT_OG_IMAGE],
        telephone: PHONE,
        priceRange: '€€',
        currenciesAccepted: 'EUR',
        // Pas d'adresse de rue : activité sans local d'accueil (zone de chalandise).
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Embrun',
            postalCode: '05200',
            addressRegion: 'Hautes-Alpes',
            addressCountry: 'FR',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 44.5636, longitude: 6.4953 },
        areaServed: [
            { '@type': 'AdministrativeArea', name: 'Hautes-Alpes' },
            { '@type': 'Place', name: 'Lac de Serre-Ponçon' },
            { '@type': 'City', name: 'Embrun' },
            { '@type': 'City', name: 'Guillestre' },
            { '@type': 'City', name: 'Gap' },
        ],
        founder: { '@id': PERSON_ID },
        sameAs: [
            'https://www.instagram.com/revesdaventures',
            'https://www.facebook.com/revesdaventures',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: PHONE,
            contactType: 'customer service',
            areaServed: 'FR',
            availableLanguage: ['French'],
        },
    };
}

/** Graphe global (layout) : entreprise + guide + site. */
export function generateSiteGraph() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            businessNode(),
            founderNode(),
            {
                '@type': 'WebSite',
                '@id': WEBSITE_ID,
                url: `${SITE_URL}/`,
                name: "Rêves d'Aventures",
                inLanguage: 'fr-FR',
                publisher: { '@id': ORG_ID },
            },
        ],
    };
}

function diplomaName(d: unknown): string | null {
    if (typeof d === 'string') return d.trim() || null;
    if (d && typeof d === 'object') {
        const o = d as { title?: unknown; name?: unknown };
        const v = typeof o.title === 'string' ? o.title : typeof o.name === 'string' ? o.name : null;
        return v && v.trim() ? v.trim() : null;
    }
    return null;
}

/** Page /guide : profil du guide, avec ses diplômes réels (Sanity). */
export function generateGuideProfileSchema(guide: { imageUrl?: string; diplomas?: unknown } | null | undefined) {
    const diplomas = Array.isArray(guide?.diplomas)
        ? guide.diplomas.map(diplomaName).filter((d): d is string => d !== null)
        : [];

    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/guide#profilepage`,
        url: `${SITE_URL}/guide`,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: {
            ...founderNode(),
            ...(guide?.imageUrl ? { image: guide.imageUrl } : {}),
            ...(diplomas.length
                ? {
                    hasCredential: diplomas.map((name) => ({
                        '@type': 'EducationalOccupationalCredential',
                        name,
                        credentialCategory: "Diplôme d'État",
                    })),
                }
                : {}),
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; path?: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            ...(it.path !== undefined ? { item: `${SITE_URL}${it.path}` } : {}),
        })),
    };
}

type SessionForSchema = {
    _id?: string;
    date?: string;
    status?: string;
    title?: string;
    price?: number;
    seatsAvailable?: number;
    maxParticipants?: number;
    locationInfo?: string;
};

function isFuture(date?: string): boolean {
    return !!date && new Date(date).getTime() > Date.now();
}

/** Page d'activité : Service + offre « dès X € » + une Event par séance à venir + fil d'Ariane. */
export function generateActivitySchema(activity: {
    title: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    upcomingEvents?: SessionForSchema[];
    /** Prix « à partir de » saisi dans Sanity, utilisé s'il n'y a aucune séance à venir. */
    priceFrom?: number;
}) {
    const url = `${SITE_URL}/aventures/${activity.slug}`;
    const sessions = (activity.upcomingEvents || []).filter((e) => isFuture(e.date) && e.status !== 'cancelled');
    const prices = sessions.map((e) => e.price).filter((p): p is number => typeof p === 'number' && p > 0);
    const minPrice = prices.length
        ? Math.min(...prices)
        : typeof activity.priceFrom === 'number' && activity.priceFrom > 0 ? activity.priceFrom : null;

    const service = {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `${activity.title} – sortie encadrée à Serre-Ponçon (Hautes-Alpes)`,
        serviceType: activity.title,
        url,
        ...(activity.description ? { description: activity.description.slice(0, 500) } : {}),
        ...(activity.imageUrl ? { image: activity.imageUrl } : {}),
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'AdministrativeArea', name: 'Hautes-Alpes' },
        ...(minPrice !== null
            ? {
                offers: {
                    '@type': 'Offer',
                    url,
                    price: minPrice,
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    seller: { '@id': ORG_ID },
                },
            }
            : {}),
    };

    const events = sessions.map((e) => {
        const soldOut = typeof e.seatsAvailable === 'number' && e.seatsAvailable <= 0;
        return {
            '@type': 'Event',
            name: e.title ? `${activity.title} – ${e.title}` : activity.title,
            startDate: e.date,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
                '@type': 'Place',
                name: e.locationInfo || 'Lac de Serre-Ponçon, Hautes-Alpes',
                address: { '@type': 'PostalAddress', addressRegion: 'Hautes-Alpes', addressCountry: 'FR' },
            },
            ...(activity.imageUrl ? { image: [activity.imageUrl] } : {}),
            organizer: { '@id': ORG_ID },
            performer: { '@id': PERSON_ID },
            ...(typeof e.maxParticipants === 'number' ? { maximumAttendeeCapacity: e.maxParticipants } : {}),
            ...(typeof e.seatsAvailable === 'number' ? { remainingAttendeeCapacity: Math.max(0, e.seatsAvailable) } : {}),
            ...(typeof e.price === 'number' && e.price > 0
                ? {
                    offers: {
                        '@type': 'Offer',
                        url: e._id ? `${SITE_URL}/booking/${e._id}` : url,
                        price: e.price,
                        priceCurrency: 'EUR',
                        availability: soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
                    },
                }
                : {}),
        };
    });

    return {
        '@context': 'https://schema.org',
        '@graph': [
            service,
            ...events,
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: 'Aventures', item: `${SITE_URL}/aventures/mono-activite` },
                    { '@type': 'ListItem', position: 3, name: activity.title },
                ],
            },
        ],
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

/**
 * Avis recueillis par le site (jamais ceux recopiés de Google), rattachés à l'entreprise par @id.
 * Non éligibles aux étoiles Google (avis « auto-attribués »), mais utiles aux moteurs IA.
 */
export function generateReviewSchema(reviews: { author: string; rating: number; text: string; date: string }[]) {
    if (!reviews || reviews.length === 0) return null;

    const ratingValue = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    return {
        '@context': 'https://schema.org',
        '@type': ['SportsActivityLocation', 'SportsOrganization'],
        '@id': ORG_ID,
        name: "Rêves d'Aventures",
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.round(ratingValue * 10) / 10,
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

export function generateArticleSchema(post: { title: string; excerpt?: string; imageUrl?: string; publishedAt?: string; updatedAt?: string; author?: string; slug: string } | null | undefined) {
    if (!post) return null;
    const url = `${SITE_URL}/blog/${post.slug}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl || DEFAULT_OG_IMAGE,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        inLanguage: 'fr-FR',
        author: { '@id': PERSON_ID },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@id': WEBSITE_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    };
}
