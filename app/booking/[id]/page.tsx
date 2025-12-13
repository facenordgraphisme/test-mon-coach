import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortableText } from '@portabletext/react';

async function getEventDetails(eventId: string) {
    return client.fetch(groq`
        *[_type == "event" && _id == $eventId][0] {
            _id,
            date,
            maxParticipants,
            bookedCount,
            status,
            activity->{
                title,
                description,
                price,
                duration,
                difficulty->{
                    level,
                    color,
                    title,
                    description
                },
                equipment,
                "imageUrl": mainImage.asset->url,
                "categories": categories[]->{title}
            }
        }
    `, { eventId });
}

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventDetails(id);

    if (!event || !event.activity) {
        notFound();
    }

    const { activity } = event;
    const date = new Date(event.date);

    return (
        <div className="min-h-screen bg-stone-50 py-24">
            <div className="container px-4 md:px-6 mx-auto max-w-5xl">

                {/* Back Link */}
                <div className="mb-8">
                    <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-[var(--brand-water)]">
                        <Link href="/calendar">← Retour au calendrier</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex gap-2 mb-4">
                                {activity.categories && activity.categories.map((cat: { title: string }, i: number) => (
                                    <Badge key={i} variant="outline" className="bg-white text-stone-500 border-stone-200">
                                        {cat.title}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4">
                                {activity.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-stone-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[var(--brand-water)]" />
                                    <span className="font-medium capitalize">
                                        {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[var(--brand-water)]" />
                                    <span>{format(date, 'HH:mm')} • {activity.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {activity.imageUrl && (
                            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 prose prose-stone max-w-none">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-[var(--brand-water)]" />
                                L'expérience
                            </h3>
                            {activity.description ? (
                                <div className="text-stone-700">
                                    <PortableText value={activity.description} />
                                </div>
                            ) : (
                                <p className="text-stone-500 italic">Aucune description disponible.</p>
                            )}
                        </div>

                        {/* Equipment */}
                        {activity.equipment && activity.equipment.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                                <h3 className="text-xl font-bold mb-6">Matériel requis</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {activity.equipment.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-stone-700">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Checkout */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <BookingForm
                                eventId={event._id}
                                activityTitle={activity.title}
                                price={activity.price}
                                date={event.date}
                                image={activity.imageUrl}
                                maxParticipants={event.maxParticipants}
                                bookedCount={event.bookedCount}
                                difficultyTitle={activity.difficulty?.title}
                                difficultyColor={activity.difficulty?.color}
                                difficultyLevel={activity.difficulty?.level}
                                difficultyDescription={activity.difficulty?.description}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
