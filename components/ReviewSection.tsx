"use client";

import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getReviews() {
    return client.fetch(groq`
        *[_type == "review"] | order(date desc)[0...3] {
            author,
            rating,
            text,
            date,
            source
        }
    `);
}

export function ReviewSection() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        getReviews().then(setReviews);
    }, []);

    // Fallback data if no reviews exist yet
    const displayReviews = reviews.length > 0 ? reviews : [
        {
            author: "Aventurier Anonyme",
            rating: 5,
            text: "Une expérience incroyable en pleine nature. Le guide était passionné et très professionnel.",
            date: "2024-06-15",
            source: "direct"
        },
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
        }
    ];

    return (
        <section className="py-24 bg-stone-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-[var(--brand-rock)] blur-[120px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--brand-water)] blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-display">
                        Ils ont vécu l'aventure
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Retours d'expérience de nos clients sur leurs sorties en montagne.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {displayReviews.map((review, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--brand-water)]/10" />
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? "fill-[var(--brand-rock)] text-[var(--brand-rock)]" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-stone-700 italic mb-6 leading-relaxed relative z-10">
                                "{review.text}"
                            </p>
                            <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                                <span className="font-bold text-stone-900">{review.author}</span>
                                <span className="text-xs text-stone-400 capitalize">{review.source}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button asChild variant="outline" className="border-[var(--brand-rock)] text-[var(--brand-rock)] hover:bg-[var(--brand-rock)] hover:text-white transition-colors">
                        <Link href="/avis">
                            Voir tous les avis
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
