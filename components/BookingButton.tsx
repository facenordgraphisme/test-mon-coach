"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingButtonProps {
    eventId: string;
    className?: string;
    children?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    // Keeping these props optional to avoid breaking existing usages immediately, 
    // even though they aren't used for the link anymore
    activityTitle?: string;
    price?: number;
    date?: string;
    image?: string;
}

export function BookingButton({
    eventId,
    className,
    children = "Réserver",
    variant = "default",
    size = "default"
}: BookingButtonProps) {
    return (
        <Button
            asChild
            className={className}
            variant={variant}
            size={size}
        >
            {/* Pas de prefetch : /booking/[id] est rendu à la demande (places en temps réel) ;
                le prefetch déclenchait une invocation serveur par bouton visible à l'écran. */}
            <Link href={`/booking/${eventId}`} prefetch={false}>
                {children}
            </Link>
        </Button>
    )
}
