import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getAppUrl } from '@/lib/app-url';
import { getUsersCollection } from '@/lib/get-users-collection';

const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function hashResetToken(token: string): string {
 return crypto.createHash('sha256').update(token).digest('hex');
}

export function buildResetUrl(token: string): string {
 return `${getAppUrl()}/auth/reset-password?token=${token}`;
}

/** Create reset token in MongoDB; returns raw token + URL if user exists. */
export async function createPasswordResetToken(email: string): Promise<{
 resetToken: string;
 resetUrl: string;
 userName: string;
} | null> {
 const normalizedEmail = email.toLowerCase().trim();
 const users = await getUsersCollection();

 const user = await users.findOne<{ name?: string; email?: string }>({
 email: normalizedEmail,
 });

 if (!user) return null;

 const resetToken = crypto.randomBytes(32).toString('hex');
 const resetTokenHash = hashResetToken(resetToken);
 const resetPasswordExpires = new Date(Date.now() + RESET_EXPIRY_MS);

 await users.updateOne(
 { email: normalizedEmail },
 {
 $set: {
 resetPasswordToken: resetTokenHash,
 resetPasswordExpires,
 updatedAt: new Date(),
 },
 }
 );

 return {
 resetToken,
 resetUrl: buildResetUrl(resetToken),
 userName: user.name ?? 'مستخدم',
 };
}

/** Hash new password with bcryptjs and clear reset fields in MongoDB. */
export async function applyPasswordReset(
 token: string,
 password: string
): Promise<boolean> {
 const tokenHash = hashResetToken(token);
 const users = await getUsersCollection();

 const user = await users.findOne({
 resetPasswordToken: tokenHash,
 resetPasswordExpires: { $gt: new Date() },
 });

 if (!user) return false;

 const hashedPassword = await bcrypt.hash(password, 10);

 const result = await users.updateOne(
 { _id: user._id },
 {
 $set: {
 password: hashedPassword,
 updatedAt: new Date(),
 },
 $unset: {
 resetPasswordToken: '',
 resetPasswordExpires: '',
 },
 }
 );

 return result.modifiedCount === 1;
}
