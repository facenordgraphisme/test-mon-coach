const dynamic = 'force-dynamic'

import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LevelDescriptions } from "@/components/LevelDescriptions";
import { ActivityFormats } from "@/components/ActivityFormats";
import { ActivityPreviewSection } from "@/components/ActivityPreviewSection";
import { FAQSection } from "@/components/FAQSection";
import { SiteFooter } from "@/components/SiteFooter";
import { ReviewSection } from "@/components/ReviewSection";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

async function getData() {
  return await client.fetch(groq`*[_type == "homepage"][0] {
    featuresQuote,
    featuresIntro,
    featuresDuoTitle,
    featuresDuoText,
    featuresDuoSubtext,
    featuresLuxeTitle,
    featuresLuxeText,
    featuresEcoTitle,
    featuresEcoText,
    featuresCtaText,
    featuresCtaLink
  }`);
}

export default async function Home() {
  const data = await getData() || {};

  return (
    <>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Hero />
        <ActivityFormats />
        <Features data={data} />
        <LevelDescriptions />
        <ActivityPreviewSection />
        <ReviewSection />
        <FAQSection />
        <SiteFooter />
      </div>
    </>
  );
}

