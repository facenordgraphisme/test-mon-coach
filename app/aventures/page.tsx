import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { PageHero } from "@/components/PageHero";
import { Suspense } from 'react';
import { Mountain, Waves, Bike, Gem, Sun, Map, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getData() {
    return client.fetch(groq`{
        "activities": *[_type == "activity"] | order(_createdAt desc) {
            title,
            "slug": slug.current,
            format,
            "imageUrl": mainImage.asset->url,
            "upcomingEvents": *[_type == "event" && activity._ref == ^._id && date >= now()] {
                price,
                title,
                duration,
                difficulty->{
                    title,
                    level,
                    color
                }
            },
            "difficulties": difficulties[]->{
                title,
                level,
                color,
                description
            }
        },
        "pageContent": *[_type == "adventuresPage"][0] {
            heroTitle,
            heroSubtitle,
            heroLabel,
            "heroImage": heroImage.asset->url,
            monoTitle,
            monoDescription,
            monoButtonText,
            monoFeatures,
            duoTitle,
            duoDescription,
            duoQuote,
            duoButtonText,
            duoFavorites,
            duoMalins,
            duoMalinsText,
            multiTitle,
            multiDescription,
            multiButtonText
        }
    }`);
}

export const revalidate = 60;


export async function generateMetadata() {
    const pageContent = await client.fetch(groq`*[_type == "adventuresPage"][0] {
        seoTitle,
        seoDescription,
        "heroImage": heroImage.asset->url
    }`);

    if (!pageContent) return {};

    return {
        title: pageContent.seoTitle || "Nos Aventures | Mon Coach Plein Air",
        description: pageContent.seoDescription || "Mono, Duo ou Multi. Choisissez l'intensité...",
        openGraph: {
            images: pageContent.heroImage ? [pageContent.heroImage] : [],
        }
    }
}

export default async function ActivitiesPage() {
    const { activities, pageContent } = await getData();

    // Fallbacks if content is missing (prevents crash on first load before CMS entry)
    const content = pageContent || {
        heroTitle: "Nos Aventures",
        heroSubtitle: "Mono, Duo ou Multi. Choisissez l'intensité...",
        heroLabel: "EXPLOREZ",
        monoTitle: "Le Mono-Activité",
        monoButtonText: "Voir les Mono-Activités",
        duoTitle: "Les Duos",
        duoButtonText: "Tout savoir sur les Duos",
        multiTitle: "Aventures Multi & Week-end",
        multiButtonText: "Créer mon séjour sur-mesure"
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <PageHero
                title={content.heroTitle}
                subtitle={content.heroSubtitle}
                label={content.heroLabel}
                image={content.heroImage || "/assets/IMG_9526.JPG"}
            />

            <main className="flex-1">

                {/* 1. MONO ACTIVITÉ */}
                <section className="py-20 container mx-auto px-4 md:px-6 border-b border-stone-200">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                                <span className="bg-stone-100 p-2 rounded-lg"><Gem className="w-6 h-6 text-[var(--brand-water)]" /></span>
                                {content.monoTitle}
                            </h2>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                {content.monoDescription}
                            </p>
                            <div className="mt-8">
                                <Button asChild className="rounded-full bg-[var(--brand-water)] text-white hover:bg-[var(--brand-water)]/90">
                                    <Link href="/aventures/mono-activite">
                                        {content.monoButtonText} <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Dynamic Features if present, else fallback static */}
                            {content.monoFeatures && content.monoFeatures.length > 0 ? (
                                content.monoFeatures.map((feat: any, idx: number) => {
                                    const Icon = feat.icon === 'waves' ? Waves : feat.icon === 'bike' ? Bike : Mountain;
                                    const color = feat.icon === 'waves' ? 'text-[var(--brand-water)]' : feat.icon === 'bike' ? 'text-[var(--brand-rock)]' : 'text-stone-400';
                                    return (
                                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                            <Icon className={`w-8 h-8 mb-4 ${color}`} />
                                            <h3 className="font-bold text-stone-900 mb-2">{feat.title}</h3>
                                            <ul className="text-sm text-stone-600 space-y-1">
                                                {feat.items && feat.items.map((it: string, i: number) => <li key={i}>{it}</li>)}
                                            </ul>
                                        </div>
                                    )
                                })
                            ) : (
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
                </section>

                {/* 2. LES DUOS */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Intro & Philosophy */}
                            <div className="text-center space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{content.duoTitle}</h2>
                                <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                                    {content.duoDescription}
                                </p>
                                {content.duoQuote && (
                                    <blockquote className="italic border-l-4 border-[var(--brand-water)] pl-6 text-left md:text-center md:border-l-0 md:border-t-4 md:pt-6 text-stone-800 font-medium text-lg bg-stone-50 p-6 rounded-r-xl md:rounded-xl inline-block">
                                        « {content.duoQuote} »
                                    </blockquote>
                                )}
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="rounded-full border-[var(--brand-water)] text-[var(--brand-water)] hover:bg-[var(--brand-water)] hover:text-white">
                                        <Link href="/aventures/duo-activites">
                                            {content.duoButtonText} <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Combos List */}
                                <div className="space-y-6 p-8 bg-stone-50 rounded-3xl border border-stone-100">
                                    <h3 className="font-bold text-stone-900 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        Mes combinaisons favorites
                                    </h3>
                                    <ul className="space-y-4">
                                        {content.duoFavorites && content.duoFavorites.length > 0 ? (
                                            content.duoFavorites.map((item: string, i: number) => (
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
                                            {content.duoMalinsText || "Pour des après-midi rafraîchissantes..."}
                                        </p>
                                        <ul className="space-y-2 text-sm font-medium">
                                            {content.duoMalins && content.duoMalins.length > 0 ? (
                                                content.duoMalins.map((item: string, i: number) => (
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
                    </div>
                </section>

                {/* 3. MULTI / SUR MESURE */}
                <section className="py-20 container mx-auto px-4 md:px-6">
                    <div className="bg-stone-900 rounded-3xl overflow-hidden p-8 md:p-16 text-center md:text-left relative">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                                    <Map className="w-8 h-8 text-[var(--brand-rock)]" />
                                    {content.multiTitle}
                                </h2>
                                <p className="text-stone-300 text-lg leading-relaxed">
                                    {content.multiDescription}
                                </p>
                                <div className="pt-2">
                                    <Button asChild className="rounded-full bg-white text-stone-900 hover:bg-stone-100">
                                        <Link href="/aventures/sur-mesure">
                                            {content.multiButtonText} <ArrowRight className="ml-2 w-4 h-4" />
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
                </section>


                {/* CATALOGUE */}
                <section className="py-12 bg-stone-50 border-t border-stone-200">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-2xl font-bold mb-12 text-stone-900 text-center uppercase tracking-widest text-sm">
                            Catalogue complet
                        </h2>
                        <Suspense fallback={<div>Chargement...</div>}>
                            <ActivityFilterableList
                                initialActivities={activities}
                                hideElementFilter={true}
                                hiddenFormats={['multi']}
                            />
                        </Suspense>
                    </div>
                </section>

            </main>
            <SiteFooter />
        </div >
    )
}
