const dynamic = 'force-dynamic'

import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LevelDescriptions } from "@/components/LevelDescriptions";
import { ActivityFormats } from "@/components/ActivityFormats";
import { ActivityPreviewSection } from "@/components/ActivityPreviewSection";
import { FAQSection } from "@/components/FAQSection";
import { SiteFooter } from "@/components/SiteFooter";



import { ReviewSection } from "@/components/ReviewSection";

export default async function Home() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Hero />
      <ActivityFormats />
      <Features />
      <LevelDescriptions />
      <ActivityPreviewSection />
      <ReviewSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
