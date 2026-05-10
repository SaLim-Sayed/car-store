"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image?: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("الكل")

  // Mock data for demonstration
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "إطلاق موديلات جديدة لعام 2024",
      excerpt: "تستعد الشركات الكبرى لإطلاق أحدث موديلاتها مع تقنيات متطورة وميزات أمان متقدمة.",
      content: "تشهد صناعة السيارات تطوراً هائلاً لعام 2024، حيث تعمل الشركات الرائدة على إطلاق موديلات جديدة تجمع بين الأداء العالي وكفاءة استهلاك الوقود. تشمل أبرز الميزات الجديدة أنظمة القيادة الذاتية المتقدمة، وتقنيات الاتصال المحسّنة، ومحركات كهربائية ذات مدى أطول.",
      author: "أحمد محمد",
      date: "2024-01-15",
      category: "أخبار السيارات",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"
    },
    {
      id: "2",
      title: "ارتفاع أسعار السيارات الكهربائية",
      excerpt: "شهدت أسعار السيارات الكهربائية ارتفاعاً طفيفاً هذا الشهر بسبب زيادة الطلب على المواد الخام.",
      content: "أظهرت الإحصاءات الأخيرة ارتفاعاً في أسعار السيارات الكهربائية بنسبة 5% هذا الشهر، ويعزو الخبراء ذلك إلى زيادة الطلب على البطاريات والمكونات الإلكترونية. ومع ذلك، تتوقع الحكومات تقديم حوافز جديدة لتشجيع التحول إلى السيارات الكهربائية.",
      author: "فاطمة علي",
      date: "2024-01-14",
      category: "الأسعار",
      image: "https://images.unsplash.com/photo-1617654112369-82a9e57c8411?w=600&h=400&fit=crop"
    },
    {
      id: "3",
      title: "عروض حصرية على السيارات العائلية",
      excerpt: "خصومات تصل إلى 20% على السيارات العائلية المختارة لفترة محدودة.",
      content: "أعلنت الوكالات الرائدة عن تقديم عروض حصرية على السيارات العائلية، حيث تصل الخصومات إلى 20% على موديلات 2023. تشمل العروض سيارات من مختلف العلامات التجارية مع ضمان لمدة 5 سنوات وخدمة صيانة مجانية للسنة الأولى.",
      author: "محمد سالم",
      date: "2024-01-13",
      category: "عروض",
      image: "https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=600&h=400&fit=crop"
    },
    {
      id: "4",
      title: "تقنيات الأمان الجديدة في السيارات الحديثة",
      excerpt: "تطور أنظمة الأمان في السيارات بشكل كبير مع إضافة ميزات ذكية تحمي السائق والركاب.",
      content: "تشهد السيارات الحديثة ثورة في تقنيات الأمان، حيث أصبحت مجهزة بأنظمة متقدمة مثل الكبح التلقائي في الطوارئ، ومساعد الحفاظ على المسار، وكاميرات 360 درجة، وأنظمة التحذير من التصادم. هذه التقنيات تساهم بشكل كبير في تقليل الحوادث وتحسين سلامة الركاب.",
      author: "خالد أحمد",
      date: "2024-01-12",
      category: "تقنية",
      image: "https://images.unsplash.com/photo-1563720224045-81751d25408b?w=600&h=400&fit=crop"
    },
    {
      id: "5",
      title: "نصائح لشراء سيارة مستعملة بأمان",
      excerpt: "دليل شامل للمساعدة في شراء سيارة مستعملة بأفضل سعر وبضمان الجودة.",
      content: "عند شراء سيارة مستعملة، من المهم اتباع عدة خطوات لضمان الحصول على صفقة جيدة. تشمل هذه الخطوات فحص تاريخ السيارة، والتحقق من حالة المحرك والمكونات الميكانيكية، والقيام بتجربة قيادة شاملة، والاستعانة بخبير فني للتقييم.",
      author: "نورة محمد",
      date: "2024-01-11",
      category: "إرشادات",
      image: "https://images.unsplash.com/photo-1553413077-1d3782b2b4f0?w=600&h=400&fit=crop"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ["الكل", "أخبار السيارات", "الأسعار", "عروض", "تقنية", "إرشادات"]
  
  const filteredNews = selectedCategory === "الكل" 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">أخبار السيارات</h1>
          <p className="text-muted-foreground">
            أحدث الأخبار والمعلومات من عالم السيارات
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {item.author}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/news/${item.id}`}>
                        قراءة المزيد
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أخبار</h3>
            <p className="text-muted-foreground">
              لم يتم العثور على أخبار في هذا التصنيف
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
