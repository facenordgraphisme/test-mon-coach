import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="bg-[var(--brand-water)] text-stone-300 py-12 md:py-16">
            <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h3 className="text-white text-lg font-bold tracking-wider uppercase">Mon Coach Plein Air</h3>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Des expériences exclusives en Hautes-Alpes, pensées pour vous reconnecter à la nature.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-white font-medium">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                        <li><Link href="/aventures" className="hover:text-white">Nos Aventures</Link></li>
                        <li><Link href="/calendrier" className="hover:text-white">Calendrier</Link></li>
                        <li><Link href="/guide" className="hover:text-white">Le Guide</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-white font-medium">Légal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/cgv" className="hover:text-white">CGV</Link></li>
                        <li><Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-white font-medium">Contact</h4>
                    <p className="text-sm">
                        Hautes-Alpes, France<br />
                        contact@moncoachpleinair.com
                    </p>
                </div>
            </div>
            <div className="container px-4 md:px-6 mt-12 pt-8 border-t border-stone-800 text-xs text-stone-200 flex justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Mon Coach Plein Air. Tous droits réservés.</p>
                <p>Propulsé par Face Nord Graphisme</p>
            </div>
        </footer>
    )
}
