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
            <Link href={`/booking/${eventId}`}>
                {children}
            </Link>
        </Button>
    )
}
