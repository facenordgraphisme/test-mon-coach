"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

interface ConfirmPaymentButtonProps {
    eventId: string;
    activityTitle: string;
    price: number;
    date: string;
    image?: string;
    className?: string;
}

export function ConfirmPaymentButton({
    eventId,
    activityTitle,
    price,
    date,
    image,
    className,
}: ConfirmPaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const onCheckout = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId,
                    activityTitle,
                    price,
                    date,
                    image
                }),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                console.error("Checkout failed:", errorMsg);
                alert(`Erreur: ${errorMsg}`);
                return;
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Something went wrong", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={onCheckout}
            disabled={loading}
            className={className}
            size="lg"
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Lock className="mr-2 h-4 w-4" />
            )}
            Confirmer et Payer ({price}€)
        </Button>
    )
}
