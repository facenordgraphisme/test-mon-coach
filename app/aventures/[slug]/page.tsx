import { client, urlFor } from "@/lib/sanity";
import { formatTimeParis } from "@/lib/utils";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsCalendar } from "@/components/EventsCalendar";
import { ActivityFilterableList } from "@/components/ActivityFilterableList";
import { BookingButton } from "@/components/BookingButton";
import { Button } from "@/components/ui/button";
import { GoBackButton } from "@/components/GoBackButton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Suspense } from 'react';
import { PortableText } from '@portabletext/react';
import { generateSeoMetadata } from "@/lib/seo";
import { ptComponents } from "@/components/PortableTextComponents";
import { Metadata } from "next";

async function getData(slug: string) {
    // Default Behavior: Activity or Formula documents
    const doc = await client.fetch(groq`
        *[( _type == "activity" || _type == "formula" ) && slug.current == $slug][0] {
            _type,
            title,
            slug,
            format,
            participantsRange,
            durationMode,
            
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
            "difficulties": difficulties[]->{
                title,
                level,
                color,
                description
            },
            "mainImageUrl": mainImage.asset->url,
            "categories": categories[]->{title},
            duration,
            "practicalInfo": practicalInfo,
            hasRental,
            rentalDescription,
            seo,
            "availableBikes": availableBikes[]->{
                name,
                description,
                priceHalfDay,
                priceFullDay,
                image
            },

            "upcomingEvents": *[_type == "event" && activity->slug.current == $slug && date >= now()] | order(date asc) [0...3] {
                date,
                status,
                _id,
                title,
                price,
                bookedCount,
                seatsAvailable,
                maxParticipants,
                privatizationPrice,
                difficulty->{
                    title,
                    level,
                    color
                },
                duration,
                description,
                program,
                equipment,
                providedEquipment,
                locationInfo,
                locationEmbedUrl
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

    // 2. If it's a Formula (generic), fetch extras.
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
                    categories[]->{
                        title,
                        element
                    },
                    duration,
                    durationMode,
                    "difficulties": difficulties[]->{
                        title,
                        level,
                        color
                    },
                    "upcomingEvents": *[_type == "event" && references(^._id) && date > now()] | order(date asc) {
                        price,
                        difficulty->{
                            title,
                            level,
                            color
                        }
                    }
                }
            }
        `, { format: doc.format });

        return { ...doc, ...extraData };
    }

    // Fetch Site Settings for Card Button
    const settings = await client.fetch(groq`*[_type == "siteSettings"][0] { cardButtonText }`, {}, { next: { revalidate: 0 } });

    return { ...doc, cardButtonText: settings?.cardButtonText };
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    // Default for Activity / other Formula documents
    const doc = await client.fetch(groq`
        *[( _type == "activity" || _type == "formula" ) && slug.current == $slug][0] {
            title,
            description,
            "imageUrl": coalesce(mainImage.asset->url, heroImage.asset->url),
            seo
        }
    `, { slug });

    return generateSeoMetadata(doc?.seo, {
        title: doc?.title,
        description: "Mon Coach Plein Air - Aventures dans les Hautes Alpes",
        url: `https://moncoachpleinair.com/aventures/${slug}`
    });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        notFound();
    }

    // --- FORMULA VIEW (Generic) ---
    if (data._type === 'formula') {
        const formula = data;

        const displayTitle = formula.title || formula.subtitle;
        const displayImage = formula.imageUrl;
        const displayDesc = formula.description;
        const displayBenefits = formula.benefits;
        const displaySubtitle = formula.subtitle;
        const customJsonLd = formula?.seo?.structuredData ? JSON.parse(formula.seo.structuredData) : null;


        return (
            <main className="min-h-screen bg-stone-50">
                {customJsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(customJsonLd) }}
                    />
                )}

                {/* Hero Section */}
                <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={displayTitle}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-stone-900 w-full h-full" />
                        )}
                    </div>
                    <div className="absolute top-24 left-4 md:left-8 z-30">
                        <GoBackButton label="Retour" className="bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white hover:text-white" variant="ghost" />
                    </div>
                    <div className="relative z-20 container px-4 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{displayTitle}</h1>
                        {displaySubtitle && (
                            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 text-stone-100 font-medium">
                                {displaySubtitle}
                            </p>
                        )}
                    </div>
                </section>

                <div className="container px-4 md:px-6 mx-auto py-16 space-y-24">
                    {/* Concept & Benefits */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Description */}
                        <div className="prose prose-stone text-lg md:text-xl text-stone-700 text-center mx-auto">
                            <PortableText value={displayDesc} components={ptComponents} />
                        </div>

                        {/* Benefits List */}
                        {displayBenefits && displayBenefits.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                                <h3 className="text-xl font-bold mb-6 text-center text-stone-900">Pourquoi choisir cette formule ?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {displayBenefits.map((benefit: string, i: number) => (
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

                    {/* Generic Formula Layout */}
                    {/* Activities List */}
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold text-stone-900">Toutes les activités {formula.title}</h2>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                Explorez notre catalogue complet.
                            </p>
                        </div>
                        <Suspense fallback={<div>Chargement...</div>}>
                            <ActivityFilterableList
                                initialActivities={formula.activities}
                                hideFormatFilter={true}
                                hideElementFilter={false}
                            />
                        </Suspense>
                    </div>

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
                </div>
            </main>
        )
    }

    // --- ACTIVITY VIEW ---
    const activity = data;
    // Remap imageUrl to mainImageUrl used in query for Consistency check or just use mainImageUrl
    const heroImage = activity.mainImageUrl;
    const displayTitle = activity.title;

    // Choose the event to display details from (e.g., the first upcoming one)
    const displayEvent = activity.upcomingEvents && activity.upcomingEvents.length > 0 ? activity.upcomingEvents[0] : null;

    // Fallback or empty states if no events
    // Difficulty Logic: Prefer activity list, fallback to event default or null
    let displayDifficultyLabel = "Niveau Variable";
    if (activity.difficulties && activity.difficulties.length > 0) {
        // Example: Sort by level and show range or list
        const levels = activity.difficulties.map((d: any) => d.level).sort((a: any, b: any) => a - b);
        if (levels.length > 1) {
            displayDifficultyLabel = `Niveaux ${levels.join(', ')}`; // Simple comma list
            // Or range: `Niveaux ${levels[0]} à ${levels[levels.length - 1]}`
        } else {
            displayDifficultyLabel = `Niveau ${levels[0]}`;
        }
    } else if (displayEvent?.difficulty) {
        displayDifficultyLabel = `Niveau ${displayEvent.difficulty.level}`;
    }

    // Determine display duration based on mode
    let displayDuration = activity.duration || displayEvent?.duration || "Durée variable";

    // Helper to check duration mode safely (whether string, array, or undefined)
    const hasMode = (mode: string) => {
        if (Array.isArray(activity.durationMode)) return activity.durationMode.includes(mode);
        return activity.durationMode === mode;
    }

    if (hasMode('half_day') && hasMode('full_day')) {
        displayDuration = "Demi-journée ou Journée";
    } else if (hasMode('half_day')) {
        displayDuration = "Demi-journée";
    } else if (hasMode('full_day')) {
        displayDuration = "Journée";
    }

    const displayDescription = activity.description || displayEvent?.description;

    // For these, we rely on the session (event) data as they are no longer on the activity
    const displayProgram = displayEvent?.program;
    const displayEquipment = displayEvent?.equipment;
    const displayProvidedEquipment = displayEvent?.providedEquipment;
    const displayLocationInfo = displayEvent?.locationInfo;
    const displayLocationEmbedUrl = displayEvent?.locationEmbedUrl;
    const displayPracticalInfo = activity.practicalInfo;


    const customJsonLd = activity?.seo?.structuredData ? JSON.parse(activity.seo.structuredData) : null;

    return (
        <div className="min-h-screen bg-white">
            {customJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(customJsonLd) }}
                />
            )}

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

                <div className="absolute top-24 left-4 md:left-8 z-30">
                    <GoBackButton label="Retour" className="bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white hover:text-white" variant="ghost" />
                </div>

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
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{displayTitle}</h1>
                        {/* Subtitle removed as it was only an override in previous logic */}
                        <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-200">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[var(--brand-water)]" />
                                <span>{displayDuration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--brand-earth)]" />
                                <span>Hautes-Alpes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    {(activity.difficulties && activity.difficulties.length > 0 ? activity.difficulties : (displayEvent?.difficulty ? [displayEvent.difficulty] : [])).map((diff: any, i: number) => (
                                        <Tooltip key={i}>
                                            <TooltipTrigger asChild>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white cursor-help hover:bg-white/30 transition-colors`}>
                                                    Niveau {diff.level}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-stone-900 border border-stone-200 shadow-xl">
                                                <div className="text-sm max-w-[200px] text-left">
                                                    <p className="font-bold mb-1 pt-1 text-stone-900">{diff.title}</p>
                                                    {diff.description && <p className="mb-2 text-xs font-normal text-stone-600">{diff.description}</p>}
                                                    <Link href="/niveaux" className="text-[var(--brand-water)] hover:underline text-xs font-medium pb-1 block">
                                                        En savoir plus
                                                    </Link>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </TooltipProvider>
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

                            {(displayEquipment || displayProvidedEquipment) && (
                                <TabsTrigger
                                    value="equipment"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                >
                                    Matériel
                                </TabsTrigger>
                            )}

                            {activity.hasRental && (
                                <TabsTrigger
                                    value="rental"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--brand-rock)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-stone-600 data-[state=active]:text-[var(--brand-rock)] font-bold text-base bg-transparent"
                                >
                                    Location
                                </TabsTrigger>
                            )}
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
                                    ? <PortableText value={displayDescription} components={ptComponents} />
                                    : <p>Description détaillée à venir ou non disponible pour les sessions actuelles.</p>
                                }
                            </div>
                        </TabsContent>

                        {/* Program Tab */}


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



                        {/* Rental Tab */}
                        {activity.hasRental && (
                            <TabsContent value="rental" className="outline-none animate-in fade-in-50 duration-500 space-y-8">
                                {activity.rentalDescription && (
                                    <>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-8 h-1 bg-[var(--brand-rock)] rounded-full block"></span>
                                            Location de matériel
                                        </h3>
                                        <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed">
                                            <PortableText value={activity.rentalDescription} components={ptComponents} />
                                        </div>
                                    </>
                                )}

                                {activity.availableBikes && activity.availableBikes.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-8 h-1 bg-[var(--brand-water)] rounded-full block"></span>
                                            Tarifs
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {activity.availableBikes.map((bike: any, i: number) => (
                                                <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                                                    {bike.image && (
                                                        <div className="h-48 overflow-hidden bg-stone-100">
                                                            <img
                                                                src={urlFor(bike.image).url()}
                                                                alt={bike.name}
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-5">
                                                        <h4 className="font-bold text-lg text-stone-900 mb-2">{bike.name}</h4>
                                                        {bike.description && (
                                                            <p className="text-stone-600 text-sm mb-4 line-clamp-2" title={bike.description}>
                                                                {bike.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                                            {/* Logic for Half Day */}
                                                            {(
                                                                (!activity.durationMode || (Array.isArray(activity.durationMode) ? activity.durationMode.includes('half_day') : activity.durationMode === 'half_day') || (Array.isArray(activity.durationMode) ? activity.durationMode.includes('variable') : activity.durationMode === 'variable'))
                                                            ) && (
                                                                    <div className="text-center flex-1">
                                                                        <p className="text-xs text-stone-500 uppercase font-bold">1/2 Journée</p>
                                                                        <p className="font-bold text-stone-900">{bike.priceHalfDay}€</p>
                                                                    </div>
                                                                )}

                                                            {/* Divider if both shown */}
                                                            {(
                                                                (!activity.durationMode || (Array.isArray(activity.durationMode) ? (activity.durationMode.includes('half_day') && activity.durationMode.includes('full_day')) : activity.durationMode === 'variable'))
                                                            ) && (
                                                                    <div className="w-px h-8 bg-stone-200 mx-2"></div>
                                                                )}

                                                            {/* Logic for Full Day */}
                                                            {(
                                                                (!activity.durationMode || (Array.isArray(activity.durationMode) ? activity.durationMode.includes('full_day') : activity.durationMode === 'full_day') || (Array.isArray(activity.durationMode) ? activity.durationMode.includes('variable') : activity.durationMode === 'variable'))
                                                            ) && (
                                                                    <div className="text-center flex-1">
                                                                        <p className="text-xs text-stone-500 uppercase font-bold">Journée</p>
                                                                        <p className="font-bold text-[var(--brand-rock)]">{bike.priceFullDay}€</p>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        )}

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


                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="sticky top-32 space-y-8">
                        {/* Next Events Card */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                            <h3 className="font-bold text-xl mb-6 text-stone-900">Prochains départs</h3>

                            {activity.upcomingEvents && activity.upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {activity.upcomingEvents.map((event: any) => (
                                        <div key={event._id} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                                            <div className="flex gap-4">
                                                {/* Thumbnail */}
                                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                                    {(activity.mainImageUrl || activity.imageUrl) ? (
                                                        <img
                                                            src={activity.mainImageUrl || activity.imageUrl}
                                                            alt={event.title || activity.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <MapPin className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="font-bold text-stone-900 leading-tight">
                                                        {event.title || activity.title}
                                                    </h4>

                                                    <p className="text-sm text-stone-500 capitalize">
                                                        {format(new Date(event.date), 'EEEE d MMMM', { locale: fr })}
                                                    </p>
                                                    <p className="text-xs text-stone-400">
                                                        {formatTimeParis(event.date)}
                                                    </p>

                                                    {event.difficulty && (
                                                        <div className="pt-1">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${event.difficulty.color}-100 text-${event.difficulty.color}-700`}>
                                                                Niveau {event.difficulty.level}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg text-[var(--brand-rock)]">{event.price}€</span>
                                                    <span className="text-[10px] text-stone-400">
                                                        {event.seatsAvailable !== undefined ? `${event.seatsAvailable} places` : 'Places dispos'}
                                                    </span>
                                                </div>
                                                <BookingButton
                                                    eventId={event._id}
                                                    activityTitle={activity.title}
                                                    price={event.price}
                                                    date={event.date}
                                                    className="h-9 px-4 text-xs bg-[var(--brand-water)] hover:brightness-90 text-white"
                                                >
                                                    {data.cardButtonText || "Réserver"}
                                                </BookingButton>
                                            </div>
                                        </div>
                                    ))}
                                    <Button asChild variant="outline" className="w-full mt-4">
                                        <Link href="/calendrier">Voir tout le calendrier</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-stone-500 mb-4">Pas de dates prévues prochainement.</p>
                                    <Button asChild className="w-full bg-[var(--brand-rock)] hover:bg-[var(--brand-rock)]/90 text-white">
                                        <Link href="/contact">Demander une date</Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Practical Info Card (Restored/Added) */}
                        {displayPracticalInfo && (
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h3 className="font-bold text-lg mb-4 text-[var(--brand-rock)]">Infos Pratiques</h3>
                                <div className="prose prose-sm prose-stone text-stone-600">
                                    <PortableText value={displayPracticalInfo} components={ptComponents} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
