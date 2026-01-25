import { Gem, Leaf, Users, Layers, Timer, Mountain, Wind, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { PortableText } from "next-sanity";

interface FeaturesProps {
    data?: {
        featuresQuote?: string;
        featuresIntro?: any;
        featuresDuoTitle?: string;
        featuresDuoText?: any;
        featuresDuoSubtext?: any;
        featuresLuxeTitle?: string;
        featuresLuxeText?: any;
        featuresEcoTitle?: string;
        featuresEcoText?: any;
        featuresCtaText?: string;
        featuresCtaLink?: string;
    }
}

export function Features({ data }: FeaturesProps) {
    // Default values if data is not provided
    const d = data || {};
    const featuresQuote = d.featuresQuote || "Ici, je crée des sorties sportives comme on façonne une pièce artisanale : avec précision, créativité, sensibilité — et un profond respect pour la nature.";
    const featuresIntro = d.featuresIntro;
    const featuresDuoTitle = d.featuresDuoTitle || 'La Magie des "Duos"';
    const featuresDuoText = d.featuresDuoText || "La combinaison des activités rend l’expérience extraordinaire. En prenant le temps de s’immerger dans un élément (Roche, Eau, Terre) ou en créant des complémentarités magiques, l’aventure prend tout son sens.";
    const featuresDuoSubtext = d.featuresDuoSubtext || "Découvrez toutes les facettes des Hautes-Alpes : falaises, lacs, vallons sauvages, crêtes et cols mythiques.";
    const featuresLuxeTitle = d.featuresLuxeTitle || "Le Luxe des Sensations Pures";
    const featuresLuxeText = d.featuresLuxeText || "Pas de foule, pas de format standard. Juste vous, la nature, et un encadrement expert. Matériel haut de gamme, approche humaine et sécurisée. Le plaisir de se dépasser sans pression.";
    const featuresEcoTitle = d.featuresEcoTitle || "Intense & Responsable";
    const featuresEcoText = d.featuresEcoText || "Nos déplacements se font majoritairement à vélo ou à pied. Des activités locales pensées pour limiter l’impact écologique sans réduire l’intensité.\nMax de sensations, min d'empreinte.";
    const featuresCtaText = d.featuresCtaText || "Découvrir toutes les aventures";
    const featuresCtaLink = d.featuresCtaLink || "/aventures";

    return (
        <section className="py-24 bg-stone-50 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">

                {/* Header removed as per user request (moved to Hero) */}
                <div className="mb-16" />

                {/* Intro Text & Quote Centered */}
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-8">
                    <div className="prose prose-lg text-stone-700 mx-auto">
                        <p className="font-medium text-stone-900 italic text-2xl mb-4 relative inline-block">
                            "{featuresQuote}"
                        </p>
                        <div className="text-stone-600 leading-relaxed">
                            {featuresIntro ? (
                                <PortableText value={featuresIntro} />
                            ) : (
                                <p>
                                    Bienvenue à Rêves d’Aventures. Je vous accompagne en <strong>petits groupes</strong> (1 à 5 pers.) pour vivre des expériences authentiques.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                    {/* Pillar 1: Duo */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                            <Wind className="w-8 h-8 text-[var(--brand-water)]" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-4">{featuresDuoTitle}</h4>
                        <div className="text-stone-600 text-sm leading-relaxed mb-4">
                            {Array.isArray(featuresDuoText) ? <PortableText value={featuresDuoText} /> : featuresDuoText}
                        </div>
                        <div className="text-stone-400 text-xs mt-auto pt-4 border-t border-stone-50 w-full">
                            {Array.isArray(featuresDuoSubtext) ? <PortableText value={featuresDuoSubtext} /> : featuresDuoSubtext}
                        </div>
                    </div>

                    {/* Pillar 2: Luxe */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-rock)] to-[var(--brand-water)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                            <Gem className="w-8 h-8 text-[var(--brand-rock)]" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-4">{featuresLuxeTitle}</h4>
                        <div className="text-stone-600 text-sm leading-relaxed">
                            {Array.isArray(featuresLuxeText) ? <PortableText value={featuresLuxeText} /> : featuresLuxeText}
                        </div>
                    </div>

                    {/* Pillar 3: Eco */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                            <Leaf className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-4">{featuresEcoTitle}</h4>
                        <div className="text-stone-600 text-sm leading-relaxed">
                            {Array.isArray(featuresEcoText) ? <PortableText value={featuresEcoText} /> : <span className="whitespace-pre-line">{featuresEcoText}</span>}
                        </div>
                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="flex justify-center mt-12">
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-sm">
                        <Link href={featuresCtaLink || "/aventures"}>
                            {featuresCtaText} <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}
