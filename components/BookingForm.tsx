"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingFormProps {
    eventId: string;
    activityTitle: string;
    price: number;
    date: string;
    image?: string;
    maxParticipants: number;
    bookedCount: number;
    difficultyTitle?: string;
    difficultyColor?: string;
    difficultyLevel?: string;
    difficultyDescription?: string;
}

export function BookingForm({
    eventId,
    activityTitle,
    price,
    date,
    image,
    maxParticipants,
    bookedCount,
    difficultyTitle,
    difficultyColor,
    difficultyLevel,
    difficultyDescription
}: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const availableSpots = Math.max(0, maxParticipants - bookedCount);
    // Limit selection to 10 or available spots
    const maxSelectable = Math.min(availableSpots, 10);
    const totalPrice = price * quantity;

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
                    image,
                    quantity // Sending quantity to API
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

    if (availableSpots <= 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100">
                <Button disabled className="w-full bg-stone-200 text-stone-500">
                    Complet
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 sticky top-24">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Détails de la réservation</h3>

            <div className="space-y-6">
                {/* Price Display */}
                <div className="flex justify-between items-center pb-4 border-b border-stone-50">
                    <span className="text-stone-500">Prix par personne</span>
                    <span className="text-xl font-bold text-stone-900">{price}€</span>
                </div>

                {/* Level Badge */}
                <div className="flex justify-between items-center">
                    <span className="text-stone-500">Niveau</span>
                    {difficultyTitle || difficultyLevel ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className={`cursor-help bg-${difficultyColor}-50 text-${difficultyColor}-700 border-${difficultyColor}-200`}>
                                        {difficultyTitle || `Niveau ${difficultyLevel}`}
                                    </Badge>
                                </TooltipTrigger>
                                {difficultyDescription && (
                                    <TooltipContent>
                                        <p className="max-w-xs text-sm">{difficultyDescription}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <span className="text-stone-900 font-medium">-</span>
                    )}
                </div>

                {/* Spots Check */}
                <div className="flex justify-between items-center">
                    <span className="text-stone-500">Places restantes</span>
                    <span className="font-medium text-stone-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-stone-400" />
                        {availableSpots} places
                    </span>
                </div>

                {/* Quantity Selector */}
                <div className="pt-4 border-t border-stone-50">
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Nombre de participants</label>
                    <Select
                        value={quantity.toString()}
                        onValueChange={(val) => setQuantity(parseInt(val))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num} personne{num > 1 ? 's' : ''} - {price * num}€
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Total & Action */}
                <div className="pt-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-stone-600 font-medium">Total à payer</span>
                        <span className="text-3xl font-bold text-[var(--brand-rock)]">{totalPrice}€</span>
                    </div>

                    <Button
                        onClick={onCheckout}
                        disabled={loading}
                        className="w-full bg-[var(--brand-water)] hover:brightness-90 text-white h-12 text-lg transition-all"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="mr-2 h-4 w-4" />
                        )}
                        Confirmer et Payer
                    </Button>
                </div>

                <p className="text-xs text-center text-stone-400">
                    Paiement sécurisé via Stripe. Vous recevrez un email de confirmation après le paiement.
                </p>
            </div>
        </div>
    );
}
