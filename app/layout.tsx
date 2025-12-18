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

export const metadata: Metadata = {
  title: "Rêves d'Aventures | Aventures Exclusives Hautes-Alpes",
  description: "Guides de haute montagne et coaching sportif en Escalade, Canyon, VTT. Des expériences exclusives, pensées pour vous en Hautes-Alpes. Mono, Duo et Multi activités.",
  keywords: ["Escalade", "Canyoning", "VTT", "Hautes-Alpes", "Guide", "Coaching", "Aventure", "Plein Air"],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://moncoachpleinair.com',
    title: "Rêves d'Aventures",
    description: 'Luxe, Nature et Sensations Pures.',
    siteName: 'Mon Coach Plein Air'
  }
};

import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
