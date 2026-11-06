import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Webhook Sanity → revalidation à la demande.
// Les pages publiques sont en cache 1 h (ISR) ; ce webhook rend les modifications
// faites dans le Studio visibles immédiatement, sans rendre les pages dynamiques.
// Configuration : Sanity Manage → API → Webhooks, URL https://www.revesdaventures.fr/api/revalidate,
// méthode POST, secret identique à la variable d'env SANITY_REVALIDATE_SECRET.
export async function POST(req: NextRequest) {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
        return new NextResponse('Revalidation non configurée', { status: 503 });
    }

    try {
        const { isValidSignature } = await parseBody(req, secret);
        if (!isValidSignature) {
            return new NextResponse('Signature invalide', { status: 401 });
        }

        revalidatePath('/', 'layout');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        console.error('Revalidation failed', err);
        return new NextResponse('Erreur', { status: 500 });
    }
}
