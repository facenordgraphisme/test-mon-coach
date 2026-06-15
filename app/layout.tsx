import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Navbar } from "@/components/Navbar";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { generateLocalBusinessSchema, generateOrganizationSchema } from "@/lib/seo";

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
  const localBusinessSchema = generateLocalBusinessSchema();
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusinessSchema, orgSchema]) }}
        />
        <meta name="google-site-verification" content="XsbGoMP_MF6Gq47M4_-y3DsnLliVhH88Tb6kkPCiEuc" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
