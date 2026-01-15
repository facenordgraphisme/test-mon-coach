import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight, Waves, Zap, Sun } from "lucide-react";
import { PortableText } from '@portabletext/react';
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Suspense } from 'react';
import { ptComponents } from "@/components/PortableTextComponents";

// Fetch data for Duo Activités
async function getData() {
    // 1. Fetch Singleton Page Content
    let doc = await client.fetch(groq`*[_type == "duoActivitesPage"][0] {
        "title": heroTitle,
        "subtitle": heroSubtitle,
        "imageUrl": heroImage.asset->url,
        description,
        benefits,
        introTitle,
        introDescription,
        quote,
        favorites,
        smartDuos,
        smartDuosText,
        seo
    }`);

    // If doc is missing, use fallback
    if (!doc) {
        doc = {
            title: "Duo d'activités",
            subtitle: "Découvrez nos offres (Contenu à configurer dans Sanity)",
            description: [],
            benefits: [],
            imageUrl: null,
            seo: null,
            introTitle: "Les Duos",
            favorites: [],
            smartDuos: []
        };
    }

    // 2. Fetch Related Data (Activities, Events)
    const format = 'duo';
    const extraData = await client.fetch(groq`{
        "events": *[_type == "event" && status != 'cancelled' && dateTime(date) > dateTime(now()) && activity->format == $format] | order(date asc) {
            _id,
            title,
            date,
            status,
            maxParticipants,
            seatsAvailable,
            bookedCount,
            price,
            activity->{
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset->url,
                duration,
                difficulty->{ level, color }
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
            "upcomingEvents": *[_type == "event" && references(^._id) && date >= now()] | order(date asc) {
                price,
                difficulty->{ title, level, color }
            }
        }
    }`, { format });

    // 3. Fetch Site Settings for Card Button
    const settings = await client.fetch(groq`*[_type == "siteSettings"][0] { cardButtonText }`, {}, { next: { revalidate: 0 } });

    return { ...doc, ...extraData, cardButtonText: settings?.cardButtonText };
}

export async function generateMetadata(): Promise<Metadata> {
    const doc = await client.fetch(groq`* [_type == "duoActivitesPage"][0] {
    "title": heroTitle,
        description,
        "imageUrl": heroImage.asset -> url,
            seo
} `);

    if (doc?.seo) return generateSeoMetadata(doc.seo, {
        title: doc.title,
        description: "Aventure Duo Activités - Mon Coach Plein Air",
        url: `https://moncoachpleinair.com/aventures/duo-activites`
    });

    return {
        title: doc?.title || "Duo Activités",
        description: "Mon Coach Plein Air"
    };
}

export const revalidate = 60;

export default async function DuoActivitesPage() {
    const data = await getData();

    if (!data) {
        notFound();
    }

    const {
        title, subtitle, imageUrl, description, benefits, events, activities, seo,
        introTitle, introDescription, quote, favorites, smartDuos, smartDuosText, cardButtonText
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

                {/* INTRO DUO BLOCK (Restored Exact Original from User Snippet) */}
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Intro & Philosophy */}
                    <div className="text-center space-y-6">
                        {introTitle && <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{introTitle}</h2>}
                        {introDescription && (
                            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                                {introDescription}
                            </p>
                        )}
                        {quote && (
                            <blockquote className="italic border-l-4 border-[var(--brand-water)] pl-6 text-left md:text-center md:border-l-0 md:border-t-4 md:pt-6 text-stone-800 font-medium text-lg bg-stone-50 p-6 rounded-r-xl md:rounded-xl inline-block">
                                « {quote} »
                            </blockquote>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Combos List */}
                        <div className="space-y-6 p-8 bg-stone-50 rounded-3xl border border-stone-100">
                            <h3 className="font-bold text-stone-900 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Mes combinaisons favorites
                            </h3>
                            <ul className="space-y-4">
                                {favorites && favorites.length > 0 ? (
                                    favorites.map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="font-medium text-stone-700">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    ['Vélo + Escalade', 'Vélo + Via Ferrata', 'Vélo + Planche à voile'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="font-medium text-stone-700">{item}</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Duos Malins Box */}
                        <div className="space-y-6 p-8 bg-[var(--brand-water)] text-white rounded-3xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl flex items-center gap-2 mb-4">
                                    <Sun className="w-6 h-6 text-yellow-300" />
                                    Les Duos Malins !
                                </h3>
                                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                                    {smartDuosText || "Pour des après-midi rafraîchissantes..."}
                                </p>
                                <ul className="space-y-2 text-sm font-medium">
                                    {smartDuos && smartDuos.length > 0 ? (
                                        smartDuos.map((item: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> {item}
                                            </li>
                                        ))
                                    ) : (
                                        <>
                                            <li className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Vélo + Planche à voile
                                            </li>
                                            <li className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Via Ferrata + Canyon
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <Waves className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10" />
                        </div>
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
