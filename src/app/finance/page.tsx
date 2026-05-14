"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Users,
  FileText,
  PiggyBank,
  CreditCard,
  Home,
  Car,
  Phone
} from "lucide-react"
import { toast } from "sonner"

const financingOptions = [
  {
    icon: CreditCard,
    title: "تمويل شخصي",
    description: "تمويل مرن لأي نوع من السيارات الجديدة أو المستعملة",
    features: [
      "فائدة تنافسية تبدأ من 10%",
      "فترة سداد تصل إلى 7 سنوات",
      "مبلغ تمويل يصل إلى 2,000,000 جنيه",
      "موافقة سريعة خلال 48 ساعة"
    ],
    interestRate: "10% - 15%",
    maxAmount: "2,000,000 جنيه",
    maxPeriod: "7 سنوات",
    popular: true
  },
  {
    icon: Home,
    title: "تمويل إسلامي",
    description: "تمويل متوافق مع الشريعة الإسلامية بنظام المرابحة",
    features: [
      "مرابحة إسلامية حقيقية",
      "هوامش ربح تنافسية",
      "شفافية كاملة في التكاليف",
      "شهادة من هيئة الرقابة الشرعية"
    ],
    interestRate: "12% - 16% (هامش الربح)",
    maxAmount: "1,500,000 جنيه",
    maxPeriod: "6 سنوات"
  },
  {
    icon: PiggyBank,
    title: "تمويل للشركات",
    description: "حلول تمويلية متخصصة للشركات والمؤسسات في المنيا",
    features: [
      "تمويل أسطول السيارات",
      "شروط مرنة للشركات الناشئة",
      "تسهيلات في المستندات",
      "مدير حساب متخصص"
    ],
    interestRate: "9% - 13%",
    maxAmount: "10,000,000 جنيه",
    maxPeriod: "5 سنوات"
  }
]

const requirements = [
  {
    icon: Users,
    title: "الشروط العامة",
    items: [
      "مصري الجنسية أو مقيم إقامة سارية",
      "عمر المتقدم لا يقل عن 21 سنة",
      "دخل شهري لا يقل عن 7,000 جنيه",
      "خلو من السجل الائتماني السلبي (I-Score)"
    ]
  },
  {
    icon: FileText,
    title: "المستندات المطلوبة",
    items: [
      "صورة بطاقة الرقم القومي سارية",
      "إثبات الدخل (مفردات مرتب)",
      "كشف حساب بنكي (6 أشهر)",
      "عقد عمل أو سجل تجاري للشركات"
    ]
  },
  {
    icon: Shield,
    title: "ضمانات إضافية",
    items: [
      "ضامن مصري (إذا لزم الأمر)",
      "رهن السيارة المشتراة",
      "تأمين شامل على السيارة",
      "تأمين على حياة المقترض"
    ]
  }
]

const steps = [
  {
    number: "1",
    title: "تقديم الطلب",
    description: "املأ نموذج الطلب الإلكتروني أو زر فرعنا"
  },
  {
    number: "2",
    title: "مراجعة المستندات",
    description: "فريقنا يراجع مستنداتك خلال 24 ساعة"
  },
  {
    number: "3",
    title: "الموافقة المبدئية",
    description: "نرسل لك الموافقة المبدئية والشروط"
  },
  {
    number: "4",
    title: "توقيع العقد",
    description: "نلتقي لتوقيع العقد النهائي"
  },
  {
    number: "5",
    title: "صرف التمويل",
    description: "تحويل المبلغ مباشرة للبائع"
  }
]

export default function FinancePage() {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("3")
  const [loanPeriod, setLoanPeriod] = useState("5")
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    employment: "",
    loanType: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12
    const months = parseInt(loanPeriod) * 12

    if (principal && rate && months) {
      const payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      setMonthlyPayment(Math.round(payment))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("تم إرسال طلب التمويل بنجاح! سنتواصل معك قريباً.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        salary: "",
        employment: "",
        loanType: ""
      })
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
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
              تمويل سياراتك بسهولة
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              خيارات تمويل مرنة تناسب ميزانيتك
            </p>
            <p className="text-lg text-gray-200">
              احصل على تمويل لسيارتك أحلامك بشروط تنافسية وإجراءات مبسطة
            </p>
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              خيارات التمويل المتاحة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر الخيار الذي يناسب احتياجاتك وقدرتك المالية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {financingOptions.map((option, index) => (
              <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 ${option.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {option.popular && (
                  <div className="absolute -top-3 right-4 z-10">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      الأكثر طلباً
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">معدل الفائدة:</span>
                      <span className="font-semibold">{option.interestRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">أقصى مبلغ:</span>
                      <span className="font-semibold">{option.maxAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">أقصى مدة:</span>
                      <span className="font-semibold">{option.maxPeriod}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    اطلب التمويل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                حاسبة التمويل
              </h2>
              <p className="text-xl text-gray-600">
                احسب قسطك الشهري التقريبي
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <Label htmlFor="loanAmount">مبلغ القرض (ريال)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">معدل الفائدة (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanPeriod">مدة القرض (سنوات)</Label>
                    <Input
                      id="loanPeriod"
                      type="number"
                      value={loanPeriod}
                      onChange={(e) => setLoanPeriod(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <Button onClick={calculateLoan} className="w-full mb-6">
                  <Calculator className="ml-2 h-4 w-4" />
                  احسب القسط الشهري
                </Button>
                
                {monthlyPayment && (
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {monthlyPayment.toLocaleString()} ريال
                    </div>
                    <p className="text-gray-600">القسط الشهري التقريبي</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              متطلبات التمويل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تعرف على الشروط والمستندات المطلوبة للحصول على التمويل
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {requirements.map((req, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <req.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{req.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {req.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ابدأ طلب التمويل الآن
              </h2>
              <p className="text-xl text-gray-600">
                املأ النموذج وسنتواصل معك خلال 24 ساعة
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+966 5X XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">الراتب الشهري *</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        required
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment">نوع التوظيف *</Label>
                      <select
                        id="employment"
                        name="employment"
                        value={formData.employment}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر النوع</option>
                        <option value="government">قطاع حكومي</option>
                        <option value="private">قطاع خاص</option>
                        <option value="self-employed">عمل حر</option>
                        <option value="business">صاحب عمل</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="loanType">نوع التمويل *</Label>
                      <select
                        id="loanType"
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر النوع</option>
                        <option value="personal">تمويل شخصي</option>
                        <option value="islamic">تمويل إسلامي</option>
                        <option value="business">تمويل للشركات</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال طلب التمويل"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              خطوات الحصول على التمويل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عملية مبسطة وسريعة للحصول على تمويل سيارتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز للحصول على تمويل سيارتك؟
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              فريقنا جاهز لمساعدتك في الحصول على أفضل خيارات التمويل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                <Phone className="ml-2 h-5 w-5" />
                92000 1234
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
