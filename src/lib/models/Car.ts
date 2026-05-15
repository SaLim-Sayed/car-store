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
    required: true,
    min: 0,
  },
  fuelType: {
    type: String,
    enum: ['بنزين', 'ديزل', 'كهرباء', 'هايبرد'],
    required: true,
  },
  transmission: {
    type: String,
    enum: ['يدوي', 'أوتوماتيك'],
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
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

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
