import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { EventsCalendar } from "@/components/EventsCalendar";
import { PageHero } from "@/components/PageHero";

async function getData() {
    // 1. Fetch Events
    const events = await client.fetch(groq`
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
            difficulty-> { title, level, color },
            activity -> { title, "slug": slug.current, "imageUrl": mainImage.asset -> url, format }
        }
    `);

    // 2. Fetch Page Content
    const pageContent = await client.fetch(groq`*[_type == "calendarPage"][0] {
        heroTitle,
        heroSubtitle,
        heroLabel,
        "heroImage": heroImage.asset->url,
        seo
    }`);

    // 3. Fetch Site Settings for Card Button
    const settings = await client.fetch(groq`*[_type == "siteSettings"][0] { cardButtonText }`, {}, { next: { revalidate: 0 } });

    return { events, pageContent, cardButtonText: settings?.cardButtonText };
}

export const revalidate = 60;

export default async function CalendarPage() {
    const { events, pageContent, cardButtonText } = await getData();

    // Fallback if no page content
    const hero = pageContent || {
        heroTitle: "Le Calendrier",
        heroSubtitle: "Retrouvez toutes les prochaines dates confirmées. Premier arrivé, premier servi ! (Max 5 pers.)",
        heroLabel: "PLANNING",
        heroImage: "/assets/100_0070.JPG"
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <PageHero
                title={hero.heroTitle}
                subtitle={hero.heroSubtitle}
                label={hero.heroLabel}
                image={hero.heroImage}
            />

            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-5xl">
                <EventsCalendar events={events} buttonText={cardButtonText} />
            </main>
            <SiteFooter />
        </div>
    )
}
