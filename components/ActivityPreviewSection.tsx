import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { ActivitySlider, Activity } from "./ActivitySlider";

// Utility to fetch activities (simulated for now, replace with real groq later if needed immediately)
async function getFeaturedActivities(): Promise<Activity[]> {
    return client.fetch(groq`
        *[_type == "activity"] | order(_createdAt desc) [0...12] {
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
                </div>

                <ActivitySlider activities={activities} />

                <div className="mt-12 flex justify-center">
                    <Button asChild size="lg" className="bg-stone-900 text-white hover:bg-stone-800 rounded-full px-8">
                        <Link href="/calendrier">
                            <Calendar className="mr-2 h-5 w-5" />
                            Voir le calendrier des sorties
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

