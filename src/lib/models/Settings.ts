import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  phoneDisplay: {
    type: String,
    default: '+20 109 903 9480',
  },
  phoneE164: {
    type: String,
    default: '201099039480',
  },
  facebook: {
    type: String,
    default: 'https://www.facebook.com/share/1GWZAJfyKL/',
  },
  instagram: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: 'info@carstore.com', // placeholder
  },
  address: {
    type: String,
    default: 'مدينة المنيا، مصر',
  }
}, {
  timestamps: true,
});

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model('Settings', SettingsSchema);
