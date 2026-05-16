import { Resend } from 'resend';
import { getResendApiKey, getResendConfigError } from '@/lib/server-env';

export { getResendConfigError };

function getFromAddress(): string {
 const configured = process.env.RESEND_FROM_EMAIL?.trim();
 if (configured) return configured;
 return 'onboarding@resend.dev';
}

function getResendClient(): Resend | null {
 const key = getResendApiKey();
 if (!key) return null;
 return new Resend(key);
}

export async function sendPasswordResetEmail(
 to: string,
 resetUrl: string,
 userName: string
): Promise<{ sent: boolean; error?: string }> {
 const configError = getResendConfigError();
 if (configError) {
 return { sent: false, error: configError };
 }

 const resend = getResendClient()!;
 const from = getFromAddress();

 const { error } = await resend.emails.send({
 from,
 to,
 subject: 'إعادة تعيين كلمة المرور — سيارات المنيا',
 html: `
 <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
 <h1 style="color: #D97706; font-size: 22px;">إعادة تعيين كلمة المرور</h1>
 <p style="color: #333; line-height: 1.6;">مرحباً ${userName}،</p>
 <p style="color: #333; line-height: 1.6;">
 تلقّينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط الزر أدناه (الرابط صالح لمدة ساعة واحدة):
 </p>
 <p style="text-align: center; margin: 32px 0;">
 <a href="${resetUrl}"
 style="background: #D97706; color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
 إعادة تعيين كلمة المرور
 </a>
 </p>
 <p style="color: #666; font-size: 13px; line-height: 1.5;">
 إذا لم تطلب هذا التغيير، تجاهل هذه الرسالة.
 </p>
 <p style="color: #999; font-size: 12px; word-break: break-all;">${resetUrl}</p>
 </div>
 `,
 });

 if (error) {
 console.error('Resend error:', JSON.stringify(error));
 const hint =
 error.message?.includes('domain') || error.message?.includes('from')
 ? 'استخدم onboarding@resend.dev أو فعّل نطاقك في Resend'
 : error.message;
 return { sent: false, error: hint };
 }

 return { sent: true };
}
