import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { EventsCalendar } from "@/components/EventsCalendar";
import { PageHero } from "@/components/PageHero";

async function getUpcomingEvents() {
    // Fetch events where date is in the future
    return client.fetch(groq`
        *[_type == "event" && date >= now()] | order(date asc) {
            _id,
            title,
            date,
            status,
            maxParticipants,
            seatsAvailable,
            bookedCount,
            price,
            privatizationPrice,
            duration,
            difficulty-> {
                title,
                level,
                color
            },
            activity -> {
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset -> url
            }
    }
`);
}

export const revalidate = 60;

export default async function CalendarPage() {
    const events = await getUpcomingEvents();

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <PageHero
                title="Le Calendrier"
                subtitle="Retrouvez toutes les prochaines dates confirmées. Premier arrivé, premier servi ! (Max 5 pers.)"
                label="PLANNING"
                image="/assets/100_0070.JPG"
            />

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-5xl">
                <EventsCalendar events={events} />
            </main>
            <SiteFooter />
        </div>
    )
}
