"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText,
  Shield,
  Car,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

const termsSections = [
  {
    id: "introduction",
    title: "مقدمة",
    icon: FileText,
    content: [
      "مرحباً بك في موقعنا. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بالشروط والأحكام المذكورة أدناه.",
      "هذه الشروط والأحكام تحكم استخدامك لموقعنا الإلكتروني وخدماتنا المقدمة من خلاله. يرجى قراءتها بعناية قبل استخدام موقعنا.",
      "إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام موقعنا أو خدماتنا."
    ]
  },
  {
    id: "services",
    title: "الخدمات المقدمة",
    icon: Car,
    content: [
      "نقدم مجموعة واسعة من الخدمات تشمل بيع السيارات الجديدة والمستعملة، الصيانة، التمويل، وخدمة العملاء.",
      "جميع السيارات المعروضة تخضع لفحص شامل وتأتي مع تقارير مفصلة عن حالتها.",
      "الأسعار المعروضة تشمل جميع الرسوم القانونية والضريبية المطبقة في جمهورية مصر العربية.",
      "نحتفظ بالحق في تعديل الخدمات المقدمة والأسعار في أي وقت دون إشعار مسبق."
    ]
  },
  {
    id: "user-responsibilities",
    title: "مسؤوليات المستخدم",
    icon: Users,
    content: [
      "يجب على المستخدم تقديم معلومات دقيقة وحقيقية عند إنشاء الحساب أو إتمام المعاملات.",
      "يحظر استخدام الموقع لأي أغراض غير قانونية أو مخالفة للقوانين المصرية.",
      "يحظر نسخ أو توزيع المحتوى الموجود على الموقع بدون إذن كتابي مسبق.",
      "المستخدم مسؤول عن الحفاظ على سرية معلومات حسابه وكلمة المرور."
    ]
  },
  {
    id: "payment",
    title: "المدفوعات والأسعار",
    icon: DollarSign,
    content: [
      "جميع الأسعار المعروضة بالجنيه المصري وتشمل ضريبة القيمة المضافة.",
      "نقبل مختلف وسائل الدفع الإلكتروني والنقدي حسب السياسات المعمول بها.",
      "يجب إتمام عملية الدفع خلال الفترة المحددة لتأكيد الحجز أو الشراء.",
      "في حالة التمويل، تخضع جميع المعاملات لشروط البنك الممول والسياسات الائتمانية المعمول بها."
    ]
  },
  {
    id: "warranty",
    title: "الضمان والإرجاع",
    icon: Shield,
    content: [
      "السيارات الجديدة تأتي مع ضمان المصنع الكامل حسب سياسة الشركة المصنعة.",
      "السيارات المستعملة تأتي مع ضمان لمدة 6 أشهر على المحرك ونظام القيادة.",
      "سياسة الإرجاع: يمكن إرجاع السيارة خلال 7 أيام من تاريخ الشراء مع تطبيق الشروط التالية:",
      "  - أن تكون السيارة في نفس الحالة عند الشراء",
      "  - عدم تجاوز المسافة المقطوعة 500 كم",
      "  - تقديم جميع المستندات الأصلية",
      "  - في حالة وجود أي عيوب، يتم تطبيق سياسة الضمان المعمول بها"
    ]
  },
  {
    id: "intellectual-property",
    title: "الملكية الفكرية",
    icon: FileText,
    content: [
      "جميع الحقوق الفكرية للموقع ومحتواه ملك لمعرضنا.",
      "يحظر استخدام الأسماء التجارية، الشعارات، أو المحتوى بدون إذن كتابي.",
      "جميع الصور والفيديوهات والمعلومات محمية بموجب قوانين حقوق النشر."
    ]
  },
  {
    id: "limitation",
    title: "تحديد المسؤولية",
    icon: AlertTriangle,
    content: [
      "لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع.",
      "نحن لا نضمن استمرارية الخدمة أو عدم وجود انقطاعات في الموقع.",
      "جميع المعلومات المقدمة في الموقع هي لأغراض إعلامية فقط وقد لا تكون دقيقة 100%.",
      "ننصح بالتحقق من جميع المعلومات قبل اتخاذ أي قرارات شراء."
    ]
  },
  {
    id: "privacy",
    title: "الخصوصية والبيانات",
    icon: Shield,
    content: [
      "نحن نلتزم بحماية خصوصية بيانات العملاء وفقاً للقوانين المصرية المعمول بها.",
      "جميع البيانات الشخصية يتم جمعها واستخدامها وفقاً لسياسة الخصوصية المعمول بها.",
      "نحن لا نشارك بيانات العملاء مع أي طرف ثالث بدون موافقة صريحة.",
      "يحق للمستخدم طلب نسخة من بياناته أو حذفها في أي وقت."
    ]
  }
]

export default function TermsPage() {
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
              الشروط والأحكام
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              قواعد استخدام موقعنا وخدماتنا
            </p>
            <p className="text-lg text-gray-200">
              يرجى قراءة الشروط والأحكام بعناية قبل استخدام خدماتنا
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
              {termsSections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  className="h-auto p-4 flex items-center gap-3 text-right justify-start"
                  onClick={() => scrollToSection(section.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    section.id === 'introduction' ? 'bg-blue-100 text-blue-600' :
                    section.id === 'services' ? 'bg-green-100 text-green-600' :
                    section.id === 'user-responsibilities' ? 'bg-purple-100 text-purple-600' :
                    section.id === 'payment' ? 'bg-orange-100 text-orange-600' :
                    section.id === 'warranty' ? 'bg-red-100 text-red-600' :
                    section.id === 'intellectual-property' ? 'bg-gray-100 text-gray-600' :
                    section.id === 'limitation' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-indigo-100 text-indigo-600'
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

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {termsSections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-20">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          section.id === 'introduction' ? 'bg-blue-100 text-blue-600' :
                          section.id === 'services' ? 'bg-green-100 text-green-600' :
                          section.id === 'user-responsibilities' ? 'bg-purple-100 text-purple-600' :
                          section.id === 'payment' ? 'bg-orange-100 text-orange-600' :
                          section.id === 'warranty' ? 'bg-red-100 text-red-600' :
                          section.id === 'intellectual-property' ? 'bg-gray-100 text-gray-600' :
                          section.id === 'limitation' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-indigo-100 text-indigo-600'
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

            {/* Last Updated */}
            <div className="mt-16 p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <strong>آخر تحديث:</strong> 1 يناير 2024
              </p>
              <p className="text-gray-600 mt-2">
                قد يتم تحديث هذه الشروط والأحكام بشكل دوري. يرجى مراجعتها بانتظام.
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
              هل لديك أسئلة حول الشروط؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              فريقنا جاهز للإجابة على جميع استفساراتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4" asChild>
                <a href="/contact">تواصل معنا</a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4" asChild>
                <a href="/faq">الأسئلة الشائعة</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
