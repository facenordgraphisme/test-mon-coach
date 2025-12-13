import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id: string }> }) {
    const { session_id } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-stone-900">Réservation confirmée !</h1>

                <p className="text-stone-600">
                    Merci pour votre réservation. Vous allez recevoir un email de confirmation très bientôt.
                </p>

                {session_id && (
                    <div className="bg-stone-50 p-4 rounded-lg text-sm text-stone-500">
                        <p>Référence: <span className="font-mono text-stone-900">{session_id.slice(-8)}</span></p>
                    </div>
                )}

                <Button className="w-full bg-[var(--brand-water)] hover:bg-[var(--brand-dark)]" asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        </div>
    );
}
