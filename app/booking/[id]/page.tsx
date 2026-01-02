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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function getMapSrc(input: string | undefined): string | undefined {
    if (!input) return undefined;
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
    return input.split('"')[0].split(' ')[0];
}

async function getEventDetails(eventId: string) {
    return client.fetch(groq`
        *[_type == "event" && _id == $eventId][0] {
            _id,
            title,
            date,
            maxParticipants,
            seatsAvailable,
            bookedCount,
            status,
            duration,
            price,
            privatizationPrice,
            discounts,
            description,
            difficulty->{
                level,
                color,
                title,
                description
            },
            equipment,
            providedEquipment,
            program,
            locationInfo,
            locationEmbedUrl,
            activity->{
                title,
                requiresHeightWeight,
                availableBikes[]->{
                    _id,
                    name,
                    priceHalfDay,
                    priceFullDay
                },
                "imageUrl": mainImage.asset->url,
                "categories": categories[]->{title},
                reviews
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
                        <Link href="/calendrier">← Retour au calendrier</Link>
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
                                {event.title ? `${event.title} - ${activity.title}` : activity.title}
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

                        {/* Tabs Integration */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-2 md:p-6">
                            <Tabs defaultValue="experience" className="w-full">
                                <TabsList className="w-full justify-start overflow-x-auto mb-8 bg-transparent border-b border-stone-200 h-auto p-0 rounded-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <TabsTrigger
                                        value="experience"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                    >
                                        L'expérience
                                    </TabsTrigger>
                                    {event.program && (
                                        <TabsTrigger
                                            value="program"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                        >
                                            Au programme
                                        </TabsTrigger>
                                    )}
                                    {(event.equipment || event.providedEquipment) && (
                                        <TabsTrigger
                                            value="equipment"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                        >
                                            Matériel
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger
                                        value="infos"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                    >
                                        Infos pratiques
                                    </TabsTrigger>
                                    {activity.reviews && activity.reviews.length > 0 && (
                                        <TabsTrigger
                                            value="reviews"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                        >
                                            Avis ({activity.reviews.length})
                                        </TabsTrigger>
                                    )}
                                </TabsList>

                                {/* Experience Tab */}
                                <TabsContent value="experience" className="outline-none animate-in fade-in-50 duration-500">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <span className="w-8 h-1 bg-[var(--brand-rock)] rounded-full block"></span>
                                        Description
                                    </h2>
                                    <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed min-h-[200px]">
                                        {Array.isArray(event.description)
                                            ? <PortableText value={event.description} />
                                            : <p>Description détaillée à venir.</p>
                                        }
                                    </div>
                                </TabsContent>

                                {/* Program Tab */}
                                {event.program && (
                                    <TabsContent value="program" className="outline-none animate-in fade-in-50 duration-500">
                                        <h3 className="text-xl font-bold mb-6">Déroulement de la sortie</h3>
                                        <div className="space-y-8 border-l-2 border-stone-200 ml-3 pl-8 py-2 relative">
                                            {event.program.map((step: any, i: number) => (
                                                <div key={i} className="relative group">
                                                    <div className="absolute -left-[43px] top-1 w-7 h-7 rounded-full bg-white border-4 border-stone-100 group-hover:border-[var(--brand-water)] transition-colors flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-[var(--brand-water)]"></div>
                                                    </div>
                                                    <span className="inline-block px-2 py-1 bg-stone-100 text-[var(--brand-water)] text-xs font-bold rounded mb-2">
                                                        {step.time}
                                                    </span>
                                                    <h4 className="text-stone-900 font-bold text-lg mb-1">{step.description}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Equipment Tab */}
                                {(event.equipment || event.providedEquipment) && (
                                    <TabsContent value="equipment" className="outline-none animate-in fade-in-50 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                                <h4 className="font-bold text-[var(--brand-rock)] mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    Fourni par le guide
                                                </h4>
                                                {event.providedEquipment && event.providedEquipment.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {event.providedEquipment.map((item: string, i: number) => (
                                                            <li key={i} className="text-stone-700 text-sm pl-2 border-l-2 border-green-200">
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-stone-400 text-sm italic">Aucun matériel spécifique fourni.</p>
                                                )}
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                                <h4 className="font-bold text-stone-900 mb-4">À prévoir</h4>
                                                {event.equipment && event.equipment.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {event.equipment.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-stone-600 text-sm">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-stone-400 text-sm italic">Aucun matériel spécifique requis.</p>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Infos Tab */}
                                <TabsContent value="infos" className="outline-none animate-in fade-in-50 duration-500 space-y-8">
                                    {event.locationInfo && (
                                        <div>
                                            <h3 className="font-bold text-lg mb-3">Informations d'accès</h3>
                                            <div className="bg-stone-50 p-6 rounded-xl text-stone-700 leading-relaxed border-l-4 border-[var(--brand-water)]">
                                                {event.locationInfo}
                                            </div>
                                        </div>
                                    )}

                                    {event.locationEmbedUrl && (
                                        <div>
                                            <h3 className="font-bold text-lg mb-3">Carte</h3>
                                            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
                                                <iframe
                                                    src={getMapSrc(event.locationEmbedUrl)}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}

                                    {!event.locationInfo && !event.locationEmbedUrl && (
                                        <p className="text-stone-400 italic">Pas d'informations spécifiques pour le moment.</p>
                                    )}
                                </TabsContent>

                                {/* Reviews Tab */}
                                {activity.reviews && activity.reviews.length > 0 && (
                                    <TabsContent value="reviews" className="outline-none animate-in fade-in-50 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activity.reviews.map((review: any, i: number) => (
                                                <div key={i} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex gap-1 mb-3 text-yellow-400">
                                                        {[...Array(review.rating || 5)].map((_, j) => (
                                                            <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <p className="text-stone-700 italic mb-4 leading-relaxed">"{review.text}"</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--brand-rock)] text-white flex items-center justify-center font-bold text-xs">
                                                            {review.author.charAt(0)}
                                                        </div>
                                                        <p className="text-stone-900 font-bold text-sm">{review.author}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar / Checkout */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <BookingForm
                                eventId={event._id}
                                activityTitle={event.title ? `${event.title} - ${activity.title}` : activity.title}
                                price={event.price} // Use event price
                                date={event.date}
                                image={activity.imageUrl}
                                maxParticipants={event.maxParticipants}
                                seatsAvailable={event.seatsAvailable}
                                bookedCount={event.bookedCount}
                                difficultyTitle={event.difficulty?.title}
                                difficultyColor={event.difficulty?.color}
                                difficultyLevel={event.difficulty?.level}
                                difficultyDescription={event.difficulty?.description}
                                requiresHeightWeight={activity.requiresHeightWeight}
                                availableBikes={activity.availableBikes}
                                eventDuration={event.duration}
                                privatizationPrice={event.privatizationPrice}
                                discounts={event.discounts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
