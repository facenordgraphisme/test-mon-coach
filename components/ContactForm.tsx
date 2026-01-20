"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to send');

            setStatus('success');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="firstname" className="text-sm font-medium text-stone-700">Prénom</label>
                    <Input id="firstname" name="firstname" placeholder="Jean" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastname" className="text-sm font-medium text-stone-700">Nom</label>
                    <Input id="lastname" name="lastname" placeholder="Dupont" required />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                <Input id="email" name="email" type="email" placeholder="jean.dupont@email.com" required />
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-stone-700">Sujet</label>
                <select
                    id="subject"
                    name="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="info">Demande d'information</option>
                    <option value="booking">Privatisation / Groupe</option>
                    <option value="other">Autre</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-stone-700">Message</label>
                <Textarea id="message" name="message" placeholder="Bonjour, je souhaite organiser une sortie pour..." className="min-h-[150px]" required />
            </div>

            <div className="space-y-2">
                <Button className="w-full bg-stone-900 hover:bg-stone-800" size="lg" disabled={loading}>
                    {loading ? "Envoi en cours..." : "Envoyer"}
                </Button>
                {status === 'success' && (
                    <p className="text-green-600 text-sm text-center font-medium">Message envoyé avec succès !</p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 text-sm text-center font-medium">Une erreur est survenue, veuillez réessayer.</p>
                )}
            </div>
        </form>
    );
}
