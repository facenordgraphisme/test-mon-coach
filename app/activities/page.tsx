import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { Suspense } from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catalogue d'Activités | Rêves d'Aventures Hautes-Alpes",
    description: "Parcourez nos activités exclusives dans les Hautes-Alpes : Escalade, Canyoning, VTT. Des sorties encadrées pour tous les niveaux autour du lac de Serre-Ponçon.",
    openGraph: {
        title: "Catalogue d'Activités | Rêves d'Aventures Hautes-Alpes",
        description: "Escalade, Canyoning, VTT dans les Hautes-Alpes. Trouvez votre prochaine aventure.",
        url: 'https://revesdaventures.fr/activities',
    }
};

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

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: 'https://revesdaventures.fr',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Activités',
                item: 'https://revesdaventures.fr/activities',
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
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
                <Suspense fallback={<div>Chargement..</div>}>
                    <ActivityFilterableList initialActivities={activities} />
                </Suspense>
            </main>
            <SiteFooter />
        </div>
        </>
    )
}
