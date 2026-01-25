import Link from "next/link";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";

async function getActivityTypes() {
    try {
        return await client.fetch(groq`
            *[_type == "homepage"][0].activityTypes[] {
                title,
                description,
                "imageUrl": image.asset->url,
                benefits,
                buttonText,
                buttonLink
            }
        `);
    } catch (e) {
        return null;
    }
}

interface ActivityFormatsProps {
    hideTitle?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
}

export async function ActivityFormats({ hideTitle = false, className = "", variant = 'default' }: ActivityFormatsProps) {
    const fetchedFormats = await getActivityTypes();

    let formats = (fetchedFormats && fetchedFormats.length > 0) ? fetchedFormats : [
        {
            title: "Le Mono-Activité",
            description: "Pour une expérience unique, concentrée. Découverte, perfectionnement ou juste profiter d’un moment autour d’un élément.",
            imageUrl: "/assets/IMG_9961.png",
            benefits: ["Roche : Escalade, Via Ferrata", "Eau : Canyon, Kayak, Voile", "Terre : VTT, Gravel, Route"],
            buttonText: "Découvrir",
            buttonLink: "/aventures/mono-activite"
        },
        {
            title: "Les Duos",
            description: "Combiner deux activités pour une immersion totale. Le vélo devient votre moyen d'accès privilégié aux sites d'exception.",
            imageUrl: "/assets/IMG_9739.png",
            benefits: ["Vélo + Escalade / Via Ferrata", "Vélo + Planche à voile", "Les Duos Malins : Fraîcheur & Eau"],
            buttonText: "Les Combinés",
            buttonLink: "/aventures/duo-activites"
        },
        {
            title: "Multi & Sur Mesure",
            description: "Construisons ensemble un week-end ou une semaine de folie. Pour un voyage local, sportif et 100% nature.",
            imageUrl: "/assets/IMG_9962.png",
            benefits: ["Programme à la carte", "Groupes & Événements", "100% Personnalisable"],
            buttonText: "Créer mon aventure",
            buttonLink: "/aventures/sur-mesure"
        }
    ];

    // Force link rewrite to ensure new routing works even with old Sanity data
    formats = formats.map((f: any) => {
        let newLink = f.buttonLink;
        if (f.title.toLowerCase().includes('mono')) newLink = "/aventures/mono-activite";
        if (f.title.toLowerCase().includes('duo')) newLink = "/aventures/duo-activites";
        if (f.title.toLowerCase().includes('sur') || f.title.toLowerCase().includes('multi')) newLink = "/aventures/sur-mesure";
        return { ...f, buttonLink: newLink };
    });

    return (
        <section id="formules" className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6">Nos Formules</h2>
                    <p className="text-lg text-stone-600">
                        Que vous soyez seul, en couple ou en groupe, nous avons le format qu'il vous faut.
                    </p>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 ${variant === 'compact' ? 'gap-6' : 'gap-8'}`}>
                    {formats.map((format: any, i: number) => (
                        <div key={i} className={`flex flex-col group rounded-3xl overflow-hidden border border-stone-200 bg-stone-50 hover:shadow-xl transition-all duration-300 ${variant === 'compact' ? 'hover:-translate-y-1' : ''}`}>
                            {/* Image Header */}
                            <div className="h-48 overflow-hidden relative bg-stone-200">
                                {format.imageUrl ? (
                                    <img
                                        src={format.imageUrl}
                                        alt={format.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${i === 0 ? 'from-emerald-100 to-emerald-200' : i === 1 ? 'from-orange-100 to-orange-200' : 'from-blue-100 to-blue-200'}`} />
                                )}
                            </div>

                            {/* Content */}
                            <div className={`${variant === 'compact' ? 'p-6' : 'p-8'} flex flex-col flex-1`}>
                                <h3 className={`${variant === 'compact' ? 'text-xl' : 'text-2xl'} font-bold text-stone-900 ${variant === 'compact' ? 'mb-2' : 'mb-3'} flex items-center gap-3`}>
                                    {/* Icon Mapping based on title */}
                                    {format.title.toLowerCase().includes('mono') && (
                                        <div className="w-10 h-10 rounded-full bg-[var(--brand-water)]/10 flex items-center justify-center text-[var(--brand-water)]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /></svg>
                                        </div>
                                    )}
                                    {format.title.toLowerCase().includes('duo') && (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                        </div>
                                    )}
                                    {format.title.toLowerCase().includes('multi') && (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" /></svg>
                                        </div>
                                    )}
                                    {format.title}
                                </h3>
                                {Array.isArray(format.description) ? (
                                    <div className={`text-stone-600 flex-1 ${variant === 'compact' ? 'text-sm leading-relaxed mb-4' : 'mb-6'}`}>
                                        <PortableText value={format.description} />
                                    </div>
                                ) : (
                                    <p className={`text-stone-600 flex-1 ${variant === 'compact' ? 'text-sm leading-relaxed mb-4' : 'mb-6'}`}>
                                        {format.description}
                                    </p>
                                )}

                                {/* Benefits List */}
                                {variant === 'default' && (
                                    <ul className="space-y-3 mb-8">
                                        {format.benefits && format.benefits.map((benefit: string, j: number) => (
                                            <li key={j} className="flex items-start gap-3 text-stone-900 font-medium text-base">
                                                <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-700">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <Button asChild className={`w-full ${variant === 'compact' ? 'h-10 text-xs' : ''}`}>
                                    <Link href={format.buttonLink || '/aventures'}>
                                        {format.buttonText || 'En savoir plus'}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
