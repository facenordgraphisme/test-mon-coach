import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin } from "lucide-react";
import { stripe } from "@/lib/stripe";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id: string }> }) {
    const { session_id } = await searchParams;

    if (!session_id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Session invalide</p>
            </div>
        )
    }

    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
        console.error("Error retrieving session", error);
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-red-500">Impossible de récupérer les détails de la réservation.</p>
            </div>
        )
    }

    const { customer_details, metadata } = session;
    const activityTitle = metadata?.activityTitle || "Activité";
    const date = metadata?.date ? new Date(metadata.date) : null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900">Réservation confirmée !</h1>
                    <p className="text-stone-600 text-lg">
                        Votre aventure est bookée. Préparez votre sac !
                    </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-6 space-y-4 border border-stone-100">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Activité</p>
                        <p className="text-xl font-bold text-stone-900">{activityTitle}</p>
                    </div>

                    {date && (
                        <div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Date</p>
                            <div className="flex items-center gap-2 text-stone-700">
                                <Calendar className="w-5 h-5 text-[var(--brand-water)]" />
                                <span className="capitalize font-medium">
                                    {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-500 text-sm mt-1 ml-7">
                                <span>à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-stone-200">
                        <p className="text-sm text-stone-600">
                            Un email de confirmation a été envoyé à <strong>{customer_details?.email}</strong>.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button className="w-full bg-[var(--brand-water)] hover:brightness-90 text-white h-12 text-lg" asChild>
                        <Link href="/">Retour à l'accueil</Link>
                    </Button>
                    <p className="text-xs text-center text-stone-400">
                        Référence commande : <span className="font-mono">{session_id.slice(-8)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
