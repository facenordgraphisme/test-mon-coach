"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export type Activity = {
    title: string
    slug: string
    format: 'mono' | 'duo' | 'multi'
    difficulty?: {
        title: string
        color: string
    }
    imageUrl?: string
    categories?: { title: string }[]
}

export function ActivitySlider({ activities }: { activities: Activity[] }) {
    const [filter, setFilter] = useState<'mono' | 'duo' | 'all'>('mono')
    const [width, setWidth] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true
        return activity.format === filter
    })

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
        }
    }, [filteredActivities])

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <Button
                    variant={filter === 'mono' ? 'default' : 'outline'}
                    onClick={() => setFilter('mono')}
                    className={`rounded-full transition-all duration-300 ${filter === 'mono' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : 'text-stone-600 border-stone-200 hover:border-emerald-600 hover:text-emerald-600'}`}
                >
                    Mono-Activités
                </Button>
                <Button
                    variant={filter === 'duo' ? 'default' : 'outline'}
                    onClick={() => setFilter('duo')}
                    className={`rounded-full transition-all duration-300 ${filter === 'duo' ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : 'text-stone-600 border-stone-200 hover:border-amber-500 hover:text-amber-500'}`}
                >
                    Combinés Duo
                </Button>
            </div>

            {/* Draggable Slider Container */}
            <motion.div
                ref={carouselRef}
                className="cursor-grab overflow-hidden"
                whileTap={{ cursor: "grabbing" }}
            >
                {filteredActivities.length > 0 ? (
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6"
                    >
                        {filteredActivities.map((activity) => (
                            <motion.div
                                key={activity.slug}
                                className="min-w-[85%] md:min-w-[calc(33.333%-16px)]" // Mobile: 85% width, Desktop: (100% / 3) - gap correction
                            >
                                <div className="group relative block overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] hover:shadow-xl transition-all duration-300 select-none">
                                    {activity.imageUrl ? (
                                        <img
                                            src={activity.imageUrl}
                                            alt={activity.title}
                                            draggable={false} // Prevent native drag on image
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                                            <span>Image manquante</span>
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                        <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full mb-3 border border-white/30 ${activity.format === 'duo' ? 'text-amber-300 border-amber-500/30' : 'text-emerald-300 border-emerald-500/30'
                                                }`}>
                                                {activity.format === 'mono' ? 'Mono-activité' : activity.format === 'duo' ? 'Duo-activité' : 'Multi-jours'}
                                            </span>
                                            <h3 className="text-2xl font-bold mb-2 leading-tight">{activity.title}</h3>

                                            <Link href={`/aventures/${activity.slug}`} draggable={false} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pointer-events-none group-hover:pointer-events-auto">
                                                <span>Voir les détails</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="w-full py-12 text-center text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                        Aucune activité trouvée pour ce filtre.
                    </div>
                )}
            </motion.div>
        </div>
    )
}
