import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingButton } from "@/components/BookingButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

async function getActivity(slug: string) {
    return client.fetch(groq`
        *[_type == "activity" && slug.current == $slug][0] {
            title,
            format,
            difficulty->{
                title,
                level,
                color,
                description
            },
            "imageUrl": mainImage.asset->url,
            "categories": categories[]->{title},
            price,
            duration,
            description,
            equipment,
            "upcomingEvents": *[_type == "event" && activity->slug.current == $slug && date >= now()] | order(date asc) [0...3] {
                date,
                status,
                _id,
                bookedCount,
                maxParticipants
            },
            "relatedActivities": *[_type == "activity" && count((categories[]->title)[@ in ^.categories[]->title]) > 0 && slug.current != $slug][0...3] {
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset->url
            }
        }
    `, { slug });
}

export const revalidate = 60;

export default async function SingleActivityPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const activity = await getActivity(slug);

    if (!activity) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="relative h-[60vh] md:h-[70vh]">
                {activity.imageUrl ? (
                    <div className="absolute inset-0">
                        <img
                            src={activity.imageUrl}
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
                                <span>{activity.duration}</span>
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
                <div className="lg:col-span-2 space-y-12">
                    {/* Description (Portable Text to be added properly later, using simplified render for now) */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[var(--brand-rock)] rounded-full block"></span>
                            L'expérience
                        </h2>
                        <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed">
                            {/* Simple fallback for now if it's raw text or blocks */}
                            {Array.isArray(activity.description)
                                ? activity.description.map((block: any, i: number) => (
                                    <p key={i}>{block.children?.map((child: any) => child.text).join('')}</p>
                                ))
                                : <p>Description détaillée à venir.</p>
                            }
                        </div>
                    </section>

                    {/* Equipment */}
                    {activity.equipment && (
                        <section className="bg-stone-50 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">Matériel requis</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {activity.equipment.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-stone-700">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar / Sticky Booking */}
                <div className="relative">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-stone-500 text-sm">Prix par personne</p>
                                    <p className="text-3xl font-bold text-stone-900">{activity.price}€</p>
                                </div>
                                {activity.difficulty && (
                                    <div className="text-right">
                                        <div className={`text-${activity.difficulty.color}-600 font-bold`}>
                                            Niveau {activity.difficulty.level}
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="text-xs text-stone-400 cursor-help border-b border-dashed border-stone-300 inline-block">
                                                        {activity.difficulty.title}
                                                    </div>
                                                </TooltipTrigger>
                                                {activity.difficulty.description && (
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-sm">{activity.difficulty.description}</p>
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
                                                    <span className="font-bold text-stone-900">
                                                        {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                    </span>
                                                    <span className="text-xs text-stone-500">
                                                        {event.bookedCount || 0}/{event.maxParticipants} places
                                                    </span>
                                                </div>
                                                <BookingButton
                                                    eventId={event._id}
                                                    activityTitle={activity.title}
                                                    price={activity.price}
                                                    date={event.date}
                                                    image={activity.imageUrl}
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
                                        <Link href="/calendar">Voir tout le calendrier</Link>
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
                    </div >
                </div >
            </main >

            <SiteFooter />
        </div >
    )
}
