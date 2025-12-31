import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, Mail, MapPin, Phone, Train, Car } from "lucide-react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

async function getAccessData() {
    return client.fetch(groq`
        *[_type == "accessPage"][0] {
            "accessMethods": accessMethods[0...3] {
                title,
                icon
            }
        }
    `);
}

export async function SiteFooter() {
    const currentYear = new Date().getFullYear();
    const accessData = await getAccessData();

    return (
        <footer className="bg-stone-950 text-stone-300 py-16 md:py-24 border-t border-stone-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <Link href="/" className="block relative h-16 w-32 mb-6">
                            <Image
                                src="/assets/logo-v2.png"
                                alt="Mon Coach Plein Air"
                                fill
                                className="object-contain object-left brightness-0 invert opacity-90"
                            />
                        </Link>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
                            Des expériences exclusives en Hautes-Alpes, pensées pour vous reconnecter à la nature.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-semibold tracking-wide">Navigation</h4>
                        <ul className="space-y-3 text-stone-400 text-sm">
                            <li><FooterLink href="/">Accueil</FooterLink></li>
                            <li><FooterLink href="/calendrier">Le Calendrier</FooterLink></li>
                            <li><FooterLink href="/niveaux">Niveaux</FooterLink></li>
                            <li><FooterLink href="/guide">Le Guide</FooterLink></li>
                        </ul>
                    </div>

                    {/* Aventures */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-semibold tracking-wide">Aventures</h4>
                        <ul className="space-y-3 text-stone-400 text-sm">
                            <li><FooterLink href="/aventures/mono-activite">Mono</FooterLink></li>
                            <li><FooterLink href="/aventures/duo-activites">Duo</FooterLink></li>
                            <li><FooterLink href="/aventures/sur-mesure">Sur-mesure</FooterLink></li>
                        </ul>
                    </div>

                    {/* Accès */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white font-semibold tracking-wide">Accès Hautes-Alpes / Embrunais</h4>
                        <ul className="space-y-3 text-stone-400 text-sm">
                            {accessData?.accessMethods?.map((method: any, i: number) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Train className="w-4 h-4 text-[var(--brand-water)]" />
                                    <span>{method.title}</span>
                                </li>
                            )) || (
                                    <>
                                        <li className="flex items-center gap-2"><Train className="w-4 h-4 text-[var(--brand-water)]" /> Paris ➜ Briançon (Nuit)</li>
                                        <li className="flex items-center gap-2"><Train className="w-4 h-4 text-[var(--brand-water)]" /> Marseille ➜ Briançon</li>
                                    </>
                                )}
                            <li className="pt-2">
                                <Link href="/acces" className="text-[var(--brand-water)] hover:text-white transition-colors underline underline-offset-4 text-xs uppercase font-bold">
                                    Voir tous les accès &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-semibold tracking-wide">Contact</h4>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-stone-500 shrink-0" />
                                <span>Hautes-Alpes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-stone-500 shrink-0" />
                                <a href="mailto:hello@moncoach.com" className="hover:text-white transition-colors truncate">contact@...</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>&copy; {currentYear} Mon Coach Plein Air.</p>
                    <div className="flex gap-8">
                        <FooterLink href="/mentions-legales">Mentions</FooterLink>
                        <FooterLink href="/cgv">CGV</FooterLink>
                        <Link href="https://facenord-graphisme.com" target="_blank" className="hover:text-stone-300 transition-colors">
                            Face Nord Graphisme
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="block hover:text-white transition-colors duration-200">
            {children}
        </Link>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:bg-stone-800 hover:text-white transition-all duration-300"
            aria-label={label}
        >
            {icon}
        </Link>
    );
}
