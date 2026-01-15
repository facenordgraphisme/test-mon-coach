import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { PortableText } from '@portabletext/react';

// Define the fallback content using the user's text
const fallbackContent = [
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Les présentes conditions de réservation et de ventes régissent les rapports entre Rêves d'Aventures, dénomination commerciale de l'Entreprise individuelle de Frédéric BUET, et ses clients, bénéficiaires de prestations. La confirmation d'une réservation implique l'acceptation des conditions générales de réservations et de ventes telles qu'énoncées ci-dessous."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Dans le cadre d'une activité physique, le ou les client(s) doi(ven)t impérativement informer de tout état de santé particulier nécessitant une prise en charge (diabète, épilepsie, grossesse, asthme, surpoids…)."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 1 - CONDITIONS DE RÉSERVATION" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Les tarifs des services proposés par Rêves d'Aventures sont applicables à tous. La réservation d'une prestation implique obligatoirement l'acceptation des présentes conditions générales de ventes. Elles sont communiquées au plus tard lors de la réservation de la prestation. Toute réservation de prestation devient effective à la réception du paiement (Art.3).\nUne prestation est considérée comme définitivement confirmée qu'au paiement de la prestation, ou au versement de l'acompte avec le cas échéant la proposition de réservation signée et portant la mention « bon pour accord ». Les participants et responsables de groupes se déclarent informés des droits et obligations de chaque partie."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: "1.1 PRESTATIONS VENDUES EN LIGNE" }]
    },
    {
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: "a. LA RÉSERVATION EN LIGNE" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Elle s'effectue en Groupement individuel regroupé (GIR) ou privativatisation, elle s'éffectue directement sur le site www.revesd'aventures.fr selon un planning de disponibilité. Elle devient effective à réception du mail de confirmation de réservation lors du règlement de 100 % du montant total de la prestation."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Lorsqu'une activité est annulée par Rêves d'Avenures vous avez le choix de la reporter à une date ultérieure ou d'être intégralement remboursé. Si vous choisissez le remboursement il sera effectué sur la carte bancaire que vous avez utilisé lors du paiement."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: "b. L'ACHAT D'UN BON CADEAU" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Lors de l'achat d'un bon cadeau vous recevrez une carte cadeau personnalisée au nom du bénéficiaire et à imprimer. Les bons cadeaux sont valables 1 an à compter de la date d'achat. La date de validité est inscrite sur le bon cadeau et transmise en version électronique."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: "1.2 PRESTATIONS de groupes" }]
    },
    {
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: "a. LA RÉSERVATION" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Elle s'effectue auprès de nos services et fait l'objet d'une confirmation de réservation. Elle devient effective à réception de la confirmation de réservation, par email ou devis signé avec la mention \"bon pour accord\", accompagnée d'un acompte de 70 % du montant total de la prestation. À défaut du retour de ce document, la réception de l'acompte implique l'adhésion totale du client aux présentes conditions générales."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: "b. MODIFICATION DU NOMBRE DE PARTICIPANTS" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "La réduction du nombre de participants est considérée comme une annulation partielle de la réservation donnant lieu à l’application de l’article 6.2 des présentes. Si le nombre de participants s’avérait supérieur au nombre indiqué sur le contrat, la mise à disposition des activités et espaces ne sera confirmée que sous réserve de disponibilité et après réception du complément d’acompte correspondant au différentiel de réservation. En cas de non disponibilité, le contrat est réputé perdurer selon les termes et conditions déterminés dans le devis."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h4',
        children: [{ _type: 'span', text: "c. MODIFICATION DES PRESTATIONS" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Toute demande de modification des prestations par rapport au devis accepté doit être adressée par écrit à Rêves d'Aventures et sera dûment facturée. Rêves d'Aventures peut, à tout moment et sans aucun motif, refuser la demande de modification des prestations. Faute d'acceptation écrite de l'établissement dans les 8 jours de la réception de la demande, le contrat est réputé perdurer selon les termes et conditions déterminés dans le contrat accepté par le Client. Dans ce cas, Rêves d'Aventures ne pourra pas être recherché en paiement d’une quelconque indemnité."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 2 - GARANTIES" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d'annulation de Rêves d'Aventures, d'une ou de la totalité des prestations dans un cas de force majeure, le remboursement intégral des sommes versées est garanti."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d'annulation pour mauvaises conditions météorologiques, par décision unilatérale de Rêves d'Aventures 72H avant la prestation, certaines prestations d’activités extérieures spécifiées par Rêves d'Aventures pourront être remboursées sauf dans le cas de l'élaboration d'un plan de repli. Les prestations de transport, d’hébergements et restaurations seront soumises aux conditions d’annulation des prestataires engagés."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 3 - TARIFS" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Nos tarifs sont des tarifs TTC en euros pour l'ensemble des prestations proposées. La TVA ne s'applique pas en raison de l'article 293b du CGI. En cas de prix forfaitaires, les prix s'appliquent globalement aux services réservés. Les tarifs confirmés sur l'accord de principe sont fermes pour 3 mois à compter de la date d'envoi."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Nos tarifs sont appliqués à tous les participants, y compris les accompagnateurs sauf cas particulier."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 4 - CONDITIONS DE PAIEMENT" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Les factures sont établies en euros et doivent être réglées en euros. Seule la réception du paiement par chèque, carte bancaire ou espèce valide définitivement la réservation d'une prestation."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Toute validation de réservation sera prise en compte à réception d’un acompte de 50%, et le solde du montant total devra être remis après facture émise le jour de la prestation, par chèque à l'ordre de Frédéric BUET, virement ou règlement en espèces. Rêves d'Aventures se réserve le droit d'annuler toute réservation en cas d'absence de règlement suivant l'échéancier fixé dans nos conditions particulières ci-dessous."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "La facture de solde vous sera envoyée à l'issue de votre activité et à régler dès réception, tenant compte de vos versements, des éventuelles modifications survenues après signature du contrat et des extras non réglés sur place par les participants. En cas de retard de paiement, Rêves d'Aventures a le droit de facturer des frais fixés à 1,5% par mois à partir du montant restant à payer. Active Road se réserve le droit d'annuler toute réservation en cas de défaut de paiement suivant l'échéancier fixé dans nos conditions particulières."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 5 - RECLAMATIONS" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Toute réclamation devra nous parvenir par lettre recommandée avec accusé réception dans un délai de 30 jours après la fin du séjour ou de la manifestation au siège social de Rêves d'Aventures."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 6 - ANNULATION" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "La facturation étant faite sur la base des prestations commandées, le Client est invité à prêter la plus grande attention aux conditions d'annulation ci-après. Les annulations de tout ou partie de la réservation initiale, doivent être adressées par écrit à l’agence."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d’interruption de la prestation, pour quelque cause que ce soit, l’intégralité du prix TTC de l’ensemble de la prestation convenu sera encaissée sans recours possible du client. Est également considérée comme une annulation totale ou partielle tardive toute annulation reçue par l’agence au-delà des délais prévus aux présentes."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: "6.1 ANNULATION TOTALE" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Sont considérées comme une annulation totale et donnant lieu à l’application des conditions d’annulation ci-après définies :"
            }
        ]
    },
    {
        _type: 'list',
        listItem: 'bullet',
        children: [
            { _type: 'block', children: [{ _type: 'span', text: "Le \"no -shows\" (annulation sans préavis)" }] },
            { _type: 'block', children: [{ _type: 'span', text: "Le changement de date de la manifestation" }] },
            { _type: 'block', children: [{ _type: 'span', text: "En cas de non-respect des échéances de paiement, la manifestation sera considérée comme définitivement annulée aux torts exclusifs du client ." }] }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d’annulation totale, à titre d’indemnité, Rêves d'Aventures conservera l'acompte versé ou facturera le client comme indiqué ci-après :"
            }
        ]
    },
    {
        _type: 'list',
        listItem: 'bullet',
        children: [
            { _type: 'block', children: [{ _type: 'span', text: "plus de 30 jours avant le premier jour de la date de la prestation: le montant de l'acompte prévu aux conditions particulières." }] },
            { _type: 'block', children: [{ _type: 'span', text: "30 jours ou moins avant le premier jour de la date de la manifestation : 100% du montant TTC des prestations réservées." }] }
        ]
    },
    {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: "6.2 ANNULATION PARTIELLE" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Une annulation partielle correspond à une réduction du montant du contrat quelle qu’en soit la cause : diminution de la durée de la manifestation, du nombre de personnes et/ou des prestations commandées."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d’annulation partielle, les frais d’annulation encourus par le client sont les suivants :"
            }
        ]
    },
    {
        _type: 'list',
        listItem: 'bullet',
        children: [
            { _type: 'block', children: [{ _type: 'span', text: "Jusqu’à 30 jours avant le premier jour de la manifestation, pas de frais en cas d’annulation partielle," }] },
            { _type: 'block', children: [{ _type: 'span', text: "Entre 30 et 15 jours avant le premier jour de la manifestation, annulation sans frais jusqu’à 50% du montant total TTC de la manifestation, pour toute annulation supérieure ou égale 50% des montants annulés seront facturés." }] },
            { _type: 'block', children: [{ _type: 'span', text: "Entre 15 et 7 jours avant le premier jour de la manifestation, 70% des montants annulés seront facturés." }] },
            { _type: 'block', children: [{ _type: 'span', text: "Entre 7 jours et le jour de la prestation, 100% des montants annulés seront facturés." }] }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 7 – CAS DE FORCE MAJEUR" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas de météo non adaptée à la pratique d’activités en plein air : pluie, vent, risque incendie...seul Rêves d'Aventures sera apte à modifier ou annuler les prestations réservées. À partir de J-3, Rêves d'Aventures préviendra le client par mail ou autres moyens à sa convenance de la modification ou l'annulation de la prestation. La prestation pourra être reportée, transformée en avoir valable un an ou intégralement remboursée selon l'activité concernée et spécifiée par Rêves d'Aventures. Selon un accord préalable, un plan de secours peut être étudié et sera dûment facturé par Rêves d'Aventures."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 8 – FORMALITÉS PRÉALABLE ET ASSURANCES" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Le client fait son affaire de toute déclaration éventuelle ou demande d'autorisation auprès des organismes et/ou administrations. En aucun cas Rêves d'Aventures sera tenu pour responsable du défaut de ces déclarations."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Le client se doit d'informer Rêves d'Aventures de toutes contre-indications médicales à la pratique d'une activité sportive (problèmes respiratoires, cardiaques...)."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "L'entreprise individuelle Frédéric BUET dispose d'une assurance responsabilité civile professionnelle souscrite auprès de la MAIF."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Rêves d'Aventures ne pourra pas être tenu pour responsable de quelconque incident survenu en dehors de sa prestation d’organisateur d’activités sportives."
            }
        ]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas d'exposition de matériels ou d'objets de valeurs, nous recommandons au client de souscrire, à ses frais, une assurance dommages et vols."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 9 - DEGRADATION DU MATERIEL DE LOCATION OU MIS A DISPOSITION" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Le client s'engage à payer toute dégradation du matériel loué ou mis à disposition, selon l'estimation d'un expert du matériel en question."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 10 – POLITIQUE DE CONFIDENTIALITÉ" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Lors de votre réservation des informations sont demandées pour garantir l'exécution de nos prestations. Il s'agit de vos données personnelles. Vous trouverez sur cette page des réponses sur notre politique de confidentialité afin de répondre au règlement général sur la protection des données (RGPD) et à vos questions :"
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 11 - DROIT A L'IMAGE" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "Sauf opposition écrite préalable, le client autorise l’utilisation de photographies ou vidéos prises lors des activités à des fins de communication (site internet, réseaux sociaux)."
            }
        ]
    },
    {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: "Article 12 - LITIGES" }]
    },
    {
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: "En cas de litige, une solution amiable sera recherchée. À défaut, le tribunal compétent sera celui du domicile de l’entreprise individuelle."
            }
        ]
    }
];

