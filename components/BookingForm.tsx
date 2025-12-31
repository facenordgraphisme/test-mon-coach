"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the Bike type based on Sanity schema
type Bike = {
    _id: string;
    name: string;
    priceHalfDay: number;
    priceFullDay: number;
};

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
    seatsAvailable?: number;
    requiresHeightWeight?: boolean;
    availableBikes?: Bike[]; // Dynamic bikes from Sanity
    eventDuration?: string; // 'half_day' or 'full_day' from Event
}

type ParticipantData = {
    medicalInfo: string;
    height: string;
    weight: string;
    bikeRentalId?: string; // Stores the _id of the selected bike, or 'none'
};

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
    difficultyDescription,
    seatsAvailable,
    requiresHeightWeight,
    availableBikes = [],
    eventDuration
}: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isGift, setIsGift] = useState(false);

    // Determine if it is a full day event based on event schema
    const isFullDay = eventDuration === 'full_day';

    const getRentalPrice = (bikeId: string | undefined) => {
        if (!bikeId || bikeId === 'none') return 0;
        const bike = availableBikes.find(b => b._id === bikeId);
        if (!bike) return 0;
        return isFullDay ? (bike.priceFullDay || 0) : (bike.priceHalfDay || 0);
    };

    // Create initial state for 1 participant
    const [participantsData, setParticipantsData] = useState<ParticipantData[]>([
        { medicalInfo: '', height: '', weight: '', bikeRentalId: 'none' }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        recipientName: ''
    });

    const updateQuantity = (newQuantity: number) => {
        setQuantity(newQuantity);
        setParticipantsData(prev => {
            const newData = [...prev];
            if (newQuantity > prev.length) {
                // Add new participants
                for (let i = prev.length; i < newQuantity; i++) {
                    newData.push({ medicalInfo: '', height: '', weight: '', bikeRentalId: 'none' });
                }
            } else {
                // Remove participants
                return newData.slice(0, newQuantity);
            }
            return newData;
        });
    };

    const updateParticipant = (index: number, field: keyof ParticipantData, value: string) => {
        setParticipantsData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };

    const availableSpots = seatsAvailable ?? Math.max(0, maxParticipants - bookedCount);
    const maxSelectable = Math.min(availableSpots, 10);

    const totalRentalPrice = participantsData.reduce((sum, p) => sum + getRentalPrice(p.bikeRentalId), 0);
    const totalPrice = (price * quantity) + totalRentalPrice;

    const onCheckout = async () => {
        try {
            // Basic validation
            if (!formData.name || !formData.email || !formData.phone) {
                alert("Merci de remplir tous vos coordonnées (Nom, Email, Téléphone)");
                return;
            }

            // Gift validation
            if (isGift && !formData.recipientName) {
                alert("Merci de renseigner le nom de la personne à qui vous offrez le cadeau");
                return;
            }

            // Validate participants data
            for (let i = 0; i < quantity; i++) {
                const p = participantsData[i];
                if (requiresHeightWeight && (!p.height || !p.weight)) {
                    alert(`Merci de renseigner la taille et le poids pour le participant ${i + 1}.`);
                    return;
                }
            }

            // Serialize data
            const medicalInfoString = participantsData
                .map((p, i) => `P${i + 1}: ${p.medicalInfo || 'RAS'}`)
                .join(' | ');

            const heightString = participantsData
                .map((p, i) => `P${i + 1}: ${p.height || '?'}`)
                .join(' | ');

            const weightString = participantsData
                .map((p, i) => `P${i + 1}: ${p.weight || '?'}`)
                .join(' | ');

            const rentalString = availableBikes.length > 0 ? participantsData
                .map((p, i) => {
                    const bike = availableBikes.find(b => b._id === p.bikeRentalId);
                    return bike ? `P${i + 1}: ${bike.name} (+${getRentalPrice(p.bikeRentalId)}€)` : null;
                })
                .filter(Boolean)
                .join(' | ') : "";

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
                    rentalPriceTotal: totalRentalPrice,
                    date,
                    image,
                    quantity,
                    customerName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    medicalInfo: medicalInfoString + (rentalString ? ` | LOC: ${rentalString}` : ""),
                    height: heightString,
                    weight: weightString,
                    isGift: isGift,
                    recipientName: isGift ? formData.recipientName : undefined
                })
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
                        onValueChange={(val) => updateQuantity(parseInt(val))}
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

                {/* Participants Info Loop */}
                {participantsData.map((participant, index) => (
                    <div key={index} className="pt-4 border-t border-stone-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="font-bold text-stone-800 mb-3 text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs">
                                {index + 1}
                            </span>
                            Participant {index + 1}
                            {index === 0 && <span className="text-stone-400 font-normal text-xs ml-1">(Vous)</span>}
                        </h4>

                        {/* Bike Rental (if available) */}
                        {availableBikes.length > 0 && (
                            <div className="mb-3">
                                <label className="text-xs font-medium text-stone-600 mb-1 block">Location de vélo ({isFullDay ? 'Tarif Journée' : 'Tarif Demi-journée'})</label>
                                <Select
                                    value={participant.bikeRentalId}
                                    onValueChange={(val) => updateParticipant(index, 'bikeRentalId', val)}
                                >
                                    <SelectTrigger className="w-full text-sm">
                                        <SelectValue placeholder="Choisir une option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Pas de location</SelectItem>
                                        {availableBikes.map((bike) => (
                                            <SelectItem key={bike._id} value={bike._id}>
                                                {bike.name} (+{isFullDay ? bike.priceFullDay : bike.priceHalfDay}€)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Height / Weight (if required) */}
                        {requiresHeightWeight && (
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-stone-600">Taille (cm)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none"
                                        placeholder="ex: 175"
                                        value={participant.height}
                                        onChange={(e) => updateParticipant(index, 'height', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-stone-600">Poids (kg)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none"
                                        placeholder="ex: 70"
                                        value={participant.weight}
                                        onChange={(e) => updateParticipant(index, 'weight', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Medical Info */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-600">
                                Santé / Régime (Allergies, Asthme...)
                                <span className="text-stone-400 font-normal ml-1">(Optionnel)</span>
                            </label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none min-h-[60px]"
                                placeholder="R.A.S."
                                value={participant.medicalInfo}
                                onChange={(e) => updateParticipant(index, 'medicalInfo', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {/* Gift Toggle */}
                <div className="pt-4 border-t border-stone-50">
                    <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100 cursor-pointer" onClick={() => setIsGift(!isGift)}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isGift ? 'bg-[var(--brand-water)] border-[var(--brand-water)]' : 'bg-white border-stone-300'}`}>
                            {isGift && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span className="text-sm font-medium text-stone-700 select-none">C'est pour offrir un cadeau 🎁</span>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="pt-4 border-t border-stone-50 space-y-4">
                    <h4 className="font-medium text-stone-900">
                        {isGift ? "Vos coordonnées (acheteur)" : "Vos coordonnées"}
                    </h4>

                    {isGift && (
                        <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100 mb-4">
                            Nous enverrons la confirmation de commande à cette adresse. Les billets seront envoyés après paiement.
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-600">Nom complet</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none transition-all"
                                placeholder="Jean Dupont"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-600">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none transition-all"
                                placeholder="jean@mail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-stone-600">Téléphone (pour SMS)</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none transition-all"
                                placeholder="06 12 34 56 78"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Recipient Details if Gift */}
                    {isGift && (
                        <div className="mt-6 pt-4 border-t border-stone-100 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h4 className="font-medium text-stone-900 flex items-center gap-2">
                                À qui offrez-vous ce cadeau ?
                            </h4>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-stone-600">Nom du bénéficiaire</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-water)] focus:border-transparent outline-none transition-all"
                                    placeholder="Prénom et Nom du chanceux"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Total & Action */}
                <div className="pt-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-stone-600 font-medium">Total à payer</span>
                        <div className="text-right">
                            <span className="block text-3xl font-bold text-[var(--brand-rock)]">{totalPrice}€</span>
                            {totalRentalPrice > 0 && <span className="text-xs text-stone-500">dont {totalRentalPrice}€ de location</span>}
                        </div>
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
                        {isGift ? "Offrir l'aventure" : "Confirmer et Payer"}
                    </Button>
                </div>

                <p className="text-xs text-center text-stone-400">
                    Paiement sécurisé via Stripe. Vous recevrez un email de confirmation après le paiement.
                </p>
            </div>
        </div>
    );
}
