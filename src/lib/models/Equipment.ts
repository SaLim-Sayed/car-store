import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'يرجى إدخال عنوان الإعلان'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'يرجى إدخال الماركة'],
    trim: true,
  },
  model: {
    type: String,
    trim: true,
    default: '',
  },
  year: {
    type: Number,
    min: 1950,
    max: new Date().getFullYear() + 1,
  },
  price: {
    type: Number,
    required: [true, 'يرجى إدخال السعر'],
    min: 0,
  },
  category: {
    type: String,
    enum: ['جرار', 'حفار', 'شاحنة', 'معدة زراعية', 'معدة بناء', 'أخرى'],
    default: 'معدة زراعية',
  },
  condition: {
    type: String,
    enum: ['جديد', 'مستعمل'],
    default: 'مستعمل',
  },
  hours: {
    type: Number,
    min: 0,
    default: 0,
  },
  location: {
    type: String,
    trim: true,
    default: 'المنيا',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'يرجى إدخال الوصف'],
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['متاح', 'مباع', 'محجوز'],
    default: 'متاح',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema);
