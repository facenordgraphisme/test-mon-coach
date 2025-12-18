"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
    title: string;
    subtitle?: string;
    label?: string;
    image: string;
}

export function PageHero({ title, subtitle, label, image }: PageHeroProps) {
    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center bg-stone-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-stone-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 container px-4 md:px-6 text-center text-white space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {label && (
                        <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-stone-200 uppercase mb-6 drop-shadow-md">
                            {label}
                        </h2>
                    )}

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 drop-shadow-2xl text-white">
                        {title}
                    </h1>

                    <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-80 mb-8" />

                    {subtitle && (
                        <p className="text-xl md:text-2xl font-light text-stone-100 max-w-2xl mx-auto leading-relaxed drop-shadow-lg p-2">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
