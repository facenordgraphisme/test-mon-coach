import { Gem, Leaf, Users, Layers, Timer, Mountain, Wind, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { PortableText } from "next-sanity";

interface FeaturesProps {
    data?: {
        featuresQuote?: string;
        featuresIntro?: any;
        featuresDuoTitle?: string;
        featuresDuoText?: string;
        featuresDuoSubtext?: string;
        featuresLuxeTitle?: string;
        featuresLuxeText?: string;
        featuresEcoTitle?: string;
        featuresEcoText?: string;
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

                {/* Main Manifesto - Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                    <div className="space-y-6 text-stone-700 leading-relaxed text-lg">
                        <p className="font-medium text-stone-900 italic text-xl border-l-4 border-[var(--brand-water)] pl-6">
                            "{featuresQuote}"
                        </p>
                        <div className="prose prose-lg text-stone-700">
                            {featuresIntro ? (
                                <PortableText value={featuresIntro} />
                            ) : (
                                <p>
                                    Bienvenue à Rêves d’Aventures. Je vous accompagne en <strong>petits groupes</strong> (1 à 5 pers.) pour vivre des expériences authentiques.
                                    Escalade, via ferrata, canyoning, VTT, gravel... sont les moyens idéaux pour cheminer à travers les éléments et s’émerveiller.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 space-y-4">
                        <h4 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                            <Wind className="w-5 h-5 text-[var(--brand-water)]" />
                            {featuresDuoTitle}
                        </h4>
                        <p className="text-stone-600">
                            {featuresDuoText}
                        </p>
                        <p className="text-stone-500 text-sm pt-2">
                            {featuresDuoSubtext}
                        </p>
                    </div>
                </div>

                {/* The Pillars - Flex/Grid centered */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                    {/* Pillar 1: Luxe */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Gem className="w-6 h-6 text-[var(--brand-rock)]" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-3">{featuresLuxeTitle}</h4>
                        <p className="text-stone-600 text-sm leading-relaxed">
                            {featuresLuxeText}
                        </p>
                    </div>

                    {/* Pillar 2: Eco (formerly 3) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100 group">
                        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 mb-3">{featuresEcoTitle}</h4>
                        <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                            {featuresEcoText}
                        </p>
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
