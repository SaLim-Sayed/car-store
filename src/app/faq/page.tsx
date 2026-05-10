"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Car,
  Shield,
  DollarSign,
  Users,
  FileText,
  Phone
} from "lucide-react"

const faqCategories = [
  {
    id: "general",
    name: "أسئلة عامة",
    icon: HelpCircle,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "cars",
    name: "السيارات",
    icon: Car,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "financing",
    name: "التمويل",
    icon: DollarSign,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "warranty",
    name: "الضمان والصيانة",
    icon: Shield,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "account",
    name: "الحساب",
    icon: Users,
    color: "bg-red-100 text-red-600"
  },
  {
    id: "legal",
    name: "إجراءات قانونية",
    icon: FileText,
    color: "bg-gray-100 text-gray-600"
  }
]

const faqs = [
  {
    category: "general",
    question: "ما هي ساعات عملكم؟",
    answer: "نحن نعمل من الأحد إلى الخميس من 8:00 صباحاً إلى 8:00 مساءً، والجمعة من 2:00 مساءً إلى 8:00 مساءً، والسبت من 9:00 صباحاً إلى 6:00 مساءً. خدمة الطوارئ متاحة 24/7."
  },
  {
    category: "general",
    question: "هل تقدمون خدمة التوصيل؟",
    answer: "نعم، نقدم خدمة توصيل السيارات إلى جميع المدن الرئيسية في المملكة. يمكن ترتيب التوصيل خلال 3-5 أيام عمل حسب الموقع."
  },
  {
    category: "cars",
    question: "هل السيارات المستعملة مضمونة؟",
    answer: "نعم، جميع سياراتنا المستعملة تخضع لفحص شامل وتأتي مع ضمان لمدة 6 أشهر على المحرك ونظام القيادة. نقدم أيضاً تقرير فحص كامل مع كل سيارة."
  },
  {
    category: "cars",
    question: "هل يمكنني تجربة السيارة قبل الشراء؟",
    answer: "بالتأكيد! نشجع جميع العملاء على تجربة السيارة. يمكنك حجز موعد تجربة قيادة عبر موقعنا أو بالاتصال بفرعنا الأقرب إليك."
  },
  {
    category: "financing",
    question: "ما هي شروط الحصول على تمويل؟",
    answer: "الشروط الأساسية: عمر لا يقل عن 21 سنة، راتب شهري لا يقل عن 5,000 ريال، إقامة سارية للمقيمين، وخلو من السجل الائتماني السلبي."
  },
  {
    category: "financing",
    question: "كم تستغرق عملية الموافقة على التمويل؟",
    answer: "عملية الموافقة تستغرق عادة 24-48 ساعة من تقديم جميع المستندات المطلوبة. في بعض الحالات قد تكون أسرع إذا كانت جميع المعلومات كاملة."
  },
  {
    category: "warranty",
    question: "ماذا يشمل الضمان على السيارات الجديدة؟",
    answer: "السيارات الجديدة تأتي مع ضمان المصنع الكامل الذي يغطي جميع الأعطال الميكانيكية والكهربائية لمدة تصل إلى 5 سنوات أو 100,000 كم حسب سياسة الشركة المصنعة."
  },
  {
    category: "warranty",
    question: "هل تقدمون خدمة الصيانة؟",
    answer: "نعم، لدينا مراكز صيانة معتمدة تقدم جميع أنواع الخدمات من الصيانة الدورية إلى الإصلاحات الكبيرة. نستخدم قطع غيار أصلية ونقدم ضمان على جميع الخدمات."
  },
  {
    category: "account",
    question: "كيف يمكنني إنشاء حساب؟",
    answer: "يمكنك إنشاء حساب بسهولة عبر النقر على 'تسجيل الدخول' ثم 'إنشاء حساب جديد'. ستحتاج فقط إلى بريد إلكتروني ورقم هاتف وإنشاء كلمة مرور."
  },
  {
    category: "account",
    question: "هل يمكنني حفظ السيارات المفضلة؟",
    answer: "نعم، بعد إنشاء حساب يمكنك حفظ السيارات المفضلة، مقارنة بين الموديلات المختلفة، والحصول على إشعارات عند انخفاض الأسعار."
  },
  {
    category: "legal",
    question: "ما هي سياسة الإرجاع؟",
    answer: "نحن نقدم سياسة إرجاع لمدة 7 أيام للسيارات المستعملة و30 يوماً للسيارات الجديدة، مع تطبيق شروط محددة. يجب أن تكون السيارة في نفس الحالة عند الشراء."
  },
  {
    category: "legal",
    question: "هل التسجيل مشمول في السعر؟",
    answer: "نعم، جميع أسعارنا تشمل رسوم التسجيل والنقل والضرائب المطبقة. لا توجد رسوم خفية، والسعر المعروض هو السعر النهائي الذي ستدفعه."
  }
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              إجابات لجميع استفساراتك
            </p>
            <p className="text-lg text-gray-200">
              تجد هنا إجابات للأسئلة الأكثر شيوعاً حول خدماتنا وسياراتنا
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن سؤال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 text-lg"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="h-auto py-3 px-4 flex flex-col items-center gap-2"
              >
                <HelpCircle className="h-6 w-6" />
                <span className="text-sm">الكل</span>
              </Button>
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-auto py-3 px-4 flex flex-col items-center gap-2"
                >
                  <category.icon className="h-6 w-6" />
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                {filteredFAQs.length} سؤال مطابق
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  لم نجد إجابة لسؤالك
                </h3>
                <p className="text-gray-500 mb-6">
                  جرب البحث بكلمات مختلفة أو تواصل معنا مباشرة
                </p>
                <Button asChild>
                  <a href="/contact">تواصل معنا</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => toggleExpanded(index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-right">{faq.question}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {faqCategories.find(c => c.id === faq.category)?.name}
                          </Badge>
                          {expandedItems.includes(index) ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {expandedItems.includes(index) && (
                      <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed text-right">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              لا تزال لديك أسئلة؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              فريق خدمة العملاء لدينا جاهز لمساعدتك
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">اتصل بنا</h3>
                  <p className="text-gray-600 mb-4">92000 1234</p>
                  <p className="text-sm text-gray-500">خدمة عملاء 24/7</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">دردشة مباشرة</h3>
                  <p className="text-gray-600 mb-4">متاحة الآن</p>
                  <p className="text-sm text-gray-500">استجابة فورية</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">زيارة الفرع</h3>
                  <p className="text-gray-600 mb-4">الرياض، جدة</p>
                  <p className="text-sm text-gray-500">8 ص - 8 م</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4" asChild>
                <a href="/contact">تواصل معنا</a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4" asChild>
                <a href="/services">استعرض خدماتنا</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
