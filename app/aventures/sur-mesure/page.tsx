import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { Map, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PortableText } from '@portabletext/react';
import { ptComponents } from "@/components/PortableTextComponents";

async function getData() {
    // 1. Fetch Singleton Page Content
    const doc = await client.fetch(groq`*[_type == "surMesurePage"][0] {
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
        return {
            title: "Sur-mesure",
            subtitle: "Créez votre aventure (Contenu à configurer dans Sanity)",
            description: [
                {
                    _type: 'block',
                    children: [
                        {
                            _type: 'span',
                            text: 'Votre texte de description apparaîtra ici. Remplissez le champ "Description Principale" dans Sanity pour le personnaliser.',
                        },
                    ],
                },
            ],
            benefits: ["Accompagnement personnalisé", "Programme flexible", "Souvenirs inoubliables"],
            imageUrl: null,
            seo: null,
            introTitle: "Aventures Multi & Week-end",
            introDescription: "Pour les projets multi-activités, les groupes ou les demandes spécifiques, nous construisons le programme ensemble."
        };
    }

    return doc;
}

export async function generateMetadata(): Promise<Metadata> {
    const doc = await client.fetch(groq`*[_type == "surMesurePage"][0] {
        "title": heroTitle,
        description,
        "imageUrl": heroImage.asset->url,
        seo
    }`);

    if (doc?.seo) return generateSeoMetadata(doc.seo, {
        title: doc.title,
        description: "Aventure Sur-Mesure - Mon Coach Plein Air",
        url: `https://moncoachpleinair.com/aventures/sur-mesure`
    });

    return {
        title: doc?.title || "Sur-Mesure",
        description: "Mon Coach Plein Air"
    };
}

export const revalidate = 60;

export default async function SurMesurePage() {
    const data = await getData();

    if (!data) {
        notFound();
    }

    const { title, subtitle, imageUrl, description, benefits, seo, introTitle, introDescription } = data;
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

                {/* Description (Restored) */}
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

                {/* DARK MULTI / SUR MESURE BLOCK (Restored Style) */}
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
            </div>
        </main>
    );
}
