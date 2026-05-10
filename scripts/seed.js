const { MongoClient } = require('mongodb');

// Sample car data
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
    status: "متاح",
    createdAt: new Date()
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
    features: ["بلوتوث", "مكيف أوتوماتيك", "نوافذ كهربائية", "مرايا كهربائية"],
    status: "متاح",
    createdAt: new Date()
  },
  {
    brand: "نيسان",
    model: "ألتيما",
    year: 2023,
    price: 110000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 8000,
    color: "فضي",
    description: "نيسان ألتيما 2023 بتقنيات أمان متقدمة وأداء ممتاز.",
    images: ["https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=400&h=300&fit=crop"],
    features: ["نظام ABS", "مثبت سرعة", "كاميرا 360 درجة", "مقاعد خشبية"],
    status: "متاح",
    createdAt: new Date()
  },
  {
    brand: "مرسيدس",
    model: "C-Class",
    year: 2023,
    price: 180000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 5000,
    color: "فضي",
    description: "مرسيدس C-Class 2023 بفخامة وأداء استثنائي.",
    images: ["https://images.unsplash.com/photo-1617654112369-82a9e57c8411?w=400&h=300&fit=crop"],
    features: ["مقاعد جلد", "نظام صوتي", "شاشة عرض", "مكيف هوائي"],
    status: "متاح",
    createdAt: new Date()
  },
  {
    brand: "بي إم دبليو",
    model: "X5",
    year: 2022,
    price: 220000,
    fuelType: "ديزل",
    transmission: "أوتوماتيك",
    mileage: 12000,
    color: "أسود",
    description: "بي إم دبليو X5 2022 SUV فاخرة بأداء قوي.",
    images: ["https://images.unsplash.com/photo-1553413077-1d3782b2b4f0?w=400&h=300&fit=crop"],
    features: ["دفع رباعي", "نظام دفع خلفي", "سقف بانوراما", "مقاعد كهربائية"],
    status: "متاح",
    createdAt: new Date()
  }
];

// Sample admin user
const adminUser = {
  name: "أحمد管理员",
  email: "admin@carstore.com",
  password: "admin123",
  role: "admin"
};

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Insert cars
    const carsCollection = db.collection('cars');
    const existingCars = await carsCollection.countDocuments();
    
    if (existingCars === 0) {
      console.log('Seeding cars...');
      await carsCollection.insertMany(cars);
      console.log(`Inserted ${cars.length} cars`);
    } else {
      console.log(`Cars collection already has ${existingCars} documents`);
    }

    // Insert admin user
    const usersCollection = db.collection('users');
    const existingAdmin = await usersCollection.findOne({ email: adminUser.email });
    
    if (!existingAdmin) {
      console.log('Seeding admin user...');
      // Hash password manually for seeding
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      
      await usersCollection.insertOne({
        ...adminUser,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase();
