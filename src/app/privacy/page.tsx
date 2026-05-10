"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield,
  Database,
  Eye,
  Lock,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Cookie
} from "lucide-react"

const privacySections = [
  {
    id: "introduction",
    title: "مقدمة",
    icon: Shield,
    content: [
      "نحن في شركة السيارات المتخصصة نلتزم بحماية خصوصية بيانات عملائنا وضمان أمانها.",
      "توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للبيانات الشخصية وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية.",
      "باستخدامك لموقعنا وخدماتنا، فإنك توافق على جمع واستخدام بياناتك كما هو موضح في هذه السياسة."
    ]
  },
  {
    id: "data-collection",
    title: "جمع البيانات",
    icon: Database,
    content: [
      "نجمع البيانات الشخصية التالية عند استخدامك لموقعنا وخدماتنا:",
      "  - المعلومات الأساسية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان",
      "  - معلومات الاتصال: بيانات التواصل المختلفة",
      "  - المعلومات المالية: بيانات الدفع والتمويل (مشفرة وآمنة)",
      "  - بيانات الاستخدام: كيفية استخدامك للموقع والخدمات",
      "  - بيانات التفضيلات: اهتماماتك وتفضيلات السيارات",
      "  - المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل"
    ]
  },
  {
    id: "data-usage",
    title: "استخدام البيانات",
    icon: Eye,
    content: [
      "نستخدم بياناتك للأغراض التالية:",
      "  - تقديم الخدمات: معالجة طلبات الشراء والتمويل",
      "  - التواصل: إرسال إشعارات وتحديثات عن الخدمات",
      "  - التحسين: تحسين جودة الخدمات وتجربة المستخدم",
      "  - التسويق: إرسال عروض وعروض ترويجية (بموافقتك)",
      "  - الأمان: حماية حسابك ومنع الاحتيال",
      "  - التحليل: تحليل البيانات لفهم سلوك المستخدمين وتحسين الموقع"
    ]
  },
  {
    id: "data-protection",
    title: "حماية البيانات",
    icon: Lock,
    content: [
      "نتخذ إجراءات أمان صارمة لحماية بياناتك:",
      "  - التشفير: جميع البيانات الحساسة مشفرة أثناء النقل والتخزين",
      "  - الوصول المحدود: فقط الموظفون المصرح لهم يمكنهم الوصول للبيانات",
      "  - الجدران النارية: أنظمة حماية متقدمة لمنع الاختراقات",
      "  - النسخ الاحتياطي: نسخ احتياطية منتظمة للبيانات",
      "  - المراجعات الدورية: فحص أمني دوري للأنظمة والبيانات",
      "  - الامتثال: الالتزام الكامل بنظام حماية البيانات السعودي"
    ]
  },
  {
    id: "cookies",
    title: "ملفات تعريف الارتباط (Cookies)",
    icon: Cookie,
    content: [
      "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم:",
      "  - ملفات أساسية: ضرورية لعمل الموقع",
      "  - ملفات الأداء: تحليل أداء الموقع وتحسينه",
      "  - ملفات التخصيص: تخصيص المحتوى حسب اهتماماتك",
      "  - ملفات التسويق: عرض إعلانات ذات صلة",
      "يمكنك التحكم في ملفات تعريف الارتباط من إعدادات متصفحك",
      "إلغاء تفعيل بعض ملفات تعريف الارتباط قد يؤثر على وظائف الموقع"
    ]
  },
  {
    id: "third-party",
    title: "مشاركة البيانات مع الأطراف الثالثة",
    icon: Users,
    content: [
      "نشارك بياناتك فقط في الحالات التالية:",
      "  - البنوك ومؤسسات التمويل: لمعالجة طلبات التمويل",
      "  - شركات التأمين: لتأمين السيارات",
      "  - شركات الشحن: لتوصيل السيارات",
      "  - السلطات الحكومية: عند الطلب القانوني",
      "  - مقدمو الخدمات: شركات الدفع الإلكتروني والخدمات التقنية",
      "نضمن أن جميع الأطراف الثالثة تلتزم بنفس معايير حماية البيانات"
    ]
  },
  {
    id: "user-rights",
    title: "حقوق المستخدم",
    icon: CheckCircle,
    content: [
      "لديك الحقوق التالية بشأن بياناتك:",
      "  - الوصول: الحصول على نسخة من بياناتك الشخصية",
      "  - التصحيح: طلب تصحيح البيانات غير الدقيقة",
      "  - الحذف: طلب حذف بياناتك الشخصية",
      "  - التقييد: تقييد معالجة بياناتك في حالات معينة",
      "  - النقل: نقل بياناتك إلى مزود خدمة آخر",
      "  - الاعتراض: الاعتراض على معالجة بياناتك لأغراض التسويق",
      "لممارسة هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@carstore.com.sa"
    ]
  },
  {
    id: "data-retention",
    title: "الاحتفاظ بالبيانات",
    icon: FileText,
    content: [
      "نحتفظ ببياناتك للفترات التالية:",
      "  - بيانات الحساب: طوال فترة استخدامك للخدمات",
      "  - بيانات المعاملات: 7 سنوات للأغراض المحاسبية والضريبية",
      "  - بيانات التسويق: حتى إلغاء الاشتراك في الخدمات التسويقية",
      "  - بيانات التحليل: 24 شهراً لأغراض التحليل والتحسين",
      "بعد انتهاء فترة الاحتفاظ، يتم حذف البيانات بشكل آمن",
      "قد نحتفظ ببعض البيانات لفترة أطول إذا كان ذلك مطلوباً قانونياً"
    ]
  },
  {
    id: "children-privacy",
    title: "خصوصية الأطفال",
    icon: AlertTriangle,
    content: [
      "خدماتنا موجهة للأشخاص الذين تبلغ أعمارهم 18 عاماً فأكثر.",
      "نحن لا نجمع عن قصد معلومات شخصية من الأطفال دون سن 18 عاماً.",
      "إذا اكتشفنا أننا جمعنا بيانات من طفل دون سن 18 عاماً، سنقوم بحذفها فوراً.",
      "ن鼓励 الآباء والأمهات إلى مراقبة استخدام أطفالهم للإنترنت."
    ]
  }
]

