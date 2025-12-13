import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ActivityFormats } from "@/components/ActivityFormats";
import { ActivityPreviewSection } from "@/components/ActivityPreviewSection";
import { SiteFooter } from "@/components/SiteFooter";

export const revalidate = 60; // Revalidate every 60 seconds

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Hero />
      <Features />
      <ActivityFormats />
      <ActivityPreviewSection />
      <SiteFooter />
    </main>
  );
}
