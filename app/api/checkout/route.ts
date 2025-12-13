import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, activityTitle, price, date, image, quantity = 1 } = body;

        console.log("Checkout init:", { eventId, activityTitle, price, date, quantity, hasKey: !!process.env.STRIPE_SECRET_KEY });

        if (!eventId || !price || !activityTitle) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: activityTitle,
                            description: `Sortie du ${new Date(date).toLocaleDateString('fr-FR')} (${quantity} pers.)`,
                            images: image ? [image] : [],
                        },
                        unit_amount: price * 100, // Stripe expects cents
                    },
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            metadata: {
                eventId,
            },
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/calendrier`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[STRIPE_ERROR]', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Error';
        return new NextResponse(errorMessage, { status: 500 });
    }
}
