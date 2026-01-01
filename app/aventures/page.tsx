import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { PageHero } from "@/components/PageHero";
import { Suspense } from 'react';
import { Mountain, Waves, Bike, Gem, Sun, Map, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getActivities() {
    return client.fetch(groq`
        *[_type == "activity"] | order(_createdAt desc) {
            title,
            "slug": slug.current,
            format,
            // Fetch prices of upcoming events to determine "from" price
            "upcomingEvents": *[_type == "event" && activity._ref == ^._id && date >= now()] {
                price,
                duration,
                difficulty->{
                    title,
                    level,
                    color
                }
            }
        }
    `);
}

export const revalidate = 60;

export default async function ActivitiesPage() {
    const activities = await getActivities();

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <PageHero
                title="Nos Aventures"
                subtitle="Mono, Duo ou Multi. Choisissez l'intensité, l'élément et le format qui vous correspond pour vivre les Hautes-Alpes intensément."
                label="EXPLOREZ"
                image="/assets/IMG_9526.JPG"
            />

            <main className="flex-1">

                {/* 1. MONO ACTIVITÉ */}
                <section className="py-20 container mx-auto px-4 md:px-6 border-b border-stone-200">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                                <span className="bg-stone-100 p-2 rounded-lg"><Gem className="w-6 h-6 text-[var(--brand-water)]" /></span>
                                Le Mono-Activité
                            </h2>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                Découvrir, vous perfectionner ou juste profiter d’un moment autour d’une activité, d’un élément.
                                Pour une expérience unique, concentrée.
                            </p>
                            <div className="mt-8">
                                <Button asChild className="rounded-full bg-[var(--brand-water)] text-white hover:bg-[var(--brand-water)]/90">
                                    <Link href="/aventures/mono-activite">
                                        Voir les Mono-Activités <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Roche */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                <Mountain className="w-8 h-8 text-stone-400 mb-4" />
                                <h3 className="font-bold text-stone-900 mb-2">Roche</h3>
                                <ul className="text-sm text-stone-600 space-y-1">
                                    <li>Escalade</li>
                                    <li>Via Ferrata</li>
                                </ul>
                            </div>
                            {/* Eau */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                <Waves className="w-8 h-8 text-[var(--brand-water)] mb-4" />
                                <h3 className="font-bold text-stone-900 mb-2">Eau</h3>
                                <ul className="text-sm text-stone-600 space-y-1">
                                    <li>Canyon</li>
                                    <li>Planche à voile</li>
                                    <li>Kayak</li>
                                </ul>
                            </div>
                            {/* Terre */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                <Bike className="w-8 h-8 text-[var(--brand-rock)] mb-4" />
                                <h3 className="font-bold text-stone-900 mb-2">Terre</h3>
                                <ul className="text-sm text-stone-600 space-y-1">
                                    <li>VTT</li>
                                    <li>Vélo de route</li>
                                    <li>Gravel</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. LES DUOS */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Intro & Philosophy */}
                            <div className="text-center space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Les Duos</h2>
                                <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                                    Combiner deux activités pour une expérience plus immersive, en harmonie avec la nature, et pousser un peu plus loin l’engagement physique.
                                </p>
                                <blockquote className="italic border-l-4 border-[var(--brand-water)] pl-6 text-left md:text-center md:border-l-0 md:border-t-4 md:pt-6 text-stone-800 font-medium text-lg bg-stone-50 p-6 rounded-r-xl md:rounded-xl inline-block">
                                    « Le but c’est le chemin ! »
                                </blockquote>
                                <p className="text-stone-600">
                                    Ici le vélo est utilisé comme un fabuleux moyen d’accéder aux sites d’escalade, de via ferrata ou encore au lac pour y naviguer. <br />
                                    Selon votre condition physique et votre envie, choisissez le musculaire ou l’assistance électrique.
                                </p>
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="rounded-full border-[var(--brand-water)] text-[var(--brand-water)] hover:bg-[var(--brand-water)] hover:text-white">
                                        <Link href="/aventures/duo-activites">
                                            Tout savoir sur les Duos <ArrowRight className="ml-2 w-4 h-4" />
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
                                        {['Vélo + Escalade', 'Vélo + Via Ferrata', 'Vélo + Planche à voile'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-stone-700">{item}</span>
                                            </li>
                                        ))}
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
                                            Pour des après-midi rafraîchissantes. En été, on profite de la fraîcheur du matin pour rouler ou grimper, et dès que le vent se lève... Allons dans l’eau !
                                        </p>
                                        <ul className="space-y-2 text-sm font-medium">
                                            <li className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Vélo + Planche à voile
                                            </li>
                                            <li className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Via Ferrata + Canyon
                                            </li>
                                            <li className="flex items-center gap-2 text-white/80">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" /> Escalade + Planche à voile
                                            </li>
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
                                    Aventures Multi & Week-end
                                </h2>
                                <p className="text-stone-300 text-lg leading-relaxed">
                                    Construisons ensemble un week-end ou une semaine de folie dans les Hautes-Alpes, en adaptant le programme à vos envies.
                                    Pour un voyage local, sportif, sur mesure et en pleine nature.
                                </p>
                                <div className="pt-2">
                                    <Button asChild className="rounded-full bg-white text-stone-900 hover:bg-stone-100">
                                        <Link href="/aventures/sur-mesure">
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
                </section>


                {/* CATALOGUE */}
                <section className="py-12 bg-stone-50 border-t border-stone-200">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-2xl font-bold mb-12 text-stone-900 text-center uppercase tracking-widest text-sm">
                            Catalogue complet
                        </h2>
                        <Suspense fallback={<div>Chargement...</div>}>
                            <ActivityFilterableList initialActivities={activities} />
                        </Suspense>
                    </div>
                </section>

            </main>
            <SiteFooter />
        </div >
    )
}
