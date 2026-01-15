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

import { generateSeoMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

async function getData() {
  return await client.fetch(groq`*[_type == "homepage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImageUrl": heroImage.asset->url,
    "gallery": heroGallery[].asset->url,
    ctaText,
    ctaLink,
    flexibleOffer1,
    flexibleOffer2,
    flexibleOffer3,
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
    featuresCtaLink,
    faq,
    seo
  }`, {}, { next: { revalidate: 10 } });
}

export async function generateMetadata() {
  const data = await getData();
  return generateSeoMetadata(data?.seo, {
    title: "Rêves d'Aventures | Aventures Exclusives Hautes-Alpes",
    description: "Guides de haute montagne et coaching sportif en Escalade, Canyon, VTT. Des expériences exclusives, pensées pour vous en Hautes-Alpes.",
    url: 'https://moncoachpleinair.com',
  });
}

export default async function Home() {
  const data = await getData() || {};
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const customJsonLd = data?.seo?.structuredData ? JSON.parse(data.seo.structuredData) : null;


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, websiteSchema, customJsonLd].filter(Boolean)) }}
      />
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Hero data={data} />
        <ActivityFormats />
        <Features data={data} />
        <LevelDescriptions />
        <ActivityPreviewSection />
        <ReviewSection />
        <FAQSection data={data?.faq} />
        <SiteFooter />
      </div>
    </>
  );
}

