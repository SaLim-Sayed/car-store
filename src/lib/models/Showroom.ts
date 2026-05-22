import mongoose from 'mongoose';

const ShowroomSchema = new mongoose.Schema({
 name: {
 type: String,
 required: [true, 'يرجى إدخال اسم المعرض'],
 },
 address: {
 type: String,
 required: [true, 'يرجى إدخال عنوان المعرض'],
 },
 phone: {
 type: String,
 required: [true, 'يرجى إدخال رقم الهاتف'],
 },
 email: {
 type: String,
 },
 logo: {
 type: String,
 default: '',
 },
 description: {
 type: String,
 },
 location: {
 type: {
 type: String,
 enum: ['Point'],
 default: 'Point',
 },
 coordinates: {
 type: [Number],
 default: [30.7333, 28.0833], // Default Minia coordinates
 },
 },
 locationLink: {
 type: String,
 trim: true,
 default: '',
 },
 workingHours: {
 type: String,
 },
 featured: {
 type: Boolean,
 default: false,
 },
 owner: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User',
 },
}, {
 timestamps: true,
});

export default mongoose.models.Showroom || mongoose.model('Showroom', ShowroomSchema);
