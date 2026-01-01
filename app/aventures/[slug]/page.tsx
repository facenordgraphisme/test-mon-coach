import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingButton } from "@/components/BookingButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsCalendar } from "@/components/EventsCalendar";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { Suspense } from 'react';
import { PortableText } from '@portabletext/react';

async function getData(slug: string) {
    // 1. Try to find an Activity or a Formula with this slug
    const doc = await client.fetch(groq`
        *[( _type == "activity" || _type == "formula" ) && slug.current == $slug][0] {
            _type,
            title,
            slug,
            format,
            
            // Formula specific fields
            description, // Portable Text
            "imageUrl": heroImage.asset->url,
            benefits,

            // Activity specific fields
            difficulty->{
                title,
                level,
                color,
                description
            },
            "mainImageUrl": mainImage.asset->url,
            "categories": categories[]->{title},
            // price removed
            duration,
            // description (shared name but potentially different content type if not careful, likely block array for both)
            equipment,
            program,
            providedEquipment,
            locationInfo,
            locationEmbedUrl,
            reviews,
            
            // For Activity: Upcoming events specific to this activity
            "upcomingEvents": *[_type == "event" && activity->slug.current == $slug && date >= now()] | order(date asc) [0...3] {
                date,
                status,
                _id,
                title,
                price,
                bookedCount,
                seatsAvailable,
                maxParticipants
            },
            // For Activity: Related activities
            "relatedActivities": *[_type == "activity" && count((categories[]->title)[@ in ^.categories[]->title]) > 0 && slug.current != $slug][0...3] {
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset->url
            }
        }
    `, { slug });

    if (!doc) return null;

    // 2. If it's a Formula, we need to fetch related Events and Activities for that format
    if (doc._type === 'formula') {
        const extraData = await client.fetch(groq`
            {
                "events": *[_type == "event" && status != 'cancelled' && dateTime(date) > dateTime(now()) && activity->format == $format] | order(date asc) {
                    _id,
                    title,
                    date,
                    status,
                    maxParticipants,
                    seatsAvailable,
                    bookedCount,
                    price,
                    activity->{
                        title,
                        "slug": slug.current,
                        "imageUrl": mainImage.asset->url,
                        duration,
                        difficulty->{
                            level,
                            color
                        }
                    }
                },
                "activities": *[_type == "activity" && format == $format] {
                    title,
                    "slug": slug.current,
                    format,
                    difficulty->{
                        title,
                        level,
                        color
                    },
                    "imageUrl": mainImage.asset->url,
                    categories[]->{title},
                    duration
                }
            }
        `, { format: doc.format });

        return { ...doc, ...extraData };
    }

    return doc;
}

