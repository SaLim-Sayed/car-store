"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Calendar, Tag, User, Share2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { FormattedDate } from "@/components/formatted-date"

// Custom SVG icons since lucide-react 1.14.0 doesn't include brand icons
const Facebook = ({ className }: { className?: string }) => (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={className}
 >
 <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
 </svg>
)

const Twitter = ({ className }: { className?: string }) => (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={className}
 >
 <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3.1 16 1.7 13.5 1.7 13.5c.8.1 1.6 0 2.4-.2C1.5 12.8.5 10.5.5 10.5c.7.4 1.5.6 2.3.6C.8 9.7.5 7.5.5 7.5c1.7.9 3.5 1.3 5.4 1.4C5 6.1 5 4.5 5.9 3.3c.9-1.2 2.6-1.6 4.1-1 1.5.6 2.5 2.1 2.5 3.7 0 .5-.1 1-.2 1.5 1.2-1.2 2.6-2.1 4-2.8.4-.2.9-.4 1.3-.5.4-.1.9-.1 1.3 0-.1.3-.3.6-.5.9-.2.3-.5.6-.8.8.5-.1 1-.2 1.5-.4z" />
 </svg>
)

export default function NewsDetailPage() {
 const params = useParams()
 const router = useRouter()
 const id = params.id as string
 const [news, setNews] = useState<any>(null)
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 const fetchNews = async () => {
 try {
 const res = await fetch(`/api/news`)
 const data = await res.json()
 const item = data.data?.find((n: any) => n._id === id)
 if (item) {
 setNews(item)
 } else {
 toast.error("لم يتم العثور على الخبر")
 router.push("/news")
 }
 } catch (e) {
 toast.error("فشل في تحميل الخبر")
 } finally {
 setIsLoading(false)
 }
 }
 if (id) fetchNews()
 }, [id, router])

 const copyLink = () => {
 navigator.clipboard.writeText(window.location.href)
 toast.success("تم نسخ الرابط")
 }

 if (isLoading) {
 return (
 <div className="min-h-screen bg-[#F9F6F1]">
 <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl space-y-8">
 <Skeleton className="h-12 w-64 rounded-full" />
 <Skeleton className="h-[500px] w-full rounded-[3rem]" />
 <div className="space-y-4">
 <Skeleton className="h-8 w-3/4" />
 <Skeleton className="h-8 w-full" />
 <Skeleton className="h-8 w-full" />
 </div>
 </main>
 </div>
 )
 }

 if (!news) return null

 return (
 <div className="min-h-screen bg-[#F9F6F1]">
 
 <main className="container mx-auto px-4 pt-20 pb-16">
 <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
  {/* Breadcrumbs */}
  <Breadcrumbs
    items={[
      { label: "الأخبار والمقالات", href: "/news" },
      { label: news.title },
    ]}
  />

 {/* Header */}
 <div className="space-y-5 md:space-y-8">
 <div className="flex flex-wrap items-center gap-3 md:gap-6 text-base md:text-lg font-bold text-muted-foreground">
 <Badge className="bg-primary/10 text-primary border-0 rounded-full px-4 md:px-6 py-1.5 md:py-2 font-black text-sm md:text-base uppercase tracking-wider">
 {news.category}
 </Badge>
 <div className="flex items-center gap-2">
 <Calendar className="h-4 w-4 md:h-5 md:w-5" />
 <FormattedDate value={news.date} />
 </div>
 </div>

 <h1 className="text-3xl sm:text-5xl md:text-7xl font-[1000] tracking-tighter leading-tight">
 {news.title}
 </h1>

 <p className="text-base md:text-2xl text-muted-foreground font-medium leading-relaxed border-r-4 md:border-r-8 border-primary/20 pr-4 md:pr-8">
 {news.excerpt}
 </p>
 </div>

 {/* Featured Image */}
 {news.image && (
 <div className="relative aspect-[16/9] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none border-2 md:border-8 border-white group">
 <img
 src={news.image}
 alt={news.title}
 className="w-full h-full object-cover group- transition-transform duration-[2s]"
 />
 </div>
 )}

 {/* Content */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 md:gap-16 items-start">
 {/* Main Article */}
 <div className="bg-white rounded-2xl md:rounded-[3rem] p-6 md:p-12 shadow-none space-y-8 order-2 lg:order-1">
 <div className="prose prose-base md:prose-xl max-w-none prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter">
 {news.content.split('\n').map((para: string, i: number) => (
 <p key={i} className="mb-4 md:mb-6">{para}</p>
 ))}
 </div>
 </div>

 {/* Sidebar */}
 <div className="space-y-4 md:space-y-8 lg:sticky lg:top-32 order-1 lg:order-2">
 {/* Share Card */}
 <Card className="border-0 shadow-none rounded-2xl md:rounded-[2.5rem] bg-white overflow-hidden">
 <CardHeader className="p-5 md:p-8 pb-3 md:pb-4">
 <h3 className="text-lg md:text-xl font-black">مشاركة الخبر</h3>
 </CardHeader>
 <CardContent className="p-5 md:p-8 pt-0 flex flex-row md:flex-col gap-3">
 <Button variant="outline" onClick={copyLink} className="flex-1 md:flex-none h-11 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold justify-start gap-2 md:gap-4 text-sm md:text-base">
 <LinkIcon className="h-4 w-4 md:h-5 md:w-5" />
 <span className="hidden sm:inline">نسخ الرابط</span>
 <span className="sm:hidden">نسخ</span>
 </Button>
 <Button variant="outline" className="flex-1 md:flex-none h-11 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold justify-start gap-2 md:gap-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-sm md:text-base">
 <Facebook className="h-4 w-4 md:h-5 md:w-5" />
 فيسبوك
 </Button>
 <Button variant="outline" className="flex-1 md:flex-none h-11 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold justify-start gap-2 md:gap-4 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 text-sm md:text-base">
 <Twitter className="h-4 w-4 md:h-5 md:w-5" />
 تويتر
 </Button>
 </CardContent>
 </Card>

 {/* Newsletter Card */}
 <Card className="border-0 shadow-none rounded-2xl md:rounded-[2.5rem] bg-primary text-white overflow-hidden">
 <CardContent className="p-5 md:p-8 space-y-4 md:space-y-6">
 <h3 className="text-lg md:text-2xl font-black leading-tight">اشترك في نشرتنا الإخبارية</h3>
 <p className="text-sm md:text-base font-bold opacity-80">كن أول من يعلم بجديد السيارات والعروض الحصرية</p>
 <Button className="w-full h-11 md:h-14 rounded-xl md:rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-base md:text-lg">
 اشترك الآن
 </Button>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </main>
 </div>
 )
}
