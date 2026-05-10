"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Calendar, 
  User, 
  Share2, 
  Heart,
  MessageCircle,
  ArrowLeft
} from "lucide-react"
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

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  // Mock data for demonstration
  const mockNews: NewsItem = {
    id: "1",
    title: "إطلاق موديلات جديدة لعام 2024",
    excerpt: "تستعد الشركات الكبرى لإطلاق أحدث موديلاتها مع تقنيات متطورة وميزات أمان متقدمة.",
    content: `
## مقدمة

تشهد صناعة السيارات تطوراً هائلاً لعام 2024، حيث تعمل الشركات الرائدة على إطلاق موديلات جديدة تجمع بين الأداء العالي وكفاءة استهلاك الوقود.

## التقنيات الجديدة

### أنظمة القيادة الذاتية
أبرز الميزات الجديدة تشمل أنظمة القيادة الذاتية المتقدمة التي تسمح للسيارة بالتحرك autonomously في ظروف معينة.

### تقنيات الاتصال المحسّنة
تقنيات الاتصال المحسّنة التي تربط السيارة بالهاتف الذكي وتوفر ميزات إضافية مثل التحكم عن بعد وتحديثات البرمجيات.

### محركات كهربائية ذات مدى أطول
محركات كهربائية ذات مدى أطول تصل إلى 500 كم بشحنة واحدة، مما يجعلها أكثر عملية للاستخدام اليومي.

## الموديلات المتوقعة

### تويوتا
- تويوتا كامري 2024 بتصميم جديد ومحرك هايبرد محسّن
- تويوتا بريوس 2024 بميزات أمان متقدمة

### هونداي
- هونداي سوناتا 2023 بشاشة لمس أكبر وتصميم رياضي
- هونداي توسان 2024 بمحرك كهربائي بالكامل

### مرسيدس
- مرسيدس C-Class 2024 بتقنيات الاتصال المتقدمة
- مرسيدس EQS 2024 بمدى 600 كم

## الخلاصة

مع هذه التطورات، يتوقع أن يكون عام 2024 نقطة تحول في صناعة السيارات، مع تركيز أكبر على الاستدامة والتقنيات الذكية.
    `,
    author: "أحمد محمد",
    date: "2024-01-15",
    category: "أخبار السيارات",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop"
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("تم نسخ الرابط")
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">الخبر غير موجود</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على الخبر المطلوب
            </p>
            <Button onClick={() => router.push("/news")}>
              العودة إلى الأخبار
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/news")}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              الأخبار
            </Button>
            <span>/</span>
            <span>{news.title}</span>
          </div>

          {/* Article Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{news.category}</Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-2xl mb-4">{news.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {news.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {news.date}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {news.image && (
                <div className="mb-6">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: news.content.replace(/\n/g, '<br />') 
                  }} 
                  className="leading-relaxed text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>تفاعل مع الخبر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ml-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "إلغاء الإعجاب" : "إعجاب"}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 ml-2" />
                  مشاركة
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  تعليق
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back to News */}
          <div className="text-center">
            <Button variant="outline" onClick={() => router.push("/news")}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة إلى الأخبار
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
