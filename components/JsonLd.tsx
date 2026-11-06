import { jsonLdString } from "@/lib/seo";

/** Émet un bloc JSON-LD, ou rien du tout si toutes les données sont vides (plus de `[]`). */
export function JsonLd({ data }: { data: unknown }) {
    const json = jsonLdString(data);
    if (!json) return null;
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
