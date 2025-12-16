import Link from "next/link";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

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
            title: "Mono-Activité",
            description: "Profitez d'une séance dédiée pour découvrir ou vous perfectionner.",
            imageUrl: "/assets/IMG_9961.png",
            benefits: ["Technique approfondie", "Progression rapide", "Focus total"],
            buttonText: "Découvrir",
            buttonLink: "/aventures/mono-activite"
        },
        {
            title: "Duo d'activités",
            description: "Pourquoi choisir ? Combinez les plaisirs pour une journée variée et complète.",
            imageUrl: "/assets/IMG_9739.png",
            benefits: ["Variété des paysages", "Journée complète", "Ludique et sportif"],
            buttonText: "Les combos",
            buttonLink: "/aventures/duo-activites"
        },
        {
            title: "Sur Mesure",
            description: "Votre projet, vos règles. Nous construisons ensemble l'aventure de vos rêves (Multi, Groupes, Événements).",
            imageUrl: "/assets/IMG_9962.png",
            benefits: ["Date flexible", "Lieu au choix", "Niveau adapté"],
            buttonText: "Contacter",
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
        <section className="py-24 bg-white">
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
                                <h3 className={`${variant === 'compact' ? 'text-xl' : 'text-2xl'} font-bold text-stone-900 ${variant === 'compact' ? 'mb-2' : 'mb-3'}`}>{format.title}</h3>
                                <p className={`text-stone-600 flex-1 ${variant === 'compact' ? 'text-sm leading-relaxed mb-4' : 'mb-6'}`}>
                                    {format.description}
                                </p>

                                {/* Benefits List */}
                                {variant === 'default' && (
                                    <ul className="space-y-3 mb-8">
                                        {format.benefits && format.benefits.map((benefit: string, j: number) => (
                                            <li key={j} className="flex items-start gap-3 text-stone-700 text-sm">
                                                <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-700">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <Button asChild className={`w-full bg-[var(--brand-rock)] hover:bg-stone-800 text-white rounded-full ${variant === 'compact' ? 'h-10 text-sm' : 'h-12'}`}>
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
