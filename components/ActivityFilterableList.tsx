"use client"

import { useState } from 'react';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Activity {
    title: string;
    slug: string;
    format: string;
    difficulty?: {
        title: string;
        level: number;
        color: string;
    };
    imageUrl?: string;
    categories?: {
        title: string;
    }[];
    price: number;
    duration: string;
}

interface ActivityFilterableListProps {
    initialActivities: Activity[];
}

export function ActivityFilterableList({ initialActivities }: ActivityFilterableListProps) {
    const [filter, setFilter] = useState('Tous');

    const filteredActivities = filter === 'Tous'
        ? initialActivities
        : initialActivities.filter(activity => activity.format === filter.toLowerCase());

    const filters = [
        { label: 'Tous', value: 'Tous' },
        { label: 'Mono', value: 'mono' },
        { label: 'Duo', value: 'duo' },
        { label: 'Multi', value: 'multi' },
    ];

    return (
        <div>
            {/* Filters */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value === 'Tous' ? 'Tous' : f.value)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${(filter.toLowerCase() === f.value.toLowerCase() || (filter === 'Tous' && f.value === 'Tous'))
                                ? 'bg-[var(--brand-rock)] text-white border-[var(--brand-rock)]'
                                : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                        <Link key={activity.slug} href={`/activities/${activity.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                                {activity.imageUrl ? (
                                    <img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-900 shadow-sm border-0">
                                        {activity.format === 'mono' ? 'Mono' : activity.format === 'duo' ? 'Duo' : 'Multi'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-[var(--brand-rock)] transition-colors">
                                        {activity.title}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Difficulty Badge */}
                                    {activity.difficulty && (
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${activity.difficulty.color}-100 text-${activity.difficulty.color}-800`}>
                                            Niveau {activity.difficulty.level}
                                        </span>
                                    )}
                                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                        {activity.duration}
                                    </span>
                                    {/* Categories */}
                                    {activity.categories && activity.categories.length > 0 && (
                                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                            {activity.categories[0].title}
                                            {activity.categories.length > 1 && ` +${activity.categories.length - 1}`}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-100">
                                    <span className="font-bold text-lg">{activity.price}€ <span className="text-sm font-normal text-stone-500">/ pers</span></span>
                                    <span className="text-sm font-medium text-[var(--brand-water)] group-hover:underline">Réserver</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-stone-500">
                        Aucune activité trouvée pour ce filtre.
                    </div>
                )}
            </div>
        </div>
    );
}
