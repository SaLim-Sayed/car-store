const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const CarSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  price: Number,
  fuelType: String,
  transmission: String,
  mileage: Number,
  color: String,
  description: String,
  images: [String],
  features: [String],
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', CarSchema);
const User = mongoose.model('User', UserSchema);

// Sample data
const cars = [
  {
    brand: "تويوتا",
    model: "كامري",
    year: 2023,
    price: 120000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 15000,
    color: "أبيض",
    description: "سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض.",
    images: ["https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop"],
    features: ["نظام تثبيت السرعة", "كاميرا خلفية", "مستشعر ركن سيارة", "شاشة لمس 8 بوصة"],
    status: "متاح"
  },
  {
    brand: "هونداي",
    model: "سوناتا",
    year: 2022,
    price: 95000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 25000,
    color: "أسود",
    description: "هونداي سوناتا 2022 بميزات متقدمة وتصميم عصري.",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"],
    features: ["بلوثوث", "مكيف أوتوماتيك", "نوافذ كهربائية", "مرايا كهربائية"],
    status: "متاح"
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({});
    
    // Insert cars
    await Car.insertMany(cars);
    console.log(`Inserted ${cars.length} cars`);
    
    // Insert admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: "أحمد管理员",
      email: "admin@carstore.com",
      password: hashedPassword,
      role: "admin",
      isActive: true
    });
    console.log('Admin user created');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