function getMapSrc(input: string | undefined): string | undefined {
    if (!input) return undefined;
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
    return input.split('"')[0].split(' ')[0];
}

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        notFound();
    }

    // --- FORMULA VIEW ---
    if (data._type === 'formula') {
        const formula = data;
        return (
            <main className="min-h-screen bg-stone-50">
                {/* Hero Section */}
                <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        {formula.imageUrl ? (
                            <img
                                src={formula.imageUrl}
                                alt={formula.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-stone-900 w-full h-full" />
                        )}
                    </div>
                    <div className="relative z-20 container px-4 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{formula.title}</h1>
                    </div>
                </section>

                <div className="container px-4 md:px-6 mx-auto py-16 space-y-24">
                    {/* Concept & Benefits */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Description */}
                        <div className="prose prose-stone text-lg md:text-xl text-stone-700 text-center mx-auto">
                            <PortableText value={formula.description} />
                        </div>

                        {/* Benefits List */}
                        {formula.benefits && formula.benefits.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                                <h3 className="text-xl font-bold mb-6 text-center text-stone-900">Pourquoi choisir cette formule ?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {formula.benefits.map((benefit: string, i: number) => (
                                        <div key={i} className="flex flex-col items-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[var(--brand-water)]/10 text-[var(--brand-water)] flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <p className="font-medium text-stone-800">{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content based on Format */}
                    {formula.format !== 'multi' ? (
                        <>
                            {/* Calendar */}
                            <div className="space-y-8">
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-bold text-stone-900">Prochaines dates {formula.title}</h2>
                                    <p className="text-stone-600 max-w-2xl mx-auto">
                                        Retrouvez ici toutes les sessions programmées pour ce format.
                                    </p>
                                </div>
                                <EventsCalendar events={formula.events} />
                            </div>

                            {/* Activities List */}
                            <div className="space-y-8">
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-bold text-stone-900">Toutes les activités {formula.title}</h2>
                                    <p className="text-stone-600 max-w-2xl mx-auto">
                                        Explorez notre catalogue complet.
                                    </p>
                                </div>
                                <Suspense fallback={<div>Chargement...</div>}>
                                    <ActivityFilterableList initialActivities={formula.activities} hideFilters={true} />
                                </Suspense>
                            </div>
                        </>
                    ) : (
                        /* Sur-Mesure / Multi Layout */
                        <div className="text-center space-y-8 bg-white p-12 rounded-2xl shadow-sm border border-stone-100 max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-stone-900">Votre Aventure Unique</h2>
                            <p className="text-stone-600 text-lg">
                                Pour les projets multi-activités, les groupes ou les demandes spécifiques, nous construisons le programme ensemble.
                            </p>
                            <Button asChild size="lg" className="bg-[var(--brand-water)] text-white hover:brightness-90 px-8 text-lg">
                                <Link href="/contact">Contacter le Guide</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        )
    }

    // --- ACTIVITY VIEW (Original) ---
    const activity = data;
    // Remap imageUrl to mainImageUrl used in query for Consistency check or just use mainImageUrl
    const heroImage = activity.mainImageUrl;

    // Choose the event to display details from (e.g., the first upcoming one)
    const displayEvent = activity.upcomingEvents && activity.upcomingEvents.length > 0 ? activity.upcomingEvents[0] : null;

    // Fallback or empty states if no events
    const displayDifficulty = displayEvent?.difficulty;
    const displayDuration = displayEvent?.duration || "Durée variable";
    const displayDescription = displayEvent?.description;
    const displayProgram = displayEvent?.program;
    const displayEquipment = displayEvent?.equipment;
    const displayProvidedEquipment = displayEvent?.providedEquipment;
    const displayLocationInfo = displayEvent?.locationInfo;
    const displayLocationEmbedUrl = displayEvent?.locationEmbedUrl;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="relative h-[60vh] md:h-[70vh]">
                {heroImage ? (
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-stone-800" />
                )}

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="container mx-auto">
                        <div className="flex gap-2 mb-4">
                            <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-0 text-white uppercase tracking-wider">
                                {activity.format}
                            </Badge>
                            {activity.categories && activity.categories.map((cat: { title: string }, i: number) => (
                                <Badge key={i} variant="outline" className="border-white/50 text-white uppercase tracking-wider">
                                    {cat.title}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{activity.title}</h1>
                        <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-200">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[var(--brand-water)]" />
                                <span>{displayDuration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[var(--brand-rock)]" />
                                <span>1 à 5 pers.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--brand-earth)]" />
                                <span>Hautes-Alpes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="experience" className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto mb-8 bg-transparent border-b border-stone-200 h-auto p-0 rounded-none">
                            <TabsTrigger
                                value="experience"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                            >
                                L'expérience
                            </TabsTrigger>
                            {displayProgram && (
                                <TabsTrigger
                                    value="program"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                >
                                    Au programme
                                </TabsTrigger>
                            )}
                            {(displayEquipment || displayProvidedEquipment) && (
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
                                {Array.isArray(displayDescription)
                                    ? <PortableText value={displayDescription} />
                                    : <p>Description détaillée à venir ou non disponible pour les sessions actuelles.</p>
                                }
                            </div>
                        </TabsContent>

                        {/* Program Tab */}
                        {displayProgram && (
                            <TabsContent value="program" className="outline-none animate-in fade-in-50 duration-500">
                                <h3 className="text-xl font-bold mb-6">Déroulement de la sortie</h3>
                                <div className="space-y-8 border-l-2 border-stone-200 ml-3 pl-8 py-2 relative">
                                    {displayProgram.map((step: any, i: number) => (
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
                        {(displayEquipment || displayProvidedEquipment) && (
                            <TabsContent value="equipment" className="outline-none animate-in fade-in-50 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                        <h4 className="font-bold text-[var(--brand-rock)] mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            Fourni par le guide
                                        </h4>
                                        {displayProvidedEquipment && displayProvidedEquipment.length > 0 ? (
                                            <ul className="space-y-3">
                                                {displayProvidedEquipment.map((item: string, i: number) => (
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
                                        {displayEquipment && displayEquipment.length > 0 ? (
                                            <ul className="space-y-3">
                                                {displayEquipment.map((item: string, i: number) => (
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
                            {displayLocationInfo && (
                                <div>
                                    <h3 className="font-bold text-lg mb-3">Informations d'accès</h3>
                                    <div className="bg-stone-50 p-6 rounded-xl text-stone-700 leading-relaxed border-l-4 border-[var(--brand-water)]">
                                        {displayLocationInfo}
                                    </div>
                                </div>
                            )}

                            {displayLocationEmbedUrl && (
                                <div>
                                    <h3 className="font-bold text-lg mb-3">Carte</h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
                                        <iframe
                                            src={getMapSrc(displayLocationEmbedUrl)}
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

                            {!displayLocationInfo && !displayLocationEmbedUrl && (
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

                {/* Sidebar / Sticky Booking */}
                <div className="relative">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-stone-500 text-sm">Prix par personne à partir de</p>
                                    <p className="text-3xl font-bold text-stone-900">
                                        {activity.upcomingEvents && activity.upcomingEvents.length > 0
                                            ? `${Math.min(...activity.upcomingEvents.map((e: any) => e.price))}€`
                                            : <span className="text-xl">Sur devis / Voir calendrier</span>
                                        }
                                    </p>
                                </div>
                                {displayDifficulty && (
                                    <div className="text-right">
                                        <div className={`text-${displayDifficulty.color}-600 font-bold`}>
                                            Niveau {displayDifficulty.level}
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="text-xs text-stone-400 cursor-help border-b border-dashed border-stone-300 inline-block">
                                                        {displayDifficulty.title}
                                                    </div>
                                                </TooltipTrigger>
                                                {displayDifficulty.description && (
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-sm">{displayDifficulty.description}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-stone-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[var(--brand-water)]" />
                                    Prochaines dates
                                </h4>

                                {activity.upcomingEvents && activity.upcomingEvents.length > 0 ? (
                                    <div className="space-y-2">
                                        {activity.upcomingEvents.map((event: any) => (
                                            <div key={event._id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                <div className="flex flex-col">
                                                    <div className="flex items-baseline gap-2 flex-wrap">
                                                        <span className="font-bold text-stone-900">
                                                            {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                            {event.title && <span className="font-normal text-stone-600 block text-xs">{event.title}</span>}
                                                        </span>
                                                        <span className="text-sm font-semibold text-[var(--brand-rock)]">{event.price}€</span>
                                                    </div>
                                                    <span className="text-xs text-stone-500">
                                                        {event.seatsAvailable ?? (event.maxParticipants - (event.bookedCount || 0))} places restantes
                                                    </span>
                                                </div>
                                                <BookingButton
                                                    eventId={event._id}
                                                    activityTitle={activity.title}
                                                    price={event.price}
                                                    date={event.date}
                                                    image={heroImage}
                                                    size="sm"
                                                    className="bg-[var(--brand-rock)] text-white hover:bg-stone-800"
                                                >
                                                    Réserver
                                                </BookingButton>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-stone-500 italic bg-stone-50 p-4 rounded-lg text-center">
                                        Pas de date confirmée pour le moment.
                                    </div>
                                )}

                                <div className="pt-2 border-t border-stone-100">
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href="/calendrier">Voir tout le calendrier</Link>
                                    </Button>
                                </div>
                                <Button className="w-full bg-[var(--brand-water)] hover:brightness-90 text-white transition-all" asChild>
                                    <Link href="/contact">Demander une date sur-mesure</Link>
                                </Button>


                            </div>

                            <p className="mt-4 text-xs text-center text-stone-400">
                                Paiement sécurisé via Stripe • Annulation flexible
                            </p>
                        </div>

                        {/* Guide Teaser */}
                        <div className="bg-stone-900 text-white p-6 rounded-2xl">
                            <h4 className="font-bold text-lg mb-2">Votre Guide</h4>
                            <p className="text-stone-300 text-sm mb-4">
                                "Je vous accompagne pour vivre une expérience authentique, en sécurité et dans la bonne humeur."
                            </p>
                            <Link href="/guide" className="text-sm underline decoration-[var(--brand-water)] underline-offset-4 hover:text-[var(--brand-water)]">
                                Lire ma bio &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
