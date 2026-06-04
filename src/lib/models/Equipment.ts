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
 required: false,
 min: 0,
 },
 category: {
 type: String,
 enum: ['جرار', 'حفار', 'شاحنة', 'معدة زراعية', 'معدة بناء', 'موتوسيكل', 'توك توك', 'تروسيكل', 'سكوتر', 'دراجة نارية', 'أخرى'],
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
 default: 'مدينة المنيا. ميدان الحميات',
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
 locationLink: {
 type: String,
 trim: true,
 default: '',
 },
 featured: {
 type: Boolean,
 default: false,
 },
 showroom: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Showroom',
 },
}, {
 timestamps: true,
});

if (mongoose.models.Equipment) {
  delete mongoose.models.Equipment;
}

export default mongoose.model('Equipment', EquipmentSchema);
