import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstname, lastname, email, subject, message } = body;

        // Basic validation
        if (!firstname || !lastname || !email || !message) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Email to Admin (You)
        await sendEmail({
            to: process.env.EMAIL_USER!, // Send to yourself
            subject: `Nouveau message contact : ${subject || 'Aucun sujet'}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>Nouveau message depuis le site</h2>
                    <p><strong>De :</strong> ${firstname} ${lastname} (${email})</p>
                    <p><strong>Sujet :</strong> ${subject}</p>
                    <hr />
                    <h3>Message :</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        });

        // Optional: Confirmation email to user
        /*
        await sendEmail({
            to: email,
            subject: 'Nous avons bien reçu votre message',
            html: `<p>Bonjour ${firstname},<br>Merci de nous avoir contactés. Nous reviendrons vers vous très vite.</p>`
        });
        */

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact API Error:', error);
        return new NextResponse('Error sending message', { status: 500 });
    }
}
