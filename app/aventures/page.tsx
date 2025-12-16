import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { ActivityFormats } from "@/components/ActivityFormats";
import { Suspense } from 'react';

async function getActivities() {
    return client.fetch(groq`
        *[_type == "activity"] | order(_createdAt desc) {
            title,
            "slug": slug.current,
            format,
            difficulty->{
                title,
                level,
                color
            },
            "imageUrl": mainImage.asset->url,
            "categories": categories[]->{
                title
            },
            price,
            duration
        }
    `);
}

export const revalidate = 60;

export default async function ActivitiesPage() {
    const activities = await getActivities();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[var(--brand-water)] text-white py-20 px-4 md:px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Aventures</h1>
                    <p className="text-stone-400 text-lg max-w-2xl">
                        Mono, Duo ou Multi. Choisissez l'intensité, l'élément et le format qui vous convient.
                    </p>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <ActivityFormats hideTitle={true} className="py-8 pb-12" variant="compact" />
                <h2 className="text-3xl font-bold mb-8 text-stone-900">Toutes nos activités</h2>
                <Suspense fallback={<div>Chargement...</div>}>
                    <ActivityFilterableList initialActivities={activities} />
                </Suspense>
            </main>
            <SiteFooter />
        </div>
    )
}
