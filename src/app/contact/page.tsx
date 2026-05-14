"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Car,
  Wrench
} from "lucide-react"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: MapPin,
    title: "العنوان",
    details: [
      "شارع طه حسين، حي شلبي",
      "المنيا، جمهورية مصر العربية",
      "الرمز البريدي: 61111"
    ]
  },
  {
    icon: Phone,
    title: "الهاتف",
    details: [
      "+20 100 123 4567",
      "+20 86 234 5678",
      "خدمة العملاء: 19999"
    ]
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: [
      "info@miniacars.com.eg",
      "sales@miniacars.com.eg",
      "support@miniacars.com.eg"
    ]
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: [
      "السبت - الخميس: 9:00 ص - 10:00 م",
      "الجمعة: 2:00 م - 10:00 م",
      "الأحد: مغلق"
    ]
  }
]

const services = [
  {
    icon: Car,
    title: "المبيعات",
    description: "استشارات وشراء سيارات جديدة ومستعملة"
  },
  {
    icon: Wrench,
    title: "الصيانة",
    description: "خدمة فنية وصيانة شاملة للسيارات"
  },
  {
    icon: MessageCircle,
    title: "خدمة العملاء",
    description: "دعم فني ومساعدة بعد البيع"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        service: ""
      })
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.")
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
              تواصل معنا
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              نحن هنا لمساعدتك في العثور على سيارتك المثالية
            </p>
            <p className="text-lg text-gray-200">
              سواء كنت تبحث عن سيارة جديدة أو تحتاج إلى خدمة فنية، فريقنا جاهز لمساعدتك
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1 text-gray-600 text-sm">
                    {info.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">أرسل لنا رسالة</h2>
              <Card>
                <CardContent className="p-6">
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
                        <Label htmlFor="service">نوع الخدمة</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">اختر الخدمة</option>
                          <option value="sales">المبيعات</option>
                          <option value="maintenance">الصيانة</option>
                          <option value="support">خدمة العملاء</option>
                          <option value="other">أخرى</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">الموضوع *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="موضوع رسالتك"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">الرسالة *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب رسالتك هنا..."
                      />
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
                        <>
                          <Send className="ml-2 h-4 w-4" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map and Services */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">خدماتنا</h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <service.icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>موقعنا</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1234567890!2d46.7219!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMDguNyJTIDQ2wrC0zJc3LjgiRQ!5e0!3m2!1sen!2ssa!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Badge variant="secondary" className="text-sm">
                      <MapPin className="ml-1 h-3 w-3" />
                      الرياض، المملكة العربية السعودية
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">هل تحتاج إلى مساعدة عاجلة؟</h2>
            <p className="text-xl mb-8 text-blue-100">
              فريق الطوارئ لدينا متاح 24/7 لمساعدتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                <Phone className="ml-2 h-5 w-5" />
                92000 1234
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                <Mail className="ml-2 h-5 w-5" />
                emergency@carstore.com.sa
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
