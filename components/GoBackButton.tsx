"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GoBackButtonProps {
    label?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function GoBackButton({ label = "Retour", className, variant = "secondary" }: GoBackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant={variant}
            className={`hover:text-[var(--brand-water)] ${className}`}
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {label}
        </Button>
    );
}
