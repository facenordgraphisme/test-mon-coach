'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
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

    return (
        <div className={cn(
            "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50",
            "bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-6",
            "transform transition-all duration-500 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
            <div className="flex items-start gap-4">
                <div className="bg-[var(--brand-water)]/10 p-2 rounded-xl text-[var(--brand-water)] shrink-0">
                    <Cookie className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-bold text-stone-900 mb-1">Utilisation des cookies</h3>
                        <p className="text-sm text-stone-600 leading-relaxed">
                            Nous utilisons des cookies pour optimiser votre expérience et analyser notre trafic.
                            En continuant, vous acceptez notre utilisation des cookies.
                            <br />
                            <Link href="/mentions-legales" className="text-[var(--brand-water)] hover:underline mt-1 inline-block">
                                En savoir plus
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                            onClick={handleAccept}
                            className="bg-[var(--brand-water)] text-white hover:bg-[var(--brand-water)]/90 flex-1"
                        >
                            Accepter
                        </Button>
                        <Button
                            onClick={handleRefuse}
                            variant="outline"
                            className="border-stone-200 text-stone-600 hover:bg-stone-50 flex-1"
                        >
                            Refuser
                        </Button>
                    </div>
                </div>
                <button
                    onClick={handleRefuse}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Fermer</span>
                </button>
            </div>
        </div>
    );
};
