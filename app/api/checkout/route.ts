import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { writeClient } from '@/lib/sanity.server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, activityTitle, price, date, image, quantity = 1, customerName, email, phone } = body;

        console.log("Checkout init:", { eventId, customerName });

        if (!eventId || !price || !customerName || !email) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // 1. Create Booking in Sanity
        let bookingId = null;
        try {
            const doc = await writeClient.create({
                _type: 'booking',
                customerName,
                email,
                phone,
                event: {
                    _type: 'reference',
                    _ref: eventId
                },
                quantity,
                price: price * quantity,
                status: 'pending'
            });
            bookingId = doc._id;
            console.log("Booking created in Sanity:", bookingId);
        } catch (sanityError) {
            console.error("Sanity create error", sanityError);
            // We might continue even if Sanity fails, but ideally we should block
            // For now, let's block to ensure data integrity
            return new NextResponse('Error creating booking record', { status: 500 });
        }

        // 2. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email, // Pre-fill email for Stripe
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: activityTitle,
                            description: `Sortie du ${new Date(date).toLocaleDateString('fr-FR')} (${quantity} pers.) - ${customerName}`,
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
                bookingId, // Link back to Sanity doc
                customerName
            },
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/calendrier`,
        });

        // 3. Update Sanity with Stripe Session ID (Optional but good for tracking)
        if (bookingId) {
            await writeClient
                .patch(bookingId)
                .set({ stripeSessionId: session.id })
                .commit();
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[STRIPE_ERROR]', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Error';
        return new NextResponse(errorMessage, { status: 500 });
    }
}
