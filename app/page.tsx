import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LevelDescriptions } from "@/components/LevelDescriptions";
import { ActivityFormats } from "@/components/ActivityFormats";
import { ActivityPreviewSection } from "@/components/ActivityPreviewSection";
import { SiteFooter } from "@/components/SiteFooter";

// export const revalidate = 60; // Disabled to prevent stale hydration issues during dev

export default async function Home() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <div className="w-full">
        <Hero />
      </div>
      <Features />
      <ActivityFormats />
      <LevelDescriptions />
      <ActivityPreviewSection />
      <SiteFooter />
    </main>
  );
}
