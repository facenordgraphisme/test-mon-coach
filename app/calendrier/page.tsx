import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { EventsCalendar } from "@/components/EventsCalendar";

async function getUpcomingEvents() {
    // Fetch events where date is in the future
    return client.fetch(groq`
        *[_type == "event" && date >= now()] | order(date asc) {
            _id,
           date,
           status,
           maxParticipants,
           bookedCount,
           activity->{
               title,
               "slug": slug.current,
               duration,
               price,
               difficulty->{
                   level,
                   color
               }
           }
        }
    `);
}

export const revalidate = 60;

export default async function CalendarPage() {
    const events = await getUpcomingEvents();

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <header className="bg-white border-b border-stone-100 pt-32 pb-12 px-4 md:px-6">
                <div className="container mx-auto max-w-5xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-stone-900">Calendrier des Sorties</h1>
                    <p className="text-stone-500 max-w-2xl">
                        Retrouvez toutes les prochaines dates confirmées.
                        Premier arrivé, premier servi ! (Max 5 pers.)
                    </p>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-5xl">
                <EventsCalendar events={events} />
            </main>
            <SiteFooter />
        </div>
    )
}
