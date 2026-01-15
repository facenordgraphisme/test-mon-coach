"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
    data: any;
}

export function Hero({ data }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Images array
    const images = data?.gallery?.length ? data.gallery : (data?.heroImageUrl ? [data.heroImageUrl] : ["/assets/AFZN9428.JPG"]);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [images]);

    // Defaults / Fallbacks while loading or if empty
    const heroTitle = data?.heroTitle || "Des expériences exclusives, pensées pour vous.";
    const heroSubtitle = data?.heroSubtitle || "Escalade, Canyon, VTT en Hautes-Alpes. Vivez le luxe des sensations pures, sans la foule.";
    const ctaText = data?.ctaText || "Réserver une aventure";
    const ctaLink = data?.ctaLink || "/calendrier";

    const flexibleOffer1 = data?.flexibleOffer1 || "3 Formules : Mono, Duos, Multi";
    const flexibleOffer2 = data?.flexibleOffer2 || "3 Niveaux : Découverte, Aventure, Warrior";
    const flexibleOffer3 = data?.flexibleOffer3 || "3 Durées : ½ journée, Journée, Semaine";


    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Hero background"
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.8, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </AnimatePresence>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-stone-900/60" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 container px-4 md:px-6 text-center text-white space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-stone-200 uppercase mb-6 drop-shadow-md">
                        Rêves d'Aventures
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 drop-shadow-2xl text-white">
                        {heroTitle}
                    </h1>
                    <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-80 mb-8" />
                    <p className="text-xl md:text-2xl font-light text-stone-100 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                        {heroSubtitle}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-center mb-12"
                    >
                        {[flexibleOffer1, flexibleOffer2, flexibleOffer3].map((text: string, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 text-lg md:text-xl font-bold text-stone-100 tracking-wide cursor-default transition-colors duration-300"
                            >
                                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_var(--brand-water)]" />
                                <span className="drop-shadow-md">{text}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild variant="secondary" size="lg" className="h-14 px-8 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border-none transform hover:-translate-y-1 transition-all duration-300">
                            <Link href={ctaLink}>
                                {ctaText}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-bold bg-transparent text-white border-white hover:bg-white/10 hover:text-white shadow-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300">
                            <Link href="/aventures">
                                Découvrir les formules
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.button
                onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors z-20 p-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 2,
                    duration: 1,
                }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-10 h-10 md:w-12 md:h-12" />
                </motion.div>
            </motion.button>
        </section>
    );
}
