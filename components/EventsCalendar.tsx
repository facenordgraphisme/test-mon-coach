"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookingButton } from "@/components/BookingButton"
import Link from "next/link"
import { ArrowRight, Clock, Users } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Event = {
    _id: string
    title?: string
    date: string
    status: 'available' | 'lastSpots' | 'full'
    maxParticipants: number
    seatsAvailable?: number
    bookedCount: number
    price: number
    duration: string
    difficulty: {
        title: string
        level: string
        color: string
    }
    activity: {
        title: string
        slug: string
        imageUrl: string
    }
}

export function EventsCalendar({ events }: { events: Event[] }) {
    const [date, setDate] = useState<Date | undefined>(undefined)

    // Helper: Dates for modifiers
    const datesWithEvents = events.map(e => new Date(e.date))

    // Filter logic
    const displayedEvents = date
        ? events.filter(e => isSameDay(new Date(e.date), date))
        : events

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Interactive Calendar */}
            <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 sticky top-32">
                    <h3 className="font-bold text-lg mb-4 px-2">Sélectionner une date</h3>
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                hasEvent: datesWithEvents
                            }}
                            modifiersClassNames={{
                                hasEvent: "bg-[var(--brand-water)] font-bold text-white hover:bg-[var(--brand-water)]/90",
                                today: "bg-emerald-100 text-emerald-900 font-bold border border-emerald-200"
                            }}
                        />
                    </div>
                    <div className="mt-6 px-4 space-y-3 text-sm text-stone-500 border-t border-stone-50 pt-4">
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-water)]"></span>
                            <span>Journée avec sortie programmée</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Events List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-stone-900">
                        {date
                            ? `Sorties du ${format(date, 'd MMMM yyyy', { locale: fr })}`
                            : "Prochains départs"
                        }
                    </h3>
                    {date && (
                        <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="text-stone-500 hover:text-stone-900">
                            Voir tout
                        </Button>
                    )}
                </div>

                {displayedEvents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
                        <p className="text-stone-500 mb-4 text-lg">Aucune sortie programmée pour cette date.</p>
                        <Button asChild variant="outline" className="hover:bg-stone-100 hover:text-stone-900 border-stone-200">
                            <Link href="/contact">Demander une date sur mesure</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {displayedEvents.map((event) => {
                            // Compute real status based on seats
                            const totalSeats = event.maxParticipants || 0;
                            const booked = event.bookedCount || 0;
                            const seatsLeft = event.seatsAvailable !== undefined ? event.seatsAvailable : (totalSeats - booked);

                            let computedStatus = event.status;
                            if (seatsLeft <= 0) computedStatus = 'full';
                            else if (seatsLeft <= 2) computedStatus = 'lastSpots';
                            else computedStatus = 'available';

                            // const isFull = computedStatus === 'full'; // Unused but logic is there

                            return (
                                <Card key={event._id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-stone-100 bg-white group">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Date Column */}
                                        <div className="bg-stone-50 p-6 flex flex-col items-center justify-center min-w-[130px] border-b md:border-b-0 md:border-r border-stone-100 shrink-0">
                                            <span className="text-sm font-semibold text-[var(--brand-water)] uppercase tracking-widest">
                                                {format(new Date(event.date), 'MMM', { locale: fr })}
                                            </span>
                                            <span className="text-4xl font-bold text-stone-900 my-1">
                                                {format(new Date(event.date), 'dd')}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-200/50 px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(event.date), 'HH:mm')}
                                            </div>
                                        </div>

                                        {/* Image Column */}
                                        <div className="relative w-full md:w-32 h-32 md:h-auto shrink-0 border-b md:border-b-0 md:border-r border-stone-100">
                                            {event.activity.imageUrl ? (
                                                <img
                                                    src={event.activity.imageUrl}
                                                    alt={event.activity.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                                                    <span className="text-xs">Pas d'image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info Column */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-2 text-xs mb-1">
                                                    {event.difficulty && (
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={300}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="cursor-help">
                                                                        <Badge variant="outline" className={`bg-${event.difficulty.color}-50 text-${event.difficulty.color}-700 border-${event.difficulty.color}-200 hover:bg-${event.difficulty.color}-100 transition-colors`}>
                                                                            Niveau {event.difficulty.level}
                                                                        </Badge>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-[200px] p-4">
                                                                    <p className="font-bold mb-1">{event.difficulty.title}</p>
                                                                    <p className="text-xs text-stone-500 mb-2">Cliquez pour voir les détails des niveaux.</p>
                                                                    <Link href="/niveaux" className="text-xs text-[var(--brand-water)] underline underline-offset-2 hover:text-stone-900">
                                                                        En savoir plus
                                                                    </Link>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                                                        {{
                                                            'half_day': 'Demi Journée',
                                                            'full_day': 'Journée Complète'
                                                        }[event.duration] || event.duration}
                                                    </Badge>
                                                    <Badge variant="outline" className={`
                                                        ${computedStatus === 'available' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                                                        ${computedStatus === 'lastSpots' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
                                                        ${computedStatus === 'full' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                                                    `}>
                                                        {computedStatus === 'available' && 'Disponible'}
                                                        {computedStatus === 'lastSpots' && 'Dernières places'}
                                                        {computedStatus === 'full' && 'Complet'}
                                                    </Badge>
                                                </div>

                                                <h4 className="text-xl font-bold text-stone-900 group-hover:text-[var(--brand-water)] transition-colors leading-tight">
                                                    {event.title ? (
                                                        <>
                                                            {event.title} <span className="text-stone-500 font-normal text-base block md:inline md:ml-1">- {event.activity.title}</span>
                                                        </>
                                                    ) : (
                                                        event.activity.title
                                                    )}
                                                </h4>

                                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                                    <Users className="w-4 h-4 text-stone-400" />
                                                    <span>{seatsLeft > 0 ? `${seatsLeft} places restantes` : 'Complet'}</span>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-stone-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                                <span className="font-bold text-2xl text-[var(--brand-rock)]">{event.price}€</span>

                                                {computedStatus === 'full' ? (
                                                    <Button disabled className="bg-stone-200 text-stone-400">
                                                        Complet
                                                    </Button>
                                                ) : (
                                                    <BookingButton
                                                        eventId={event._id}
                                                        activityTitle={event.activity.title}
                                                        price={event.price}
                                                        date={event.date}
                                                        className="bg-[var(--brand-water)] hover:brightness-90 text-white"
                                                    >
                                                        Réserver <ArrowRight className="ml-2 w-4 h-4" />
                                                    </BookingButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
