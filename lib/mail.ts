import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string | string[];
    subject: string;
    html: string;
}) => {
    try {
        const data = await resend.emails.send({
            from: 'Mon Coach Plein Air <contact@revesdaventures.fr>',
            to,
            subject,
            html,
        });

        console.log('Email sent:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
