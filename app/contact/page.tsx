import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";



export async function generateMetadata(): Promise<Metadata> {
    const data = await client.fetch(groq`*[_type == "contactPage"][0] {
        seo
    }`);

    return generateSeoMetadata(data?.seo, {
        title: "Contact | Mon Coach Plein Air",
        description: "Une envie particulière ? Un projet de groupe ? Écrivez-nous, réponse rapide garantie.",
        url: 'https://moncoachpleinair.com/contact'
    });
}

async function getData() {
    return await client.fetch(groq`*[_type == "contactPage"][0] {
        heroTitle,
        heroSubtitle,
        heroLabel,
        "heroImage": heroImage.asset->url,
        phone,
        email,
        locationTitle,
        locationText,
        calendarPromoTitle,
        calendarPromoText,
        calendarPromoButtonText,
        seo
    }`, {}, { next: { revalidate: 10 } });
}

export default async function ContactPage() {
    const data = await getData() || {};
    const customJsonLd = data?.seo?.structuredData ? JSON.parse(data.seo.structuredData) : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([customJsonLd].filter(Boolean)) }}
            />
            <div className="min-h-screen flex flex-col bg-stone-50">
                <PageHero
                    title={data.heroTitle || "Contact"}
                    subtitle={data.heroSubtitle || "Une envie particulière ? Un projet de groupe ? Écrivez-nous, réponse rapide garantie."}
                    label={data.heroLabel || "ÉCHANGEZ"}
                    image={data.heroImage || "/assets/100_0099.JPG"}
                />

                <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Me contacter</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--brand-water)]/10 flex items-center justify-center text-[var(--brand-water)] shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">Téléphone</p>
                                            <p className="text-stone-500 hover:text-[var(--brand-water)] transition-colors">
                                                <a href={`tel:${(data.phone || "+33 6 00 00 00 00").replace(/\s/g, '')}`}>{data.phone || "+33 6 00 00 00 00"}</a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--brand-earth)]/10 flex items-center justify-center text-[var(--brand-earth)] shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">Email</p>
                                            <p className="text-stone-500 hover:text-[var(--brand-earth)] transition-colors">
                                                <a href={`mailto:${data.email || "contact@moncoachpleinair.com"}`}>{data.email || "contact@moncoachpleinair.com"}</a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[var(--brand-rock)]/10 flex items-center justify-center text-[var(--brand-rock)] shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">{data.locationTitle || "Localisation"}</p>
                                            <p className="text-stone-500 whitespace-pre-line">
                                                {data.locationText || "Hautes-Alpes, France\n(Briançon, Embrun, Gap)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-stone-50 rounded-2xl">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5" />
                                    {data.calendarPromoTitle || "Déjà une date en tête ?"}
                                </h4>
                                <p className="text-sm text-stone-600 mb-4 px-1">
                                    {data.calendarPromoText || "Vérifiez d'abord si une sortie est déjà programmée dans le calendrier."}
                                </p>
                                <Button asChild variant="outline" className="w-full bg-white">
                                    <Link href="/calendrier">{data.calendarPromoButtonText || "Voir le calendrier"}</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Envoyer un message</h3>
                            <ContactForm />
                        </div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </>
    )
}
