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

type Event = {
    _id: string
    date: string
    status: 'available' | 'lastSpots' | 'full'
    maxParticipants: number
    bookedCount: number
    activity: {
        title: string
        slug: string
        duration: string
        price: number
        difficulty: {
            level: string
            color: string
        }
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
                                hasEvent: "bg-stone-100 font-bold text-[var(--brand-water)]"
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
                        {displayedEvents.map((event) => (
                            <Card key={event._id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-stone-100 bg-white group">
                                <div className="flex flex-col md:flex-row">
                                    {/* Date Column */}
                                    <div className="bg-stone-50 p-6 flex flex-col items-center justify-center min-w-[130px] border-b md:border-b-0 md:border-r border-stone-100">
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

                                    {/* Info Column */}
                                    <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                {event.activity.difficulty && (
                                                    <Badge variant="outline" className={`bg-${event.activity.difficulty.color}-50 text-${event.activity.difficulty.color}-700 border-${event.activity.difficulty.color}-200`}>
                                                        Niveau {event.activity.difficulty.level}
                                                    </Badge>
                                                )}
                                                <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                                                    {event.activity.duration}
                                                </Badge>
                                                <Badge variant="outline" className={`
                                                    ${event.status === 'available' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                                                    ${event.status === 'lastSpots' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
                                                    ${event.status === 'full' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                                                `}>
                                                    {event.status === 'available' && 'Disponible'}
                                                    {event.status === 'lastSpots' && 'Dernières places'}
                                                    {event.status === 'full' && 'Complet'}
                                                </Badge>
                                            </div>

                                            <h4 className="text-xl font-bold text-stone-900 group-hover:text-[var(--brand-water)] transition-colors">
                                                {event.activity.title}
                                            </h4>

                                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                                <Users className="w-4 h-4" />
                                                <span>{event.bookedCount || 0} / {event.maxParticipants} participants</span>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-stone-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                            <span className="font-bold text-2xl text-[var(--brand-rock)]">{event.activity.price}€</span>

                                            {event.status === 'full' ? (
                                                <Button disabled className="bg-stone-200 text-stone-400">
                                                    Complet
                                                </Button>
                                            ) : (
                                                <BookingButton
                                                    eventId={event._id}
                                                    activityTitle={event.activity.title}
                                                    price={event.activity.price}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
