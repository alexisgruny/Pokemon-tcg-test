import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'noreply@pokemonpockettrade.vercel.app';
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
    const link = `${BASE_URL}/verify-email?token=${token}`;
    await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Vérifiez votre adresse email — Pokémon TCG Trade',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #FFF8F0; border-radius: 12px; border: 2px solid #E5CABB;">
                <h1 style="color: #E8736A; font-size: 1.4rem; text-align: center;">Vérification de votre email</h1>
                <p style="color: #2D2420;">Merci de vous être inscrit sur <strong>Pokémon TCG Trade</strong> !</p>
                <p style="color: #2D2420;">Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${link}" style="background: #E8736A; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;">
                        Vérifier mon email
                    </a>
                </div>
                <p style="color: #5C3D35; font-size: 0.85rem;">Ce lien expire dans <strong>24 heures</strong>. Si vous n'avez pas créé de compte, ignorez cet email.</p>
            </div>
        `,
    });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const link = `${BASE_URL}/reset-password?token=${token}`;
    await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Réinitialisation de mot de passe — Pokémon TCG Trade',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #FFF8F0; border-radius: 12px; border: 2px solid #E5CABB;">
                <h1 style="color: #E8736A; font-size: 1.4rem; text-align: center;">Réinitialisation de mot de passe</h1>
                <p style="color: #2D2420;">Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p style="color: #2D2420;">Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${link}" style="background: #E8736A; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style="color: #5C3D35; font-size: 0.85rem;">Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
            </div>
        `,
    });
}
