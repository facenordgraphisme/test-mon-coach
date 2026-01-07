'use client';

import { useEffect, useState } from "react";
import Script from "next/script";

export const GoogleAnalytics = () => {
    const [consent, setConsent] = useState<boolean>(false);

    useEffect(() => {
        // Initial check
        const storedConsent = localStorage.getItem('cookie-consent');
        if (storedConsent === 'accepted') {
            setConsent(true);
        }

        // Listen for consent changes
        const handleConsentUpdate = () => {
            const updatedConsent = localStorage.getItem('cookie-consent');
            if (updatedConsent === 'accepted') {
                setConsent(true);
            }
        };

        window.addEventListener('cookie-consent-updated', handleConsentUpdate);
        return () => window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
    }, []);

    // Replace with your actual GA Measurement ID
    // or better, use an environment variable NEXT_PUBLIC_GA_ID
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

    if (!consent || !GA_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_ID}');
                `}
            </Script>
        </>
    );
};
