const { MongoClient, ObjectId } = require('mongodb');

// Showrooms Data
const showroomId1 = new ObjectId();
const showroomId2 = new ObjectId();
const showroomId3 = new ObjectId();
const showroomId4 = new ObjectId();
const showroomId5 = new ObjectId();

const showrooms = [
  {
    _id: showroomId1,
    name: "معرض المنيا للسيارات الفاخرة",
    address: "شارع طه حسين، المنيا",
    phone: "01001234567",
    email: "luxury@miniacars.com",
    logo: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop",
    description: "أكبر معرض للسيارات الفاخرة والرياضية في محافظة المنيا.",
    location: { type: 'Point', coordinates: [30.7333, 28.0833] },
    workingHours: "من 9 صباحاً إلى 10 مساءً",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: showroomId2,
    name: "معرض النيل للمعدات الثقيلة",
    address: "المنطقة الصناعية، المنيا",
    phone: "01112345678",
    email: "heavy@miniacars.com",
    logo: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop",
    description: "متخصصون في بيع وشراء المعدات الثقيلة والزراعية.",
    location: { type: 'Point', coordinates: [30.7433, 28.0933] },
    workingHours: "من 8 صباحاً إلى 8 مساءً",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: showroomId3,
    name: "معرض الأمان للسيارات المستعملة",
    address: "شارع سكة تلة، المنيا",
    phone: "01234567890",
    email: "used@miniacars.com",
    logo: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop",
    description: "أفضل السيارات المستعملة بأسعار تنافسية وحالة ممتازة.",
    location: { type: 'Point', coordinates: [30.7533, 28.0733] },
    workingHours: "من 10 صباحاً إلى 11 مساءً",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: showroomId4,
    name: "معرض النخبة للسيارات",
    address: "شارع كورنيش النيل، المنيا",
    phone: "01099887766",
    email: "elite@miniacars.com",
    logo: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop",
    description: "معرض متخصص في سيارات الدفع الرباعي والسيارات العائلية.",
    location: { type: 'Point', coordinates: [30.7633, 28.1033] },
    workingHours: "من 9 صباحاً إلى 10 مساءً",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: showroomId5,
    name: "معرض التميز للمعدات",
    address: "طريق مصر أسيوط الزراعي، المنيا",
    phone: "01223344556",
    email: "excellence@miniacars.com",
    logo: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop",
    description: "أحدث المعدات الثقيلة والشاحنات بأفضل الأسعار.",
    location: { type: 'Point', coordinates: [30.7733, 28.1133] },
    workingHours: "من 8 صباحاً إلى 6 مساءً",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Equipments Data
const equipments = [
  {
    title: "جرار زراعي جون دير 2023",
    brand: "جون دير",
    model: "8R 410",
    year: 2023,
    price: 3500000,
    category: "معدة زراعية",
    condition: "جديد",
    hours: 50,
    location: "المنيا",
    phone: "01112345678",
    description: "جرار زراعي قوي جداً مجهز بأحدث التقنيات الزراعية.",
    images: [
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800&h=600&fit=crop"
    ],
    features: ["مكيف هواء", "نظام GPS", "إطارات مزدوجة"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "حفار كاتربيلر مستعمل بحالة الزيرو",
    brand: "كاتربيلر",
    model: "320 GC",
    year: 2021,
    price: 2800000,
    category: "حفار",
    condition: "مستعمل",
    hours: 2500,
    location: "المنيا",
    phone: "01112345678",
    description: "حفار كاتربيلر موديل 2021 استخدام خفيف وحالة الموتور ممتازة.",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop"
    ],
    features: ["كابينة مغلقة", "نظام هيدروليكي قوي", "صيانة دورية"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "شاحنة مرسيدس اكتروس",
    brand: "مرسيدس",
    model: "Actros 1845",
    year: 2022,
    price: 4500000,
    category: "شاحنة",
    condition: "مستعمل",
    hours: 150000,
    location: "المنيا",
    phone: "01112345678",
    description: "شاحنة نقل ثقيل بحالة ممتازة جاهزة للعمل فوراً.",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop"
    ],
    features: ["سرير للسائق", "نظام تعليق هوائي", "ناقل حركة أوتوماتيك"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "لودر حفار جي سي بي",
    brand: "جي سي بي",
    model: "3CX",
    year: 2022,
    price: 1800000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 3200,
    location: "المنيا",
    phone: "01223344556",
    description: "لودر حفار بحالة ممتازة وجاهز للعمل في مواقع البناء.",
    images: [
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop"
    ],
    features: ["دفع رباعي", "كابينة مكيفة", "أذرع تحكم متطورة"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "شاحنة قلاب فولفو",
    brand: "فولفو",
    model: "FMX 460",
    year: 2023,
    price: 3200000,
    category: "شاحنة",
    condition: "جديد",
    hours: 100,
    location: "المنيا",
    phone: "01223344556",
    description: "شاحنة قلاب فولفو قوية للمهام الشاقة والمقاولات.",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop"
    ],
    features: ["صندوق حمولة كبير", "نظام تعليق مقوى", "محرك اقتصادي"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "لودر صغير بوبكات",
    brand: "بوبكات",
    model: "S530",
    year: 2021,
    price: 950000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 1200,
    location: "المنيا",
    phone: "01112345678",
    description: "لودر بوبكات صغير الحجم ومناسب للمساحات الضيقة والأعمال السريعة.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop"
    ],
    features: ["حجم مدمج", "عجلات قوية", "سهولة الاستخدام"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "جرار زراعي ماسي فيرجسون",
    brand: "ماسي فيرجسون",
    model: "MF 385",
    year: 2022,
    price: 1200000,
    category: "معدة زراعية",
    condition: "جديد",
    hours: 20,
    location: "المنيا",
    phone: "01234567890",
    description: "جرار زراعي قوي ومتعدد الاستخدامات لجميع الأعمال الزراعية.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop"
    ],
    features: ["قوة حصانية عالية", "سهولة الصيانة", "نظام توجيه متطور"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "حفار كوماتسو",
    brand: "كوماتسو",
    model: "PC200",
    year: 2020,
    price: 3500000,
    category: "حفار",
    condition: "مستعمل",
    hours: 4500,
    location: "المنيا",
    phone: "01001234567",
    description: "حفار كوماتسو بحالة جيدة جداً، قدرة تحمل عالية وأداء قوي.",
    images: [
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop"
    ],
    features: ["كابينة واسعة", "نظام تحكم دقيق", "استهلاك وقود اقتصادي"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "جرافة كاترپيلر",
    brand: "كاتربيلر",
    model: "D8T",
    year: 2021,
    price: 4500000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 3500,
    location: "المنيا",
    phone: "01001234567",
    description: "جرافة كاترپيلر للأعمال الشاقة وتمهيد الطرق بمحرك ديزل قوي جداً.",
    images: [
      "https://images.unsplash.com/photo-1589781844976-b39b5b225916?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530982011905-18833645e7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800&h=600&fit=crop"
    ],
    features: ["شفرة ضخمة", "كابينة مكيفة", "دفع مجنزر"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "رافعة شوكية تويوتا",
    brand: "تويوتا",
    model: "8FGU25",
    year: 2023,
    price: 850000,
    category: "أخرى",
    condition: "جديد",
    hours: 10,
    location: "المنيا",
    phone: "01112345678",
    description: "رافعة شوكية تويوتا حمولة 2.5 طن تعمل بالديزل، مثالية للمخازن والمصانع.",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop"
    ],
    features: ["حمولة 2.5 طن", "ناقل حركة اوتوماتيك", "اقتصادية في الوقود"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "ممهدة طرق فولفو",
    brand: "فولفو",
    model: "G930",
    year: 2020,
    price: 5200000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 5000,
    location: "المنيا",
    phone: "01234567890",
    description: "ممهدة طرق فولفو (جريدر) لتمهيد ورصف الطرق بمهارة وكفاءة عالية.",
    images: [
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop"
    ],
    features: ["شفرة قابلة للتعديل", "توجيه مفصلي", "صيانة شاملة"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "حفار هيتاشي",
    brand: "هيتاشي",
    model: "ZX200",
    year: 2022,
    price: 3800000,
    category: "حفار",
    condition: "مستعمل",
    hours: 2100,
    location: "المنيا",
    phone: "01001234567",
    description: "حفار هيتاشي موديل حديث، أداء جبار وكابينة مريحة مع صيانة توكيل.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=600&fit=crop"
    ],
    features: ["ذراع طويل", "نظام هيدروليكي مزدوج", "شاشة تحكم إلكترونية"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "لودر كاواساكي",
    brand: "كاواساكي",
    model: "95ZV-2",
    year: 2019,
    price: 2400000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 8000,
    location: "المنيا",
    phone: "01112345678",
    description: "لودر كاواساكي بحالة العمل الجيدة، مناسب للمحاجر والمقاولات.",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop"
    ],
    features: ["جرافة عملاقة", "كاوتش جديد", "تكييف هواء"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "رافعة متحركة تادانو",
    brand: "تادانو",
    model: "GR-500EX",
    year: 2023,
    price: 9000000,
    category: "معدة بناء",
    condition: "جديد",
    hours: 50,
    location: "المنيا",
    phone: "01234567890",
    description: "رافعة (ونش) تادانو حمولة 50 طن للطرق الوعرة، دقة وأمان.",
    images: [
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop"
    ],
    features: ["حمولة 50 طن", "أذرع امتداد تلسكوبية", "كمبيوتر أعطال"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "شاحنة خلط خرسانة مرسيدس",
    brand: "مرسيدس",
    model: "Arocs 3240",
    year: 2021,
    price: 4000000,
    category: "شاحنة",
    condition: "مستعمل",
    hours: 150000,
    location: "المنيا",
    phone: "01099887766",
    description: "خلاطة خرسانة مرسيدس سعة 10 متر مكعب، استيراد الخارج.",
    images: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop"
    ],
    features: ["سعة 10 متر", "محرك قوي", "مضخة مياه ذاتية"],
    status: "متاح",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "مدحلة بوماج",
    brand: "بوماج",
    model: "BW 213 D-5",
    year: 2022,
    price: 2800000,
    category: "معدة بناء",
    condition: "مستعمل",
    hours: 1200,
    location: "المنيا",
    phone: "01122334455",
    description: "مدحلة (هراس) بوماج لدمك التربة بقوة اهتزاز عالية.",
    images: [
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=600&fit=crop"
    ],
    features: ["دمك عالي", "محرك موفر للطاقة", "كابينة عازلة للصوت"],
    status: "متاح",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample car data
const cars = [
  {
    brand: "تويوتا",
    model: "كامري",
    year: 2023,
    price: 1200000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 15000,
    color: "أبيض",
    description: "سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض.",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=600&fit=crop"
    ],
    features: ["نظام تثبيت السرعة", "كاميرا خلفية", "مستشعر ركن سيارة", "شاشة لمس 8 بوصة"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "هونداي",
    model: "سوناتا",
    year: 2022,
    price: 950000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 25000,
    color: "أسود",
    description: "هونداي سوناتا 2022 بميزات متقدمة وتصميم عصري.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop"
    ],
    features: ["بلوتوث", "مكيف أوتوماتيك", "نوافذ كهربائية", "مرايا كهربائية"],
    status: "متاح",
    showroom: showroomId3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "نيسان",
    model: "ألتيما",
    year: 2023,
    price: 1100000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 8000,
    color: "فضي",
    description: "نيسان ألتيما 2023 بتقنيات أمان متقدمة وأداء ممتاز.",
    images: [
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&h=600&fit=crop"
    ],
    features: ["نظام ABS", "مثبت سرعة", "كاميرا 360 درجة", "مقاعد جلدية"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "مرسيدس",
    model: "C-Class",
    year: 2023,
    price: 2800000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 5000,
    color: "فضي",
    description: "مرسيدس C-Class 2023 بفخامة وأداء استثنائي.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop"
    ],
    features: ["مقاعد جلد", "نظام صوتي محيطي", "شاشة عرض بانورامية", "مكيف هوائي ثنائي المناطق"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "بي إم دبليو",
    model: "X5",
    year: 2022,
    price: 3200000,
    fuelType: "ديزل",
    transmission: "أوتوماتيك",
    mileage: 12000,
    color: "أسود",
    description: "بي إم دبليو X5 2022 SUV فاخرة بأداء قوي.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop"
    ],
    features: ["دفع رباعي", "نظام ملاحة متطور", "سقف بانوراما", "مقاعد كهربائية بذاكرة"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "بورش",
    model: "911",
    year: 2024,
    price: 6500000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 1000,
    color: "أحمر",
    description: "بورش 911 الأيقونية بتصميم رياضي وأداء مبهر.",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop"
    ],
    features: ["محرك توربو", "مكابح سيراميك", "عادم رياضي", "نظام تعليق متكيف"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "أودي",
    model: "R8",
    year: 2023,
    price: 5800000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 3500,
    color: "رمادي",
    description: "أودي R8 بمحرك V10 وتصميم خاطف للأنظار.",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=600&fit=crop"
    ],
    features: ["نظام كواترو", "مصابيح ليزر", "مقاعد رياضية", "مقصورة ألياف الكربون"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "لاند روفر",
    model: "رينج روفر",
    year: 2023,
    price: 4900000,
    fuelType: "هايبرد",
    transmission: "أوتوماتيك",
    mileage: 6000,
    color: "أسود",
    description: "رينج روفر الجديدة كلياً بالفخامة البريطانية الأصيلة.",
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop"
    ],
    features: ["توجيه رباعي", "نظام ترفيه للمقاعد الخلفية", "ثلاجة صغيرة", "أبواب شفط"],
    status: "متاح",
    showroom: showroomId1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "تسلا",
    model: "موديل 3",
    year: 2023,
    price: 1850000,
    fuelType: "كهرباء",
    transmission: "أوتوماتيك",
    mileage: 5000,
    color: "أبيض",
    description: "سيارة تسلا موديل 3 كهربائية بالكامل مع مدى قيادة طويل.",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&h=600&fit=crop"
    ],
    features: ["قيادة ذاتية", "شاشة 15 بوصة", "تحديثات عن بعد", "سقف زجاجي"],
    status: "متاح",
    showroom: showroomId4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "فورد",
    model: "موستانج",
    year: 2022,
    price: 2100000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 18000,
    color: "أصفر",
    description: "فورد موستانج جي تي بمحرك V8 وأداء رياضي استثنائي.",
    images: [
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=600&fit=crop"
    ],
    features: ["عادم رياضي نشط", "مقاعد ريكارو", "نظام صوتي ممتاز"],
    status: "متاح",
    showroom: showroomId4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "كيا",
    model: "سبورتاج",
    year: 2024,
    price: 1600000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 0,
    color: "أزرق",
    description: "كيا سبورتاج الجديدة كلياً بتصميم عصري ومواصفات أمان عالية.",
    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop"
    ],
    features: ["شاشة بانورامية", "شاحن لاسلكي", "حساسات أمامية وخلفية"],
    status: "متاح",
    showroom: showroomId3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: "تويوتا",
    model: "لاند كروزر",
    year: 2023,
    price: 4500000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 12000,
    color: "لؤلؤي",
    description: "تويوتا لاند كروزر مفخرة الأرض، قوة وفخامة في كل التضاريس.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop"
    ],
    features: ["ثلاجة", "دفع رباعي مستمر", "نظام الزحف", "شاشات خلفية"],
    status: "متاح",
    showroom: showroomId4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample admin user
const adminUser = {
  name: "أحمد المنياوي",
  email: "admin@miniacars.com",
  password: "admin123",
  role: "admin"
};

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/car_store";
  
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('cars').deleteMany({});
    await db.collection('equipment').deleteMany({});
    await db.collection('showrooms').deleteMany({});
    await db.collection('users').deleteMany({});

    // Insert Showrooms
    console.log('Seeding showrooms...');
    await db.collection('showrooms').insertMany(showrooms);
    console.log(`Inserted ${showrooms.length} showrooms`);

    // Insert Equipments
    console.log('Seeding equipment...');
    await db.collection('equipment').insertMany(equipments);
    console.log(`Inserted ${equipments.length} equipment`);

    // Insert Cars
    console.log('Seeding cars...');
    await db.collection('cars').insertMany(cars);
    console.log(`Inserted ${cars.length} cars`);

    // Insert admin user
    console.log('Seeding admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    
    await db.collection('users').insertOne({
      ...adminUser,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Admin user created');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase();
