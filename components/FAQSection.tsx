import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

async function getFAQ() {
    const data = await client.fetch(groq`
        *[_type == "homepage"][0] {
            faq
        }
    `);
    return data?.faq || [];
}

export async function FAQSection() {
    const faqItems = await getFAQ();

    if (!faqItems || faqItems.length === 0) return null;

    return (
        <section className="py-24 bg-stone-50 border-t border-stone-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                        Questions Fréquentes
                    </h2>
                    <p className="text-lg text-stone-600">
                        Tout ce que vous devez savoir avant de partir à l'aventure.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8 max-w-5xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item: any, index: number) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b-stone-100 last:border-0">
                                <AccordionTrigger className="text-lg font-semibold text-stone-800 hover:text-[var(--brand-water)] text-left">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600 leading-relaxed text-base pt-2 text-left">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
