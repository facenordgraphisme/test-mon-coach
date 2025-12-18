import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { writeClient } from '@/lib/sanity.server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        // console.error(`Webhook signature verification failed.`, error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const bookingId = session.metadata?.bookingId;
        const eventId = session.metadata?.eventId;

        if (bookingId) {
            console.log(`Payment successful for booking ${bookingId}`);

            // 1. Update Booking Status -> 'confirmed'
            await writeClient
                .patch(bookingId)
                .set({ status: 'confirmed' })
                .commit();

            // 2. Decrement Seats Available
            if (eventId) {
                const booking = await writeClient.fetch(`*[_type == "booking" && _id == $bookingId][0]`, { bookingId });
                const quantity = booking?.quantity || 1;

                await writeClient
                    .patch(eventId)
                    .dec({ seatsAvailable: quantity })
                    .commit();

                console.log(`Decremented ${quantity} seats from event ${eventId}`);

                // 3. Send Emails
                if (process.env.RESEND_API_KEY) {
                    try {
                        const resend = new Resend(process.env.RESEND_API_KEY);
                        const customerEmail = session.customer_details?.email || booking.email;
                        const customerName = session.customer_details?.name || booking.customerName;

                        console.log(`Sending emails to: Client=${customerEmail}, Admin=facenordgraphisme@gmail.com`);

                        // Email to Customer
                        await resend.emails.send({
                            from: 'Mon Coach Plein Air <onboarding@resend.dev>', // Use verified domain in prod by Resend
                            to: customerEmail,
                            subject: 'Confirmation de votre réservation - Mon Coach Plein Air',
                            html: `
                                <div style="font-family: sans-serif; color: #333;">
                                    <h1>Merci ${customerName} !</h1>
                                    <p>Votre réservation est bien confirmée.</p>
                                    <p><strong>Détails :</strong></p>
                                    <ul>
                                        <li>Activité : ${session.metadata?.activityTitle || 'Activité de plein air'}</li>
                                        <li>Quantité : ${quantity} personne(s)</li>
                                        <li>Montant réglé : ${session.amount_total ? session.amount_total / 100 : 0} €</li>
                                    </ul>
                                    <p>Nous avons hâte de vous retrouver pour cette aventure.</p>
                                    <p>À très vite !</p>
                                </div>
                            `
                        });

                        // Email to Admin
                        await resend.emails.send({
                            from: 'Mon Coach Plein Air <onboarding@resend.dev>',
                            to: 'facenordgraphisme@gmail.com',
                            subject: `Nouvelle Réservation : ${customerName}`,
                            html: `
                                <div style="font-family: sans-serif; color: #333;">
                                    <h1>Nouvelle transaction reçue !</h1>
                                    <p><strong>Client :</strong> ${customerName} (${customerEmail})</p>
                                    <p><strong>Montant :</strong> ${session.amount_total ? session.amount_total / 100 : 0} €</p>
                                    <p><strong>Activité ID :</strong> ${eventId}</p>
                                    <p><strong>Places réservées :</strong> ${quantity}</p>
                                    <hr />
                                    <p><a href="https://mon-coach-plein-air.sanity.studio">Accéder au Dashboard Sanity</a></p>
                                </div>
                            `
                        });
                        console.log("Emails sent successfully");
                    } catch (emailError) {
                        console.error("Error sending emails:", emailError);
                    }
                } else {
                    console.log("RESEND_API_KEY missing, skipping emails");
                }

                // 4. Revalidate Calendar Cache
                try {
                    revalidatePath('/calendrier');
                    console.log("Revalidated /calendrier");
                } catch (err) {
                    console.error("Revalidation failed", err);
                }
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
