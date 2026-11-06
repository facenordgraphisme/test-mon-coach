import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

const baseUrl = 'https://www.revesdaventures.fr';

// Régénéré au plus toutes les 24 h (et à chaque revalidation globale) :
// les activités et articles publiés dans Sanity y apparaissent sans redéploiement.
export const revalidate = 86400;

type SanityEntry = { slug: string; _updatedAt: string };

// Même format que le garde-fou des pages [slug] : on n'expose que des URLs valides.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Pages statiques → document Sanity qui porte leur contenu, pour un lastModified réel
// (au lieu de new Date(), qui annonçait à Google une modification à chaque génération).
const STATIC_PAGES: { path: string; type?: string }[] = [
    { path: '', type: 'homepage' },
    { path: '/aventures/mono-activite', type: 'monoActivitePage' },
    { path: '/aventures/duo-activites', type: 'duoActivitesPage' },
    { path: '/multi', type: 'multiPage' },
    { path: '/calendrier', type: 'calendarPage' },
    { path: '/niveaux', type: 'levelsPage' },
    { path: '/acces', type: 'accessPage' },
    { path: '/avis' },
    { path: '/blog' },
    { path: '/guide', type: 'guide' },
    { path: '/contact', type: 'contactPage' },
    { path: '/cgv', type: 'cgvPage' },
    { path: '/mentions-legales', type: 'legalPage' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { activities, posts, singletons, latestEvent, latestReview } = await client.fetch<{
        activities: SanityEntry[];
        posts: SanityEntry[];
        singletons: { _type: string; _updatedAt: string }[];
        latestEvent: string | null;
        latestReview: string | null;
    }>(groq`{
        "activities": *[_type == "activity" && defined(slug.current)] { "slug": slug.current, _updatedAt },
        "posts": *[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt },
        "singletons": *[_type in $singletonTypes && !(_id in path("drafts.**"))] { _type, _updatedAt },
        "latestEvent": *[_type == "event"] | order(_updatedAt desc)[0]._updatedAt,
        "latestReview": *[_type == "review"] | order(_updatedAt desc)[0]._updatedAt
    }`, { singletonTypes: STATIC_PAGES.map((p) => p.type).filter(Boolean) });

    const latest = (...dates: (string | null | undefined)[]) => {
        const valid = dates.filter((d): d is string => !!d).map((d) => new Date(d).getTime());
        return valid.length ? new Date(Math.max(...valid)) : undefined;
    };
    const singletonDate = (type?: string) => singletons.find((s) => s._type === type)?._updatedAt;
    const latestActivity = latest(...activities.map((a) => a._updatedAt));
    const latestPost = latest(...posts.map((p) => p._updatedAt));

    const staticUrls: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, type }) => {
        let lastModified: Date | undefined = latest(singletonDate(type));
        // Pages listes : date du contenu le plus récent qu'elles affichent.
        if (['/aventures/mono-activite', '/aventures/duo-activites', '/calendrier'].includes(path)) {
            lastModified = latest(singletonDate(type), latestActivity?.toISOString(), latestEvent);
        } else if (path === '/blog') {
            lastModified = latestPost;  // pas de document de page dédié
        } else if (path === '/avis') {
            lastModified = latest(latestReview);
        }
        return { url: `${baseUrl}${path}`, ...(lastModified ? { lastModified } : {}) };
    });

    const activityUrls: MetadataRoute.Sitemap = activities
        .filter((a) => SLUG_PATTERN.test(a.slug))
        .map((a) => ({ url: `${baseUrl}/aventures/${a.slug}`, lastModified: new Date(a._updatedAt) }));

    const postUrls: MetadataRoute.Sitemap = posts
        .filter((p) => SLUG_PATTERN.test(p.slug))
        .map((p) => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: new Date(p._updatedAt) }));

    return [...staticUrls, ...activityUrls, ...postUrls];
}
