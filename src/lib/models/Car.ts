import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
 brand: {
 type: String,
 required: false,
 trim: true,
 default: '',
 },
 model: {
 type: String,
 required: false,
 trim: true,
 default: '',
 },
 year: {
 type: Number,
 required: false,
 min: 1900,
 max: new Date().getFullYear() + 1,
 },
 price: {
 type: Number,
 required: false,
 min: 0,
 },
 fuelType: {
 type: String,
 enum: ['بنزين', 'كهرباء', 'غاز طبيعي', 'غاز', 'سولار'],
 required: false,
 default: 'بنزين',
 },
 transmission: {
 type: String,
 enum: ['يدوي', 'أوتوماتيك'],
 required: false,
 default: 'أوتوماتيك',
 },
 mileage: {
 type: Number,
 required: false,
 min: 0,
 },
 color: {
 type: String,
 required: false,
 trim: true,
 default: '',
 },
 phone: {
 type: String,
 trim: true,
 default: '',
 },
 description: {
 type: String,
 required: false,
 trim: true,
 default: '',
 },
 images: [{
 type: String,
 }],
 features: [{
 type: String,
 trim: true,
 }],
 status: {
 type: String,
 enum: ['متاح', 'مباع', 'محجوز'],
 default: 'متاح',
 },
 bodyType: {
 type: String,
 enum: ['سيارة', 'دراجة نارية', 'دراجة', 'توك توك', 'معدة', 'أخرى'],
 default: 'سيارة',
 },
  location: {
   type: String,
   trim: true,
   default: 'مدينة المنيا. ميدان الحميات',
  },
 locationLink: {
 type: String,
 trim: true,
 default: '',
 },
 showroom: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Showroom',
 },
 createdAt: {
 type: Date,
 default: Date.now,
 },
 updatedAt: {
 type: Date,
 default: Date.now,
 },
});

CarSchema.pre('save', async function() {
 this.updatedAt = new Date();
});

if (mongoose.models.Car) {
 delete mongoose.models.Car;
}

export default mongoose.model('Car', CarSchema);
