import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'يرجى إدخال عنوان الخبر'],
  },
  content: {
    type: String,
    required: [true, 'يرجى إدخال محتوى الخبر'],
  },
  excerpt: {
    type: String,
    required: [true, 'يرجى إدخال ملخص الخبر'],
  },
  category: {
    type: String,
    required: [true, 'يرجى اختيار القسم'],
    enum: ['أخبار السوق', 'جديد السيارات', 'نصائح تهمك', 'مراجعات', 'أخبار', 'عروض', 'نصائح', 'جديد'],
    default: 'أخبار السوق',
  },
  image: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'الإدارة',
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
  },
  status: {
    type: String,
    enum: ['نشط', 'مسودة'],
    default: 'نشط',
  },
}, {
  timestamps: true,
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
