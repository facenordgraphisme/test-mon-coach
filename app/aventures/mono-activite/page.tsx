import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { CheckCircle2, Gem, Mountain, Waves, Bike } from "lucide-react";
import { PortableText } from '@portabletext/react';
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Suspense } from 'react';
import { ptComponents } from "@/components/PortableTextComponents";

// Fetch data for Mono Activité
async function getData() {
    // 1. Fetch Singleton Page Content
    let doc = await client.fetch(groq`*[_type == "monoActivitePage"][0] {
        "title": heroTitle,
        "subtitle": heroSubtitle,
        "imageUrl": heroImage.asset->url,
        description,
        benefits,

        // Intro fields
        introTitle,
        introDescription,
        introFeatures,

        seo
    }`);

    // If doc is missing, use fallback
    if (!doc) {
        doc = {
            title: "Mono-activité",
            subtitle: "Découvrez nos offres (Contenu à configurer dans Sanity)",
            description: [],
            benefits: [],
            imageUrl: null,
            seo: null,
            introTitle: "Le Mono-activité",
            introFeatures: []
        };
    }

    // 2. Fetch Related Data (Activities, Events)
    const format = 'mono';
    const extraData = await client.fetch(groq`
        {
            "events": *[_type == "event" && status != 'cancelled' && dateTime(date) > dateTime(now()) && activity->format == $format] | order(date asc) {
                _id,
                title,
                date,
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
    const doc = await client.fetch(groq`*[_type == "monoActivitePage"][0] {
        "title": heroTitle,
        description,
        "imageUrl": heroImage.asset->url,
        seo
    }`);

    if (doc?.seo) return generateSeoMetadata(doc.seo, {
        title: doc.title,
        description: "Aventure Mono-activité - Mon Coach Plein Air",
        url: `https://moncoachpleinair.com/aventures/mono-activite`
    });

    return {
        title: doc?.title || "Mono-activité",
        description: "Mon Coach Plein Air"
    };
}

export const revalidate = 60;

export default async function MonoActivitePage() {
    const data = await getData();

    if (!data) {
        notFound();
    }

    const {
        title, subtitle, imageUrl, description, benefits, events, activities, seo,
        introTitle, introDescription, introFeatures, cardButtonText
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
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
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

                {/* INTRO MONO BLOCK (Restored) */}
                <div className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
                    {/* LEFT: Text Content */}
                    <div className="md:w-1/3 space-y-6">
                        {introTitle && (
                            <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                                <span className="bg-stone-100 p-2 rounded-lg">
                                    <Gem className="w-6 h-6 text-[var(--brand-water)]" />
                                </span>
                                {introTitle}
                            </h2>
                        )}
                        {introDescription && (
                            <p className="text-lg text-stone-600 leading-relaxed">
                                {introDescription}
                            </p>
                        )}
                    </div>

                    {/* RIGHT: 3 Elements Grid */}
                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {introFeatures && introFeatures.length > 0 ? (
                            introFeatures.map((block: any, idx: number) => {
                                // Icon logic mapping
                                let Icon = Mountain;
                                let colorClass = 'text-stone-400';

                                if (block.icon === 'waves') {
                                    Icon = Waves;
                                    colorClass = 'text-[var(--brand-water)]';
                                } else if (block.icon === 'bike') {
                                    Icon = Bike;
                                    colorClass = 'text-[var(--brand-rock)]';
                                } else if (block.icon === 'mountain') {
                                    Icon = Mountain;
                                    colorClass = 'text-stone-400';
                                }

                                return (
                                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                        <Icon className={`w-8 h-8 mb-4 ${colorClass}`} />
                                        <h3 className="font-bold text-stone-900 mb-2">{block.title}</h3>
                                        {block.items && (
                                            <ul className="text-sm text-stone-600 space-y-1">
                                                {block.items.map((item: string, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            /* Fallback Static Cards if CMS empty */
                            <>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                    <Mountain className="w-8 h-8 text-stone-400 mb-4" />
                                    <h3 className="font-bold text-stone-900 mb-2">Roche</h3>
                                    <ul className="text-sm text-stone-600 space-y-1">
                                        <li>Escalade</li>
                                        <li>Via Ferrata</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                    <Waves className="w-8 h-8 text-[var(--brand-water)] mb-4" />
                                    <h3 className="font-bold text-stone-900 mb-2">Eau</h3>
                                    <ul className="text-sm text-stone-600 space-y-1">
                                        <li>Canyon</li>
                                        <li>Planche à voile</li>
                                        <li>Kayak</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                    <Bike className="w-8 h-8 text-[var(--brand-rock)] mb-4" />
                                    <h3 className="font-bold text-stone-900 mb-2">Terre</h3>
                                    <ul className="text-sm text-stone-600 space-y-1">
                                        <li>VTT</li>
                                        <li>Vélo de route</li>
                                        <li>Gravel</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Concept & Benefits */}
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Description */}
                    <div className="prose prose-stone text-lg md:text-xl text-stone-700 text-center mx-auto">
                        <PortableText value={description} components={ptComponents} />
                    </div>

                    {/* Benefits List */}
                    {benefits && benefits.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                            <h3 className="text-xl font-bold mb-6 text-center text-stone-900">Pourquoi choisir cette formule ?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {benefits.map((benefit: string, i: number) => (
                                    <div key={i} className="flex flex-col items-center text-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[var(--brand-water)]/10 text-[var(--brand-water)] flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <p className="font-medium text-stone-800">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Activities List */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-stone-900">Toutes les activités {title}</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Explorez notre catalogue complet.
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
                    <EventsCalendar events={events} buttonText={cardButtonText} />
                </div>
            </div>
        </main>
    );
}
