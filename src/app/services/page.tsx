"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car,
  Wrench,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Zap,
  Heart,
  Award,
  TrendingUp
} from "lucide-react"
import Image from "next/image"

const services = [
  {
    icon: Car,
    title: "بيع السيارات",
    description: "مجموعة واسعة من السيارات الجديدة والمستعملة بأفضل الأسعار",
    features: [
      "سيارات معتمدة ومفحصة",
      "أسعار تنافسية",
      "ضمان الجودة",
      "تسهيلات الدفع"
    ],
    price: "يبدأ من 300,000 جنيه",
    popular: true
  },
  {
    icon: Wrench,
    title: "الصيانة والإصلاح",
    description: "خدمة فنية متخصصة لجميع أنواع السيارات بفريق محترف في المنيا",
    features: [
      "فنيون معتمدون",
      "قطع غيار أصلية",
      "ضمان على الخدمة",
      "تشخيص حديث"
    ],
    price: "يبدأ من 500 جنيه"
  },
  {
    icon: Shield,
    title: "تأمين السيارات",
    description: "أفضل شركات التأمين مع تغطية شاملة وأسعار ممتازة في السوق المصري",
    features: [
      "تغطية شاملة",
      "معالجة سريعة",
      "أسعار تنافسية",
      "دعم 24/7"
    ],
    price: "يبدأ من 5,000 جنيه سنوياً"
  },
  {
    icon: Clock,
    title: "خدمة الطوارئ",
    description: "خدمة سريعة على مدار الساعة للطوارئ على الطريق في محافظة المنيا",
    features: [
      "استجابة سريعة",
      "خدمة 24/7",
      "فريق متخصص",
      "تغطية واسعة"
    ],
    price: "يبدأ من 300 جنيه"
  },
  {
    icon: TrendingUp,
    title: "استشارات السيارات",
    description: "خبراء لمساعدتك في اتخاذ قرارات الشراء والبيع الصحيحة",
    features: [
      "تقييم دقيق",
      "خبراء متخصصون",
      "تقارير مفصلة",
      "نصائح عملية"
    ],
    price: "يبدأ من 1,000 جنيه"
  },
  {
    icon: Users,
    title: "خدمة العملاء",
    description: "دعم شامل ومتابعة مستمرة لضمان رضا العملاء",
    features: [
      "دعم فني",
      "متابعة مستمرة",
      "حلول سريعة",
      "فريق متخصص"
    ],
    price: "مجاني للعملاء"
  }
]

const benefits = [
  {
    icon: CheckCircle,
    title: "جودة مضمونة",
    description: "جميع خدماتنا تخضع لأعلى معايير الجودة"
  },
  {
    icon: Clock,
    title: "خدمة سريعة",
    description: "نلتزم بتقديم الخدمات في أسرع وقت ممكن"
  },
  {
    icon: Shield,
    title: "ضمان شامل",
    description: "نقدم ضمانات على جميع خدماتنا ومنتجاتنا"
  },
  {
    icon: Users,
    title: "فريق محترف",
    description: "فريق من الخبراء المتخصصين في مجال السيارات"
  },
  {
    icon: DollarSign,
    title: "أسعار تنافسية",
    description: "أفضل الأسعار في السمع مع الحفاظ على الجودة"
  },
  {
    icon: Heart,
    title: "رضا العملاء",
    description: "رضا العملاء هو أولويتنا القصوى"
  }
]

const testimonials = [
  {
    name: "محمد الأحمدي",
    role: "عميل منذ 3 سنوات",
    content: "خدمة ممتازة وفريق محترف. اشتريت سيارتي منهم وأنا سعيد جداً بالجودة والسعر.",
    rating: 5
  },
  {
    name: "فاطمة القحطاني",
    role: "عميلة جديدة",
    content: "تجربة شراء رائعة! ساعدوني في اختيار السيارة المناسبة وكانوا متعاونين جداً.",
    rating: 5
  },
  {
    name: "عبدالله العتيبي",
    role: "عميل منتظم",
    content: "أفضل صيانة تعاملت معها. فنيون محترفون وأسعار معقولة جداً.",
    rating: 5
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              خدماتنا الشاملة
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              كل ما تحتاجه لسيارتك في مكان واحد
            </p>
            <p className="text-lg text-gray-200">
              من بيع السيارات إلى الصيانة والتأمين، نقدم حلولاً متكاملة تلبي جميع احتياجاتك
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              خدماتنا الرئيسية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة واسعة من الخدمات المتخصصة لضمان رضاكم التام
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${service.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 right-4 z-10">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      <Star className="ml-1 h-3 w-3" />
                      الأكثر طلباً
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600 mb-3">{service.price}</div>
                      <Button className="w-full">
                        اطلب الخدمة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نتميز بمجموعة من المزايا التي تجعلنا الخيار الأول للعملاء
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ماذا يقول عملاؤنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              آراء عملائنا هي دليل على جودة خدماتنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز لتجربة خدماتنا المتميزة؟
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              تواصل معنا اليوم واحصل على استشارة مجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4" asChild>
                <a href="/contact">تواصل معنا</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4" asChild>
                <a href="/cars">استعرض السيارات</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
