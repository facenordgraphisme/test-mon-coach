import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { PortableText } from '@portabletext/react';
import { generateSeoMetadata } from "@/lib/seo";

// Define the fallback content using the user's text
const fallbackContent = [
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site www.rêvesd'aventures.fr l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Éditeur du site" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            { _type: 'span', text: "Nom de l’entreprise : EI Frédéric BUET\nStatut juridique : EI\nNom et prénom : BUET FREDERIC\nAdresse : 150, rue de la fontaine 05160 SAINT APOLLINAIRE\nTéléphone : 06 83 16 94 02\nEmail : contact@revesd'aventures.fr\nSIRET : 851411934 00017\nCode APE : 8551Z" }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Responsable de la publication" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: "[Nom Prénom]" }]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Hébergeur du site" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: "Nom : \nAdresse : \nTéléphone :" }]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Propriété intellectuelle" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "L’ensemble des contenus présents sur ce site (textes, images, photographies, logos, vidéos) est la propriété exclusive de Frédéric BUET, sauf mention contraire. Toute reproduction, représentation ou diffusion, même partielle, est interdite sans autorisation préalable."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Données personnelles" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Le site revesd'aventures.fr ne collecte des données personnelles que pour répondre aux demandes et réservations. Conformément à la loi “Informatique et Libertés”, vous disposez d’un droit d’accès et de rectification en nous contactant à : contact@revesd'aventures.fr"
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Responsabilité" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Les activités proposées comportent une part de risque inhérente aux sports de pleine nature. Les informations présentes sur le site sont fournies à titre indicatif et peuvent être modifiées. La responsabilité de l’éditeur ne saurait être engagée en cas de mauvaise utilisation des informations ou de non-respect des consignes de sécurité."
            }
        ]
    }
];

export async function generateMetadata() {
    const data = await client.fetch(groq`*[_type == "legalPage"][0] { seo }`);
    return generateSeoMetadata(data?.seo, {
        title: "Mentions Légales | Mon Coach Plein Air",
        description: "Informations légales et juridiques.",
        url: 'https://moncoachpleinair.com/mentions-legales'
    });
}

async function getLegalPageData() {
    return client.fetch(groq`
        *[_type == "legalPage"][0] {
            title,
            content,
            seo
        }
    `);
}

export const revalidate = 60;

export default async function LegalPage() {
    const data = await getLegalPageData();
    // Use fallback if data.content is missing or empty array
    const content = (data?.content && data.content.length > 0) ? data.content : fallbackContent;
    const title = data?.title || "Mentions Légales";
    const customJsonLd = data?.seo?.structuredData ? JSON.parse(data.seo.structuredData) : null;


    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([customJsonLd].filter(Boolean)) }}
            />
            <PageHero
                title={title}
                subtitle="Informations légales et juridiques"
                image="/assets/IMG_2030.JPG"
            />

            <main className="flex-1 py-16 md:py-24 container px-4 md:px-6 mx-auto">
                <div className="prose prose-stone max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100">
                    <PortableText value={content} />
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