export default function PrivacyPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              كيف نحمي بياناتك وخصوصيتك
            </p>
            <p className="text-lg text-gray-200">
              نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">التنقل السريع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {privacySections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  className="h-auto p-4 flex items-center gap-3 text-right justify-start"
                  onClick={() => scrollToSection(section.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    section.id === 'introduction' ? 'bg-blue-100 text-blue-600' :
                    section.id === 'data-collection' ? 'bg-green-100 text-green-600' :
                    section.id === 'data-usage' ? 'bg-purple-100 text-purple-600' :
                    section.id === 'data-protection' ? 'bg-orange-100 text-orange-600' :
                    section.id === 'cookies' ? 'bg-red-100 text-red-600' :
                    section.id === 'third-party' ? 'bg-gray-100 text-gray-600' :
                    section.id === 'user-rights' ? 'bg-indigo-100 text-indigo-600' :
                    section.id === 'data-retention' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{section.title}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {privacySections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-20">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          section.id === 'introduction' ? 'bg-blue-100 text-blue-600' :
                          section.id === 'data-collection' ? 'bg-green-100 text-green-600' :
                          section.id === 'data-usage' ? 'bg-purple-100 text-purple-600' :
                          section.id === 'data-protection' ? 'bg-orange-100 text-orange-600' :
                          section.id === 'cookies' ? 'bg-red-100 text-red-600' :
                          section.id === 'third-party' ? 'bg-gray-100 text-gray-600' :
                          section.id === 'user-rights' ? 'bg-indigo-100 text-indigo-600' :
                          section.id === 'data-retention' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-pink-100 text-pink-600'
                        }`}>
                          <section.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-600 leading-relaxed text-right">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-16 p-8 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">تواصل معنا بشأن الخصوصية</h3>
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  <strong>البريد الإلكتروني للخصوصية:</strong> privacy@carstore.com.sa
                </p>
                <p className="text-gray-600">
                  <strong>هاتف الخصوصية:</strong> +966 11 234 5678
                </p>
                <p className="text-gray-600">
                  <strong>العنوان:</strong> الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <strong>آخر تحديث:</strong> 1 يناير 2024
              </p>
              <p className="text-gray-600 mt-2">
                قد يتم تحديث هذه السياسة بشكل دوري. يرجى مراجعتها بانتظام.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              هل لديك أسئلة عن الخصوصية؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              فريق الخصوصية لدينا جاهز للإجابة على جميع استفساراتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4" asChild>
                <a href="/contact">تواصل معنا</a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4" asChild>
                <a href="/terms">الشروط والأحكام</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
