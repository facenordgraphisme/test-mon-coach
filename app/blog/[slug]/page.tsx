import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { PortableText } from "@portabletext/react";
import { ptComponents } from "@/components/PortableTextComponents";
import { generateSeoMetadata, generateArticleSchema, generateFAQSchema } from "@/lib/seo";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

async function getPost(slug: string) {
    return client.fetch(groq`
        *[_type == "post" && slug.current == $slug][0] {
            title,
            "slug": slug.current,
            excerpt,
            mainImage,
            "imageUrl": mainImage.asset->url,
            publishedAt,
            _updatedAt,
            author,
            tags,
            body,
            faq,
            seo,
            "relatedActivities": relatedActivities[]->{
                title,
                "slug": slug.current,
                "imageUrl": mainImage.asset->url,
            }
        }
    `, { slug }, { next: { revalidate: 60 } });
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    return generateSeoMetadata(post?.seo, {
        title: post?.title ? `${post.title} | Blog` : 'Article | Blog',
        description: post?.excerpt || "Conseils et récits d'aventures dans les Hautes-Alpes par votre guide de haute montagne.",
        url: `https://www.revesdaventures.fr/blog/${slug}`,
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const articleSchema = generateArticleSchema({
        title: post.title,
        excerpt: post.excerpt,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        updatedAt: post._updatedAt,
        author: post.author,
        slug: post.slug,
    });

    const customJsonLd = post?.seo?.structuredData ? JSON.parse(post.seo.structuredData) : null;
    const faqSchema = generateFAQSchema(post.faq);

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, customJsonLd, faqSchema].filter(Boolean)) }}
            />
            <PageHero
                title={post.title}
                label="BLOG"
                image={post.imageUrl || "/assets/IMG_3771.JPG"}
            />
            <main className="flex-1 py-12 md:py-20">
                <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                    <Button asChild variant="ghost" className="mb-6 hover:bg-stone-100 -ml-4">
                        <Link href="/blog" className="flex items-center gap-2 text-stone-500 hover:text-stone-900">
                            <ArrowLeft className="w-4 h-4" />
                            Retour au blog
                        </Link>
                    </Button>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400 mb-8 pb-8 border-b border-stone-200">
                        {post.publishedAt && (
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        )}
                        {post.author && (
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="bg-stone-100 text-stone-600">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <article className="prose prose-stone max-w-none">
                        {post.body && <PortableText value={post.body} components={ptComponents} />}
                    </article>

                    {post.faq?.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-stone-200">
                            <h3 className="text-lg font-bold text-stone-900 mb-6">Questions fréquentes</h3>
                            <div className="space-y-3">
                                {post.faq.map((item: { question: string; answer: string }, i: number) => (
                                    <details key={i} className="group bg-white rounded-xl border border-stone-100 shadow-sm p-4">
                                        <summary className="font-bold text-stone-900 cursor-pointer list-none flex items-center justify-between gap-4">
                                            {item.question}
                                            <span className="text-stone-400 text-xl leading-none shrink-0 group-open:rotate-45 transition-transform">+</span>
                                        </summary>
                                        <p className="mt-3 text-stone-600 leading-relaxed">{item.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}

                    {post.relatedActivities?.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-stone-200">
                            <h3 className="text-lg font-bold text-stone-900 mb-6">À découvrir aussi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {post.relatedActivities.map((activity: any) => (
                                    <Link
                                        key={activity.slug}
                                        href={`/aventures/${activity.slug}`}
                                        className="group flex items-center gap-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow p-4"
                                    >
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                                            {activity.imageUrl && (
                                                <Image
                                                    src={activity.imageUrl}
                                                    alt={activity.title}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-stone-900 group-hover:text-[var(--brand-water)] transition-colors">
                                                {activity.title}
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-sm text-[var(--brand-water)] font-medium">
                                                Découvrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-16 bg-stone-900 text-white rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-3">Prêt à vivre l'aventure ?</h3>
                        <p className="text-stone-300 mb-6 max-w-md mx-auto">
                            Réservez votre prochaine sortie encadrée par un guide diplômé dans les Hautes-Alpes.
                        </p>
                        <Button asChild size="lg" className="bg-white text-stone-900 hover:bg-stone-100 rounded-full px-8">
                            <Link href="/calendrier">Voir le calendrier</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
