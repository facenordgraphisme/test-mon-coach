import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteFooter } from "@/components/SiteFooter";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <PageHero
                title="Contact"
                subtitle="Une envie particulière ? Un projet de groupe ? Écrivez-nous, réponse rapide garantie."
                label="ÉCHANGEZ"
                image="/assets/100_0099.JPG"
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
                                            <a href="tel:+33600000000">+33 6 00 00 00 00</a>
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
                                            <a href="mailto:contact@moncoachpleinair.com">contact@moncoachpleinair.com</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--brand-rock)]/10 flex items-center justify-center text-[var(--brand-rock)] shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-stone-900">Localisation</p>
                                        <p className="text-stone-500">
                                            Hautes-Alpes, France<br />
                                            (Briançon, Embrun, Gap)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50 rounded-2xl">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5" />
                                Déjà une date en tête ?
                            </h4>
                            <p className="text-sm text-stone-600 mb-4">
                                Vérifiez d'abord si une sortie est déjà programmée dans le calendrier.
                            </p>
                            <Button asChild variant="outline" className="w-full bg-white">
                                <Link href="/calendrier">Voir le calendrier</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Envoyer un message</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstname" className="text-sm font-medium text-stone-700">Prénom</label>
                                    <Input id="firstname" placeholder="Jean" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastname" className="text-sm font-medium text-stone-700">Nom</label>
                                    <Input id="lastname" placeholder="Dupont" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                                <Input id="email" type="email" placeholder="jean.dupont@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-stone-700">Sujet</label>
                                {/* Native select correctly used with Tailwind classes */}
                                <select
                                    id="subject"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="info">Demande d'information</option>
                                    <option value="booking">Privatisation / Groupe</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-stone-700">Message</label>
                                <Textarea id="message" placeholder="Bonjour, je souhaite organiser une sortie pour..." className="min-h-[150px]" />
                            </div>

                            <Button className="w-full bg-stone-900 hover:bg-stone-800" size="lg">
                                Envoyer
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
