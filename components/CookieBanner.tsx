'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay to not annoy immediately on load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
        // Dispatch event so GoogleAnalytics component knows immediately
        window.dispatchEvent(new Event('cookie-consent-updated'));
    };

    const handleRefuse = () => {
        localStorage.setItem('cookie-consent', 'refused');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    // Bandeau compact (≈ 120 px sur mobile) : ne masque plus le contenu ni le bouton « Réserver ».
    // « Refuser » est aussi visible qu'« Accepter » (exigence CNIL) ; GA ne se charge qu'après acceptation.
    return (
        <div
            role="region"
            aria-label="Consentement aux cookies"
            className={cn(
                "fixed bottom-3 left-3 right-3 md:left-auto md:right-4 md:bottom-4 md:max-w-md z-50",
                "bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-4",
                "transform transition-all duration-500 ease-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
        >
            <p className="text-sm text-stone-700 leading-snug">
                Nous utilisons des cookies de mesure d&apos;audience, uniquement avec votre accord.{" "}
                <Link href="/mentions-legales" className="text-[var(--brand-water)] underline underline-offset-2">
                    En savoir plus
                </Link>
            </p>
            <div className="flex gap-2 mt-3">
                <Button
                    onClick={handleRefuse}
                    variant="outline"
                    className="h-11 flex-1 border-stone-300 text-stone-800 hover:bg-stone-50"
                >
                    Refuser
                </Button>
                <Button
                    onClick={handleAccept}
                    className="h-11 flex-1 bg-[var(--brand-water)] text-white hover:bg-[var(--brand-water)]/90"
                >
                    Accepter
                </Button>
            </div>
        </div>
    );
};
