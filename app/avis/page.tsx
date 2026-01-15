import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { Star, Quote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

async function getData() {
    const reviews = await client.fetch(groq`
        *[_type == "review"] | order(date desc) {
            author,
            rating,
            text,
            date,
            source
        }
    `, {}, { next: { revalidate: 10 } });

    const pageContent = await client.fetch(groq`
        *[_type == "reviewsPage"][0] {
            title,
            subtitle,
            "heroImageUrl": heroImage.asset->url,
            seo
        }
    `, {}, { next: { revalidate: 10 } });

    return { reviews, pageContent };
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await client.fetch(groq`*[_type == "reviewsPage"][0] { seo }`);
    return generateSeoMetadata(data?.seo, {
        title: "Avis Clients | Mon Coach Plein Air",
        description: "Découvrez ce que nos aventuriers pensent de leurs expériences avec nous.",
        url: 'https://moncoachpleinair.com/avis'
    });
}

export default async function ReviewsPage() {
    const { reviews, pageContent } = await getData();

    const title = pageContent?.title || "Avis Clients";
    const subtitle = pageContent?.subtitle || "Découvrez ce que nos aventuriers pensent de leurs expériences avec nous.";
    const heroImage = pageContent?.heroImageUrl || "/assets/IMG_3019.JPG";
    const customJsonLd = pageContent?.seo?.structuredData ? JSON.parse(pageContent.seo.structuredData) : null;

    // Fallback if no reviews (for demo puposes)
    const displayReviews = reviews.length > 0 ? reviews : [
        {
            author: "Aventurier Anonyme",
            rating: 5,
            text: "Une expérience incroyable en pleine nature. Le guide était passionné et très professionnel.",
            date: "2024-06-15",
            source: "direct"
        },
        // ... (truncated fallback data for brevity if desired, but keeping logic simpler)
        {
            author: "Marie L.",
            rating: 5,
            text: "Superbe journée d'escalade ! Pédagogie au top, je me suis sentie en sécurité tout du long.",
            date: "2024-07-22",
            source: "google"
        },
        {
            author: "Thomas B.",
            rating: 5,
            text: "Le canyoning était génial. Sensations fortes garanties dans un cadre magnifique.",
            date: "2024-08-10",
            source: "google"
        },
        {
            author: "Lucas P.",
            rating: 4,
            text: "Très bonne sortie VTT, paysages grandioses. Un peu physique mais ça vaut le coup.",
            date: "2024-09-05",
            source: "other"
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([customJsonLd].filter(Boolean)) }}
            />
            <PageHero
                title={title}
                subtitle={subtitle}
                label="TÉMOIGNAGES"
                image={heroImage}
            />
            <main className="flex-1 py-12 md:py-20">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="mb-10">
                        <Button asChild variant="ghost" className="mb-6 hover:bg-stone-100 -ml-4">
                            <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900">
                                <ArrowLeft className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayReviews.map((review: any, index: number) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "fill-[var(--brand-rock)] text-[var(--brand-rock)]" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="w-6 h-6 text-stone-200" />
                                </div>

                                <p className="text-stone-700 text-sm italic mb-6 leading-relaxed min-h-[80px]">
                                    "{review.text}"
                                </p>

                                <div className="pt-4 border-t border-stone-50 flex items-center justify-between mt-auto">
                                    <div>
                                        <div className="font-bold text-stone-900 text-sm">{review.author}</div>
                                        <div className="text-xs text-stone-400">
                                            {new Date(review.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-stone-50 rounded-full text-stone-500 capitalize border border-stone-100">
                                        {review.source}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
