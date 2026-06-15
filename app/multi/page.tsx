import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { Map, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "@/components/PortableTextComponents";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Suspense } from 'react';

async function getData() {
    // 1. Fetch Singleton Page Content
    let doc = await client.fetch(groq`*[_type == "multiPage"][0] {
        "title": heroTitle,
        "subtitle": heroSubtitle,
        "imageUrl": heroImage.asset->url,
        description,
        benefits,
        
        // Intro fields
        introTitle,
        introDescription,

        seo
    }`);

    if (!doc) {
        doc = {
            title: "Multi / Sur-mesure",
            subtitle: "Créez votre séjour sur-mesure : combinez escalade, canyoning et VTT avec votre guide dans les Hautes-Alpes.",
            description: [],
            benefits: ["Accompagnement personnalisé", "Programme flexible", "Souvenirs inoubliables"],
            imageUrl: null,
            seo: null,
            introTitle: "Aventures Multi & Week-end",
            introDescription: "Pour les projets multi-activités, les groupes ou les demandes spécifiques, nous construisons le programme ensemble."
        };
    }

    // 2. Fetch Related Data (Activities, Events)
    const format = 'multi';
    const extraData = await client.fetch(groq`
        {
            "events": *[_type == "event" && status != 'cancelled' && dateTime(date) > dateTime(now())] | order(date asc) {
                _id,
                title,
                date,
                endDate,
                status,
                maxParticipants,
                seatsAvailable,
                bookedCount,
                price,
                privatizationPrice,
                duration,
                difficulty->{ title, level, color },
                activity->{
                    title,
                    "slug": slug.current,
                    "imageUrl": mainImage.asset->url,
                    format
                }
            },
            "activities": *[_type == "activity" && format == $format] {
                title,
                "slug": slug.current,
                format,
                difficulty->{ title, level, color },
                "imageUrl": mainImage.asset->url,
                categories[]->{ title, element },
                duration,
                durationMode,
                "difficulties": difficulties[]->{ title, level, color },
                "upcomingEvents": *[_type == "event" && references(^._id) && date > now()] | order(date asc) {
                    price,
                    difficulty->{ title, level, color }
                }
            }
        }
    `, { format });

    // 3. Fetch Site Settings for Card Button
    const settings = await client.fetch(groq`*[_type == "siteSettings"][0] { cardButtonText }`, {}, { next: { revalidate: 0 } });

    return { ...doc, ...extraData, cardButtonText: settings?.cardButtonText };
}

export async function generateMetadata(): Promise<Metadata> {
    const doc = await client.fetch(groq`*[_type == "multiPage"][0] {
        "title": heroTitle,
        description,
        "imageUrl": heroImage.asset->url,
        seo
    }`);

    return generateSeoMetadata(doc?.seo, {
        title: doc?.title || "Multi / Sur-Mesure",
        description: "Combinez plusieurs activités (escalade, canyoning, VTT) sur un format Multi ou créez un séjour 100% sur-mesure avec votre guide dans les Hautes-Alpes.",
        url: `https://www.revesdaventures.fr/multi`
    });
}

export const revalidate = 60;

export default async function MultiPage() {
    const data = await getData();

    if (!data) {
        notFound();
    }

    const { 
        title, subtitle, imageUrl, description, benefits, seo, introTitle, introDescription,
        events, activities, cardButtonText
    } = data;
    const customJsonLd = seo?.structuredData ? JSON.parse(seo.structuredData) : null;

    return (
        <main className="min-h-screen bg-stone-50">
            {customJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(customJsonLd) }}
                />
            )}

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="100vw"
                            priority
                            className="object-cover"
                        />
                    ) : (
                        <div className="bg-stone-900 w-full h-full" />
                    )}
                </div>
                <div className="relative z-20 container px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{title}</h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 text-stone-100 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            </section>

            <div className="container px-4 md:px-6 mx-auto py-16 space-y-24">

                {/* Description */}
                <div className="prose prose-stone text-lg md:text-xl text-stone-700 text-center mx-auto max-w-4xl">
                    <PortableText value={description} components={ptComponents} />
                </div>

                {/* Benefits List */}
                {(() => {
                    const validBenefits = benefits && benefits.length > 0
                        ? benefits
                        : ["Adaptabilité totale", "Expertise locale", "Sécurité garantie"];

                    return (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 max-w-4xl mx-auto">
                            <h3 className="text-xl font-bold mb-6 text-center text-stone-900">Pourquoi choisir cette formule ?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {validBenefits.map((benefit: string, i: number) => (
                                    <div key={i} className="flex flex-col items-center text-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[var(--brand-water)]/10 text-[var(--brand-water)] flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <p className="font-medium text-stone-800">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* DARK MULTI / SUR MESURE BLOCK */}
                <div className="bg-stone-900 rounded-3xl overflow-hidden p-8 md:p-16 text-center md:text-left relative max-w-6xl mx-auto">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                                <Map className="w-8 h-8 text-[var(--brand-rock)]" />
                                {introTitle || "Aventures Multi & Week-end"}
                            </h2>
                            <p className="text-stone-300 text-lg leading-relaxed">
                                {introDescription || "Pour les projets multi-activités, les groupes ou les demandes spécifiques, nous construisons le programme ensemble."}
                            </p>
                            <div className="pt-2">
                                <Button asChild className="rounded-full bg-white text-stone-900 hover:bg-stone-100">
                                    <Link href="/contact">
                                        Créer mon séjour sur-mesure <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-1/3 w-full">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center">
                                <p className="text-stone-400 text-sm mb-4 uppercase tracking-wider">Durée flexible</p>
                                <div className="flex justify-center gap-4 text-white font-bold">
                                    <span>Week-end</span>
                                    <span className="text-stone-600">/</span>
                                    <span>Semaine</span>
                                    <span className="text-stone-600">/</span>
                                    <span>Séjour</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-stone-950 -z-0 opacity-50" />
                </div>

                {/* Activities List */}
                <div id="catalogue" className="space-y-8 pt-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-stone-900">Toutes les activités Multi</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Explorez notre catalogue de séjours et multi-activités.
                        </p>
                    </div>
                    <Suspense fallback={<div>Chargement...</div>}>
                        <ActivityFilterableList 
                            initialActivities={activities} 
                            hideFormatFilter={true}
                            hideElementFilter={false}
                            buttonText={cardButtonText}
                        />
                    </Suspense>
                </div>

                {/* Calendar */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-stone-900">Prochaines dates {title}</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Retrouvez ici toutes les sessions programmées pour ce format.
                        </p>
                    </div>
                    <EventsCalendar events={events} buttonText={cardButtonText} defaultFilter="multi" />
                </div>
            </div>
        </main>
    );
}
