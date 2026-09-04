import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/PageHero";
import { generateSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

async function getPosts() {
    return client.fetch(groq`
        *[_type == "post"] | order(publishedAt desc) {
            title,
            "slug": slug.current,
            excerpt,
            "imageUrl": mainImage.asset->url,
            publishedAt,
            tags
        }
    `, {}, { next: { revalidate: 60 } });
}

export async function generateMetadata(): Promise<Metadata> {
    return generateSeoMetadata(null, {
        title: "Blog | Conseils et récits d'aventures",
        description: "Conseils, guides pratiques et récits d'aventures en Escalade, Canyoning, Via Ferrata et VTT dans les Hautes-Alpes, par votre guide de haute montagne.",
        url: 'https://www.revesdaventures.fr/blog',
    });
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <PageHero
                title="Le Blog"
                subtitle="Conseils, guides pratiques et récits pour préparer vos prochaines aventures dans les Hautes-Alpes."
                label="CONSEILS & RÉCITS"
                image="/assets/IMG_3771.JPG"
            />
            <main className="flex-1 py-12 md:py-20">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="mb-10">
                        <Button asChild variant="ghost" className="mb-6 hover:bg-stone-100 -ml-4">
                            <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900">
                                <ArrowLeft className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                    </div>

                    {posts.length === 0 ? (
                        <p className="text-stone-500 text-center py-20">
                            Les premiers articles arrivent très bientôt.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post: any) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                                >
                                    <div className="relative h-48 w-full bg-stone-200">
                                        {post.imageUrl && (
                                            <Image
                                                src={post.imageUrl}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        {post.publishedAt && (
                                            <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        )}
                                        <h2 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-[var(--brand-water)] transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags?.slice(0, 2).map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="bg-stone-100 text-stone-600">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--brand-water)]">
                                                Lire <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
