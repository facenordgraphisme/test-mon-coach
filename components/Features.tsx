import Link from "next/link"
import { Calendar, Mountain, Users, Heart, Star, Shield } from "lucide-react"
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

// Icon mapping
const iconMap: Record<string, any> = {
    users: Users,
    mountain: Mountain,
    calendar: Calendar,
    heart: Heart,
    star: Star,
    shield: Shield,
    // default
    default: Users
};

async function getFeatures() {
    try {
        return await client.fetch(groq`
            *[_type == "homepage"][0].features
        `);
    } catch (e) {
        return null;
    }
}

export async function Features() {
    const fetchedFeatures = await getFeatures();

    const defaultFeatures = [
        {
            icon: "users",
            title: "Petits Groupes",
            description: "De 1 à 5 personnes maximum pour une expérience privilégiée et sécurisée."
        },
        {
            icon: "mountain",
            title: "Sur Mesure",
            description: "Des sorties adaptées à votre niveau : Découverte, Aventure ou Warrior."
        },
        {
            icon: "calendar",
            title: "Flexibilité",
            description: "Choisissez votre date et votre activité directement sur le calendrier en ligne."
        }
    ];

    const features = (fetchedFeatures && fetchedFeatures.length > 0) ? fetchedFeatures : defaultFeatures;

    return (
        <section className="py-24 bg-stone-50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature: any, i: number) => {
                        const IconComponent = iconMap[feature.icon] || iconMap.default;

                        return (
                            <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
                                <div className="p-3 bg-stone-50 rounded-full text-[var(--brand-rock)]">
                                    <IconComponent className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold tracking-tight text-stone-900">{feature.title}</h3>
                                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
