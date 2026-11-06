import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Fil d'Ariane visible (le balisage BreadcrumbList est émis à part, en JSON-LD). */
export function Breadcrumbs({ items, className = "" }: { items: { name: string; href?: string }[]; className?: string }) {
    return (
        <nav aria-label="Fil d'Ariane" className={`text-sm text-stone-500 ${className}`}>
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-stone-900 hover:underline underline-offset-2 py-2">
                                {item.name}
                            </Link>
                        ) : (
                            <span aria-current="page" className="text-stone-700 font-medium">{item.name}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
