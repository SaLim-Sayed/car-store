"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Shield, 
  Zap,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "أحمد محمد",
    position: "المدير التنفيذي",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "خبير في صناعة السيارات بخبرة تزيد عن 15 عاماً في السوق المصري"
  },
  {
    name: "سارة عبدالله",
    position: "مديرة المبيعات",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    bio: "متخصصة في توفير أفضل الحلول للعملاء مع خبرة في خدمة العملاء"
  },
  {
    name: "خالد السعيد",
    position: "مدير الخدمة الفنية",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    bio: "مهندس سيارات معتمد يضمن أعلى معايير الجودة والصيانة"
  },
  {
    name: "نورة العلي",
    position: "مديرة التسويق",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "مبتكرة في استراتيجيات التسويق الرقمي وتطوير العلامة التجارية"
  }
]

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "عميل راضٍ",
    description: "عملاء سعداء يثقون في خدماتنا"
  },
  {
    icon: Award,
    value: "15+",
    label: "سنة خبرة",
    description: "سنوات من التميز في السوق"
  },
  {
    icon: Shield,
    value: "100%",
    label: "ضمان الجودة",
    description: "جميع سياراتنا مضمونة"
  },
  {
    icon: Zap,
    value: "24/7",
    label: "دعم فوري",
    description: "خدمة عملاء على مدار الساعة"
  }
]

const values = [
  {
    icon: Heart,
    title: "النزاهة",
    description: "نلتزم بأعلى معايير الأمانة والشفافية في جميع تعاملاتنا"
  },
  {
    icon: Target,
    title: "التميز",
    description: "نسعى دائماً لتقديم أفضل الخدمات والمنتجات لعملائنا"
  },
  {
    icon: Users,
    title: "العميل أولاً",
    description: "رضا العملاء هو أولويتنا القصوى في كل ما نفعله"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
       
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              من نحن
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              رائداً في عالم السيارات في قلب صعيد مصر - المنيا
            </p>
            <p className="text-lg text-gray-200 leading-relaxed">
              منذ تأسيسنا ونحن نسعى لتقديم أفضل تجربة شراء سيارات لعملائنا، مع التركيز على الجودة والثقة والخدمة الممتازة
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  قصتنا تبدأ بالشغف
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    تأسس معرضنا في عام 2009 بشغف عميق بالسيارات ورغبة في تقديم تجربة شراء فريدة للعملاء.
                  </p>
                  <p>
                    بدأنا كفريق صغير من الخبراء المتحمسين، واليوم نحن فريق من أكثر من 50 محترفاً مكرسون لتقديم أفضل الخدمات في صناعة السيارات.
                  </p>
                  <p>
                    نؤمن بأن كل عميل يستخدم تجربة شخصية ومخصصة، ولهذا السبب نأخذ الوقت الكافي لفهم احتياجاتك وتقديم الحلول المثالية التي تناسب ميزانيتك وأسلوب حياتك.
                  </p>
                </div>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop"
                  alt="معرض السيارات"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              المبادئ التي توجه كل قرار نتخذه وكل خدمة نقدمها
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              فريق العمل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نلتقي بالخبراء الذين يجعلون كل شيء ممكناً
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.position}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              انضم إلى عائلتنا من العملاء الراضين
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              اكتشف لماذا نحن الخيار الأول لآلاف العملاء في المملكة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4" asChild>
                <a href="/cars">استعرض السيارات</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4" asChild>
                <a href="/contact">تواصل معنا</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
