import { urlFor } from "@/lib/sanity";
import Link from "next/link";

export const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <div className="my-6 relative w-full flex justify-center">
                    <img
                        src={urlFor(value).url()}
                        alt={value.alt || 'Image'}
                        className="max-h-[500px] w-auto h-auto rounded-xl shadow-sm border border-stone-100"
                    />
                </div>
            );
        }
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            const target = !value.href.startsWith('/') ? '_blank' : undefined;
            return (
                <a
                    href={value.href}
                    rel={rel}
                    target={target}
                    className="text-[var(--brand-water)] hover:underline font-medium transition-colors"
                >
                    {children}
                </a>
            );
        },
        strong: ({ children }: any) => <strong className="font-bold text-stone-900">{children}</strong>,
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-5 space-y-2 my-4 text-stone-700">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-5 space-y-2 my-4 text-stone-700">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }: any) => <li className="pl-1">{children}</li>,
        number: ({ children }: any) => <li className="pl-1">{children}</li>,
    },
    block: {
        h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-stone-900">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-stone-900 flex items-center gap-2"><span className="w-8 h-1 bg-[var(--brand-water)] rounded-full block"></span>{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-stone-900">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-lg font-bold mt-4 mb-2 text-stone-900">{children}</h4>,
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-stone-600">{children}</p>,
        blockquote: ({ children }: any) => <blockquote className="border-l-4 border-[var(--brand-water)] pl-4 italic my-6 bg-stone-50 py-3 rounded-r-lg text-stone-700">{children}</blockquote>,
    }
};
