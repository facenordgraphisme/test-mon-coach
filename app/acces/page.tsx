import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { PortableText } from '@portabletext/react';
import { Train, Car, Plane, MapPin, ArrowRight, Home, Bus, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

async function getAccessPageData() {
    return client.fetch(groq`
        *[_type == "accessPage"][0] {
            title,
            intro,
            accessMethods,
            accommodations[] {
                name,
                description,
                type,
                link,
                "imageUrl": image.asset->url
            },
            seo
        }
    `, {}, { next: { revalidate: 10 } });
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await client.fetch(groq`*[_type == "accessPage"][0] { seo }`);
    return generateSeoMetadata(data?.seo, {
        title: "Accès & Hébergement | Mon Coach Plein Air",
        description: "Toutes les informations pour nous rejoindre dans les Hautes-Alpes et préparer votre séjour.",
        url: 'https://moncoachpleinair.com/acces'
    });
}

// Icon mapper helper
const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
        case 'train': return <Train className="w-6 h-6" />;
        case 'car': return <Car className="w-6 h-6" />;
        case 'bus': return <Bus className="w-6 h-6" />;
        case 'plane': return <Plane className="w-6 h-6" />;
        default: return <Info className="w-6 h-6" />;
    }
}



import { ptComponents } from "@/components/PortableTextComponents";

// ... (existing imports)

export default async function AccessPage() {
    const data = await getAccessPageData();
    console.log("Access Page Data:", JSON.stringify(data, null, 2)); // Debugging

    // Fallback title if document not created
    const pageTitle = data?.title || "Accès & Hébergements";
    const customJsonLd = data?.seo?.structuredData ? JSON.parse(data.seo.structuredData) : null;

    // determine if we have custom methods
    const hasCustomMethods = data?.accessMethods && data.accessMethods.length > 0;

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            {/* ... script ... */}
            <PageHero
                title={pageTitle}
                subtitle="Toutes les informations pour nous rejoindre dans les Hautes-Alpes et préparer votre séjour."
                label="PRATIQUE"
                image="/assets/IMG_2030.JPG"
            />

            <main className="flex-1">

                {/* Intro / Access Section */}
                <section className="py-16 md:py-24 container px-4 md:px-6 mx-auto">
                    {data?.intro && (
                        <div className="prose prose-stone text-lg md:text-xl text-stone-700 text-center mx-auto max-w-4xl mb-20">
                            <PortableText value={data.intro} components={ptComponents} />
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                            <MapPin className="w-8 h-8 text-[var(--brand-water)]" />
                            Comment venir ?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hasCustomMethods ? (
                            data.accessMethods.map((method: any, i: number) => (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 items-start flex gap-6 hover:shadow-md transition-shadow">
                                    <div className="bg-stone-50 p-4 rounded-xl text-[var(--brand-rock)] shrink-0">
                                        {getIcon(method.icon || 'train')}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900">{method.title}</h3>
                                        <div className="text-stone-600 leading-relaxed text-sm prose prose-sm prose-stone">
                                            {method.description ? (
                                                <PortableText value={method.description} components={ptComponents} />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Default content if no data found
                            <>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex gap-6 items-start">
                                    <div className="bg-stone-50 p-4 rounded-xl text-[var(--brand-rock)] shrink-0"><Train className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900">Train de nuit</h3>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            Départ <strong>Paris Austerlitz</strong> (20h50) ➜ Arrivée <strong>Briançon</strong> (8h30).<br />
                                            Le moyen le plus écologique et dépaysant. Réveillez-vous face aux sommets.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex gap-6 items-start">
                                    <div className="bg-stone-50 p-4 rounded-xl text-[var(--brand-rock)] shrink-0"><Train className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900">Train TER / TGV</h3>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            <strong>Marseille ➜ Briançon</strong> : 4h30 de trajet à travers les Alpes de Haute-Provence.<br />
                                            <strong>Paris ➜ Oulx (Italie)</strong> : TGV (4h30) puis navette (30min) jusqu'à Briançon.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex gap-6 items-start">
                                    <div className="bg-stone-50 p-4 rounded-xl text-[var(--brand-rock)] shrink-0"><Car className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900">Voiture</h3>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            Depuis le Nord : Via <strong>Grenoble</strong> et le Col du Lautaret.<br />
                                            Depuis le Sud : Via <strong>Gap</strong> et Embrun.<br />
                                            <span className="text-stone-400 italic text-xs mt-1 block">Attention : Équipements hiver obligatoires du 1er novembre au 31 mars.</span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Separator */}
                <div className="container mx-auto px-4"><div className="border-t border-stone-200"></div></div>

                {/* Accommodations Section */}
                <section className="bg-stone-50 py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3 mb-4">
                                <Home className="w-8 h-8 text-[var(--brand-earth)]" />
                                Où dormir ?
                            </h2>
                            <p className="text-stone-600 max-w-2xl">
                                Une sélection d'hébergements partenaires que nous recommandons pour leur accueil, leur confort et leur situation géographique.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data?.accommodations?.map((place: any, i: number) => (
                                <div key={i} className="group bg-white overflow-hidden rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                                    <div className="relative h-56 bg-stone-200 overflow-hidden">
                                        {place.imageUrl ? (
                                            <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                                                <Home className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
                                            {place.type || 'Hébergement'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-bold text-xl mb-3 text-stone-900 group-hover:text-[var(--brand-water)] transition-colors">{place.name}</h3>
                                        <p className="text-stone-600 text-sm mb-6 leading-relaxed flex-1">{place.description}</p>
                                        {place.link && (
                                            <Button asChild variant="outline" className="w-full justify-between items-center border-stone-200 hover:border-[var(--brand-water)] hover:text-[var(--brand-water)] hover:bg-white">
                                                <Link href={place.link} target="_blank">
                                                    Visiter le site <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {!data?.accommodations && (
                                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-stone-300">
                                    <p className="text-stone-500 mb-2">Pas encore d'hébergements listés.</p>
                                    <p className="text-sm text-stone-400">Cette section sera mise à jour prochainement avec nos meilleures adresses.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    )
}
