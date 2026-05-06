import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://revesdaventures.fr';

    // Fetch all activity slugs from Sanity
    const activities = await client.fetch(groq`*[_type == "activity"] { "slug": slug.current, _updatedAt }`);

    const activityUrls = activities.map((activity: any) => ({
        url: `${baseUrl}/activities/${activity.slug}`,
        lastModified: new Date(activity._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/activities`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calendrier`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guide`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cgv`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
    ];

    return [...staticUrls, ...activityUrls];
}
