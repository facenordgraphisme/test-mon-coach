import Link from "next/link"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

async function getHeroContent() {
    try {
        return await client.fetch(groq`
            *[_type == "homepage"][0] {
                heroTitle,
                heroSubtitle,
                "heroImageUrl": heroImage.asset->url,
                ctaText,
                ctaLink
            }
        `);
    } catch (e) {
        return null;
    }
}

export async function Hero() {
    const content = await getHeroContent();

    // Fallbacks
    const title = content?.heroTitle || "Des expériences exclusives, pensées pour vous.";
    const subtitle = content?.heroSubtitle || "Escalade, Canyon, VTT en Hautes-Alpes. Vivez le luxe des sensations pures, sans la foule.";
    const imageUrl = content?.heroImageUrl;
    const ctaText = content?.ctaText || "Réserver une aventure";
    const ctaLink = content?.ctaLink || "/calendrier";

    return (
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="relative w-full h-full">
                        <img
                            src="/assets/AFZN9428.JPG"
                            alt="Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                )}
            </div>

            <div className="relative z-20 container px-4 md:px-6 text-center text-white space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-200">
                        Mon Coach Plein Air
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none text-balance max-w-4xl mx-auto drop-shadow-lg">
                        {title}
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-200 md:leading-relaxed drop-shadow-md">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-8 text-lg">
                        <Link href={ctaLink}>
                            {ctaText}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 text-lg backdrop-blur-sm">
                        <Link href="/activities">
                            Découvrir les formules
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block text-white/70">
                <span className="sr-only">Scroll down</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
            </div>
        </section>
    )
}
