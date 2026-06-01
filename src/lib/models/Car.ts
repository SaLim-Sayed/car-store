import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
 brand: {
 type: String,
 required: true,
 trim: true,
 },
 model: {
 type: String,
 required: true,
 trim: true,
 },
 year: {
 type: Number,
 required: true,
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
 required: true,
 },
 transmission: {
 type: String,
 enum: ['يدوي', 'أوتوماتيك'],
 required: true,
 },
 mileage: {
 type: Number,
 required: false,
 min: 0,
 },
 color: {
 type: String,
 required: true,
 trim: true,
 },
 phone: {
 type: String,
 trim: true,
 default: '',
 },
 description: {
 type: String,
 required: true,
 trim: true,
 },
 images: [{
 type: String,
 required: true,
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
  location: {
   type: String,
   trim: true,
   default: 'المنيا',
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
