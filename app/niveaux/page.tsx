import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { Check, Activity, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

async function getData() {
    const levels = await client.fetch(groq`
        *[_type == "difficulty"] | order(level asc) {
            level,
            title,
            color,
            description,
            fullDescription,
            prerequisites,
            effort,
            technique,
            engagement,
            goal
        }
    `);

    const pageContent = await client.fetch(groq`
        *[_type == "levelsPage"][0] {
            title,
            subtitle,
            "heroImageUrl": heroImage.asset->url,
            seo
        }
    `);

    return { levels, pageContent };
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await client.fetch(groq`*[_type == "levelsPage"][0] { seo }`);
    return generateSeoMetadata(data?.seo, {
        title: "Niveaux d'Engagement | Mon Coach Plein Air",
        description: "Comprendre les niveaux de difficulté : Découverte, Aventure et Warrior. Choisissez l'expérience adaptée à vos envies.",
        url: 'https://moncoachpleinair.com/niveaux'
    });
}

export default async function NiveauxPage() {
    const { levels, pageContent } = await getData();

    // Fallbacks
    const title = pageContent?.title || "3 Niveaux d'Engagement";
    const subtitle = pageContent?.subtitle || "Afin d’adapter au plus juste l'engagement physique, technique et mental de la sortie, je vous propose trois niveaux basés sur l'Effort, la Technique et l'Engagement.";
    const heroImage = pageContent?.heroImageUrl || 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=2000&auto=format&fit=crop';

    const customJsonLd = pageContent?.seo?.structuredData ? JSON.parse(pageContent.seo.structuredData) : null;

    return (
        <div className="min-h-screen bg-stone-50" suppressHydrationWarning>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([customJsonLd].filter(Boolean)) }}
            />
            {/* Header Section - Force Recompile */}
            <div className="bg-stone-900 text-white py-24 md:py-32 relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Background"
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                        <Activity className="w-4 h-4" />
                        <span>Guide des niveaux</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight text-center">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-300 max-w-3xl leading-relaxed font-light text-center mx-auto">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Levels Content */}
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-16 lg:space-y-32">
                {levels.map((lvl: any) => {
                    // Determine color scheme based on level color from Sanity (green, orange, red)
                    const isGreen = lvl.color === 'green';
                    const isOrange = lvl.color === 'orange';

                    const borderColor = isGreen ? 'border-emerald-200' : isOrange ? 'border-amber-200' : 'border-red-200';
                    const iconBg = isGreen ? 'bg-emerald-100' : isOrange ? 'bg-amber-100' : 'bg-red-100';
                    const iconColor = isGreen ? 'text-emerald-700' : isOrange ? 'text-amber-700' : 'text-red-700';
                    const headingColor = isGreen ? 'text-emerald-900' : isOrange ? 'text-amber-900' : 'text-red-900';

                    return (
                        <div key={lvl.level} className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

                            {/* Sticky Left Column: Title & Badge */}
                            <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col items-center text-center">
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg", iconBg, iconColor)}>
                                        {lvl.level}
                                    </div>
                                    <h2 className={cn("text-5xl font-bold tracking-tight", headingColor)}>
                                        {lvl.title}
                                    </h2>
                                </div>
                                <div className={cn("inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest bg-stone-100 text-stone-600 mb-6")}>
                                    {isGreen ? 'Initiation' : isOrange ? 'Progression' : 'Performance'}
                                </div>
                                <p className="text-stone-600 text-lg leading-relaxed max-w-md mx-auto">
                                    {lvl.fullDescription || lvl.description}
                                </p>
                            </div>

                            {/* Right Column: Details */}
                            <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                                <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150", iconBg)} />

                                <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">

                                    {/* Criteria List */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-stone-400" />
                                            Critères
                                        </h3>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-stone-900 min-w-[90px]">Effort :</span>
                                                <span className="text-stone-600">{lvl.effort || "Non spécifié"}</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-stone-900 min-w-[90px]">Technique :</span>
                                                <span className="text-stone-600">{lvl.technique || "Non spécifié"}</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-stone-900 min-w-[90px]">Engagement :</span>
                                                <span className="text-stone-600">{lvl.engagement || "Non spécifié"}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Prerequisites & Goal */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                                                <Check className="w-5 h-5 text-stone-400" />
                                                Pré-requis
                                            </h3>
                                            <p className="text-stone-600">
                                                {lvl.prerequisites || "Aucun pré-requis spécifique."}
                                            </p>
                                        </div>

                                        <div className={cn("p-6 rounded-2xl border-l-4", borderColor, isGreen ? "bg-emerald-50/50" : isOrange ? "bg-amber-50/50" : "bg-red-50/50")}>
                                            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
                                                <Heart className={cn("w-5 h-5", iconColor)} />
                                                L'esprit
                                            </h3>
                                            <p className="text-stone-700 italic">
                                                "{lvl.goal || "Profiter de l'instant."}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}


                {/* CTA */}
                <div className="mt-24 text-center bg-stone-900 rounded-3xl p-12 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold text-white">Prêt à choisir votre aventure ?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/aventures" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-stone-900 shadow hover:bg-stone-100 transition-colors">
                                Voir les aventures
                            </a>
                            <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                                Me contacter
                            </a>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 -ml-12 -mt-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute bottom-0 right-0 -mr-12 -mb-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                </div>
            </div>

            <SiteFooter />
        </div>
    );
}
