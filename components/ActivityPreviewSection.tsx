import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

// Utility to fetch activities (simulated for now, replace with real groq later if needed immediately)
async function getFeaturedActivities() {
    return client.fetch(groq`
        *[_type == "activity"] | order(_createdAt desc) [0...3] {
            title,
            "slug": slug.current,
            format,
            difficulty->{
                title,
                color
            },
            "imageUrl": mainImage.asset->url,
            "categories": categories[]->{title}
        }
    `);
}

export async function ActivityPreviewSection() {
    const activities = await getFeaturedActivities();

    // Fallback if no activities created yet
    if (!activities || activities.length === 0) {
        return (
            <section className="py-24 bg-white">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-4">Nos Aventures</h2>
                    <p className="text-stone-500 mb-8">Les activités seront bientôt disponibles.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900">
                            Découvrez nos aventures
                        </h2>
                        <p className="text-stone-500 text-lg max-w-lg">
                            Mono, Duo ou Multi : choisissez le format qui vous correspond.
                        </p>
                    </div>
                    <Button asChild variant="ghost" className="group">
                        <Link href="/activities" className="flex items-center gap-2">
                            Tout voir
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity: any) => (
                        <Link key={activity.slug} href={`/activities/${activity.slug}`} className="group relative block overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]">
                            {activity.imageUrl ? (
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                                    {/* Placeholder */}
                                    <span>Image manquante</span>
                                </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                    <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full mb-3 border border-white/30">
                                        {activity.format === 'mono' ? 'Mono-activité' : activity.format === 'duo' ? 'Duo-activité' : 'Multi-jours'}
                                    </span>
                                    <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <span>Voir les détails</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
