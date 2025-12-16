import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";

async function getGuideProfile() {
    return client.fetch(groq`
        *[_type == "guide"][0] {
            name,
            bio,
            diplomas,
            "imageUrl": image.asset->url,
            "photos": photos[].asset->url
        }
    `);
}

export const revalidate = 60;

export default async function GuidePage() {
    const guide = await getGuideProfile();

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            {/* Hero Profile */}
            <div className="bg-[var(--brand-water)] text-white py-24 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold">Votre Guide</h1>
                    <p className="text-xl md:text-2xl font-light text-stone-300 max-w-2xl mx-auto italic">
                        "Vivre la nature avec passion, sécurité et authenticité."
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 md:px-6 -mt-12 mb-12 max-w-5xl">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-5">
                        {/* Image Side */}
                        <div className="md:col-span-2 bg-stone-200 h-[400px] md:h-auto relative">
                            {guide?.imageUrl ? (
                                <img
                                    src={guide.imageUrl}
                                    alt={guide.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                // Fallback Placeholder if no image in Sanity
                                <div className="absolute inset-0 w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
                                    <span className="text-9xl opacity-20">🧗</span>
                                </div>
                            )}
                        </div>

                        {/* Content Side */}
                        <div className="md:col-span-3 p-8 md:p-12 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-stone-900">
                                    {guide?.name || "Le Coach"}
                                </h2>
                                <div className="h-1 w-20 bg-[var(--brand-water)] rounded-full"></div>
                            </div>

                            <div className="prose prose-stone text-stone-600">
                                {/* Simplified Bio rendering */}
                                {guide?.bio ? (
                                    Array.isArray(guide.bio) ? (
                                        guide.bio.map((block: any, i: number) => (
                                            <p key={i}>{block.children?.map((c: any) => c.text).join('')}</p>
                                        ))
                                    ) : <p>Biographie en cours de rédaction.</p>
                                ) : (
                                    <div className="space-y-4">
                                        <p>
                                            Depuis plus de trente ans, je vis les activités de pleine nature comme un véritable art de vivre.
                                        </p>
                                        <p>
                                            Ancien sportif de haut niveau en canoë-kayak, j’ai toujours cherché l’équilibre entre pratique personnelle et plaisir de la transmission.
                                            Au fil des années, j’ai développé une expertise sur la conception et l’encadrement d’expériences insolites et sur mesure.
                                        </p>
                                        <p>
                                            Mon rôle : créer pour vous des expériences qui vous ressemblent, dans l’un des plus beaux terrains de jeu du monde.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-sm">Diplômes & Certifications</h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide?.diplomas ? guide.diplomas.map((d: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-stone-100 hover:bg-stone-200 text-stone-700">
                                            {d}
                                        </Badge>
                                    )) : (
                                        <>
                                            <Badge variant="secondary">BEES 1° Escalade/Canyon</Badge>
                                            <Badge variant="secondary">BEES 1° Voile</Badge>
                                            <Badge variant="secondary">BEES 1° Canoë-kayak</Badge>
                                            <Badge variant="secondary">BEES 1° Cyclisme / VTT</Badge>
                                            <Badge variant="secondary">Licence STAPS</Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        {guide?.photos && guide.photos.length > 0 && (
                            <div className="md:col-span-5 p-8 md:p-12 border-t border-stone-100 bg-stone-50">
                                <h3 className="font-bold text-stone-900 mb-6 uppercase tracking-wider text-sm center">En action</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {guide.photos.map((photo: string, index: number) => (
                                        <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <img src={photo} alt={`Guide photo ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
