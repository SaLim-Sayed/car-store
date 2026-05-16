/** Server-only env helpers (never import from client components). */

export function getResendApiKey(): string | undefined {
 return process.env.RESEND_API_KEY?.trim() || undefined;
}

export function getResendConfigError(): string | null {
 if (getResendApiKey()) return null;
 if (process.env.VERCEL) {
 return 'RESEND_API_KEY غير مُعرّف في إعدادات Vercel';
 }
 return 'RESEND_API_KEY غير مُعرّف في .env.local';
}
