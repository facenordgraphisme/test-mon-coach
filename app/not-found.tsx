import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";

// Page 404 statique (aucune lecture de requête) : servie depuis le CDN, sans rendu serveur.
export const metadata: Metadata = {
    title: "Page introuvable",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <>
            {/* Bandeau sombre : la navbar peut être transparente/texte blanc (ex. /aventures/…) */}
            <section className="bg-stone-900 text-white pt-40 pb-24 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Compass className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-stone-400">Erreur 404</p>
                    <h1 className="text-4xl md:text-5xl font-bold">Hors des sentiers battus…</h1>
                    <p className="text-lg text-stone-300">
                        La page que vous cherchez n&apos;existe pas ou a été déplacée.
                    </p>
                </div>
            </section>
            <section className="bg-stone-50 py-16 px-4">
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href="/">Retour à l&apos;accueil</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/calendrier">Voir le calendrier</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/contact">Nous contacter</Link>
                    </Button>
                </div>
            </section>
            <SiteFooter />
        </>
    );
}
