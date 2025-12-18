import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getLevels() {
    return client.fetch(groq`
        *[_type == "difficulty"] | order(level asc) {
            level,
            title,
            color,
            description
        }
    `);
}

export async function LevelDescriptions() {
    const levels = await getLevels();

    if (!levels || levels.length === 0) return null;

    return (
        <section className="py-12 bg-stone-50 border-t border-stone-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Info className="w-5 h-5 text-[var(--brand-water)]" />
                    <h3 className="text-xl font-bold uppercase tracking-widest text-stone-900">Niveaux de difficulté</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {levels.map((lvl: any) => (
                        <div key={lvl.level} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 bg-${lvl.color}-100 text-${lvl.color}-700`}>
                                {lvl.level}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{lvl.title}</h4>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                {lvl.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Button asChild variant="outline" className="rounded-full px-8 border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900">
                        <Link href="/niveaux">
                            En savoir plus sur les niveaux
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
