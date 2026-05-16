import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
 name: {
 type: String,
 required: true,
 trim: true,
 },
 email: {
 type: String,
 required: true,
 unique: true,
 trim: true,
 lowercase: true,
 },
 password: {
 type: String,
 required: true,
 minlength: 6,
 },
 role: {
 type: String,
 enum: ['admin', 'user'],
 default: 'user',
 },
 isActive: {
 type: Boolean,
 default: true,
 },
 resetPasswordToken: String,
 resetPasswordExpires: Date,
 createdAt: {
 type: Date,
 default: Date.now,
 },
 updatedAt: {
 type: Date,
 default: Date.now,
 },
});

// Mongoose 9: pre-save hooks are async, no next() callback
UserSchema.pre('save', async function() {
 if (this.isModified('password')) {
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password as string, salt);
 }
 this.updatedAt = new Date();
});

UserSchema.methods.comparePassword = async function(this: any, candidatePassword: string): Promise<boolean> {
 if (!this.password) return false;
 return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
