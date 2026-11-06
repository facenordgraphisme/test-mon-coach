import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Polices auto-hébergées par next/font (aucune requête vers Google côté visiteur, compatible CSP).
// Polices variables : un seul fichier par police couvre toutes les graisses.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

import { Navbar } from "@/components/Navbar";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { generateSiteGraph } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.revesdaventures.fr'),
  title: {
    template: "%s | Rêves d'Aventures",
    default: "Rêves d'Aventures | Escalade, Canyoning & VTT Hautes-Alpes"
  },
  description: "Guide de haute montagne et coaching sportif dans les Hautes-Alpes. Activités exclusives d'Escalade, Canyoning et VTT autour du Lac de Serre-Ponçon, Embrun et Guillestre.",
  keywords: ["Escalade Hautes-Alpes", "Canyoning Serre-Ponçon", "VTT Embrun", "Guide de haute montagne Hautes-Alpes", "Activités plein air Serre-Ponçon", "Coaching sportif 05"],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.revesdaventures.fr',
    title: "Rêves d'Aventures | Aventures Exclusives Hautes-Alpes",
    description: 'Guide de haute montagne et coaching sportif. Escalade, Canyon et VTT au Lac de Serre-Ponçon.',
    siteName: "Rêves d'Aventures",
    images: [{ url: '/assets/og-default.png', width: 1200, height: 630 }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    // Variables de police sur <html> : Tailwind applique la police de base sur <html>,
    // elles doivent donc y être définies (sur <body>, la police n'était jamais appliquée).
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd data={generateSiteGraph()} />
        <meta name="google-site-verification" content="XsbGoMP_MF6Gq47M4_-y3DsnLliVhH88Tb6kkPCiEuc" />
      </head>
      <body
        className="antialiased"
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