import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

// ... existing imports

async function getCGVPageData() {
    return client.fetch(groq`
        *[_type == "cgvPage"][0] {
            title,
            content,
            seo
        }
    `, {}, { next: { revalidate: 10 } });
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await client.fetch(groq`*[_type == "cgvPage"][0] { seo }`);
    return generateSeoMetadata(data?.seo, {
        title: "Conditions Générales de Vente | Mon Coach Plein Air",
        description: "Conditions régissant les réservations, les ventes et les activités.",
        url: 'https://moncoachpleinair.com/cgv'
    });
}



export default async function CGVPage() {
    const data = await getCGVPageData();
    const content = (data?.content && data.content.length > 0) ? data.content : fallbackContent;
    const title = data?.title || "Conditions Générales de Vente";
    const customJsonLd = data?.seo?.structuredData ? JSON.parse(data.seo.structuredData) : null;

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([customJsonLd].filter(Boolean)) }}
            />
            <PageHero
                title={title}
                subtitle="Conditions régissant les réservations, les ventes et les activités"
                image="/assets/IMG_2030.JPG"
            />

            <main className="flex-1 py-16 md:py-24 container px-4 md:px-6 mx-auto">
                <div className="prose prose-stone max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100 dark:prose-invert">
                    <PortableText value={content} />
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
