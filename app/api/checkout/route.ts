import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { writeClient } from '@/lib/sanity.server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, activityTitle, price, rentalPriceTotal = 0, date, image, quantity = 1, customerName, email, phone, medicalInfo, height, weight, participantsNames } = body;

        console.log("Checkout init:", { eventId, customerName, rentalPriceTotal });

        if (!eventId || !price || !customerName || !email) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // 0. Check Stock & Price
        const event = await writeClient.fetch(`*[_type == "event" && _id == $eventId][0]`, { eventId });
        if (!event) return new NextResponse('Event not found', { status: 404 });

        // Use server-side price
        const serverPrice = event.price;
        if (!serverPrice) {
            return new NextResponse('Prix non défini pour cette séance.', { status: 400 });
        }

        // ... stock check ...
        const seatsAvailable = event.seatsAvailable ?? 0;
        if (seatsAvailable < quantity) {
            return new NextResponse('Plus assez de places disponibles pour cette activité.', { status: 400 });
        }

        // 1. Create Booking in Sanity
        const finalTotalPrice = (serverPrice * quantity) + rentalPriceTotal;

        let bookingId = null;
        try {
            const doc = await writeClient.create({
                _type: 'booking',
                customerName,
                email,
                phone,
                medicalInfo, // New
                height,      // New
                weight,      // New
                participantsNames, // New
                event: {
                    _type: 'reference',
                    _ref: eventId
                },
                quantity,
                price: finalTotalPrice,
                status: 'pending'
            });
            bookingId = doc._id;
            console.log("Booking created in Sanity:", bookingId);
        } catch (sanityError) {
            console.error("Sanity create error", sanityError);
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
                        unit_amount: serverPrice * 100, // Stripe expects cents
                    },
                    quantity: quantity,
                },
                ...(rentalPriceTotal > 0 ? [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: "Location de matériel (Vélos)",
                            description: "Location selon options choisies",
                        },
                        unit_amount: rentalPriceTotal * 100,
                    },
                    quantity: 1,
                }] : [])
            ],
            mode: 'payment',
            metadata: {
                eventId,
                bookingId, // Link back to Sanity doc
                customerName,
                activityTitle,
                date,
                phone,
                medicalInfo: medicalInfo ? medicalInfo.substring(0, 100) : "",
                height,
                weight,
                participantsNames
            },
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/calendrier`,
        });

        // 3. Update Sanity with Stripe Session ID
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
