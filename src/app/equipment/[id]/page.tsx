"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
 MapPin,
 Tractor,
 Gauge,
 Share2,
 Heart,
 MessageSquare,
 Check,
 ChevronRight,
 X,
 ChevronLeft as ChevronLeftIcon,
 ChevronRight as ChevronRightIcon,
} from "lucide-react"
import { CallButton } from "@/components/call-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Link from "next/link"
import { toast } from "sonner"
import { getAppUrl } from "@/lib/app-url"
import { getWhatsAppUrl } from "@/lib/whatsapp"
import type { Equipment } from "@/hooks/useEquipment"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, FreeMode } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/free-mode"

const pageShell =
 "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16"

export default function EquipmentDetailPage() {
 const params = useParams()
 const pathname = usePathname()
 const router = useRouter()
 const [item, setItem] = useState<Equipment | null>(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)
 const [selectedImage, setSelectedImage] = useState(0)
 const [isLightboxOpen, setIsLightboxOpen] = useState(false)
 const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
 const [galleryStripSwiper, setGalleryStripSwiper] = useState<any>(null)

 useEffect(() => {
 setSelectedImage(0)
 }, [params.id])

 useEffect(() => {
 const fetchItem = async () => {
 setLoading(true)
 setError(null)
 try {
 const res = await fetch(`/api/equipment/${params.id}`)
 const data = await res.json()
 if (data.success) {
 setItem(data.data)
 } else {
 setError(data.error || "المعدة غير موجودة")
 }
 } catch {
 setError("حدث خطأ في الاتصال")
 } finally {
 setLoading(false)
 }
 }
 if (params.id) fetchItem()
 }, [params.id])

 useEffect(() => {
 if (!galleryStripSwiper || galleryStripSwiper.destroyed) return
 const i = Math.min(
 Math.max(0, selectedImage),
 Math.max(0, (item?.images?.length || 1) - 1)
 )
 try {
 galleryStripSwiper.slideTo(i, 280)
 } catch {
 /* ignore */
 }
 }, [selectedImage, galleryStripSwiper, item?.images?.length])

 if (loading) {
 return (
 <div className="min-h-screen bg-background">
 <main className={`${pageShell} py-24`}>
 <Skeleton className="h-64 w-full max-w-4xl mx-auto rounded-2xl mb-8" />
 <Skeleton className="h-12 w-2/3 mb-4" />
 <Skeleton className="h-32 w-full" />
 </main>
 </div>
 )
 }

 if (error || !item) {
 return (
 <div className="min-h-screen bg-background">
 <main className={`${pageShell} py-24 text-center space-y-6`}>
 <p className="text-xl font-bold text-destructive">{error || "المعدة غير موجودة"}</p>
 <Button onClick={() => router.push("/equipment")} className="font-black">
 العودة للقائمة
 </Button>
 </main>
 </div>
 )
 }

 const images = item.images?.length ? item.images : ["/placeholder-car.jpg"]
 const label = item.title || `${item.brand} ${item.model || ""}`.trim()

 const listingPageUrl = `${getAppUrl().replace(/\/$/, "")}${pathname || ""}`
 const whatsappHref = getWhatsAppUrl(
 `مرحباً، أريد الاستفسار عن هذا الإعلان:\n${label}\nالرابط: ${listingPageUrl}`
 )

 const handleShare = async () => {
 if (typeof navigator !== "undefined" && navigator.share) {
 try {
 await navigator.share({
 title: `${label} — معرض سيارات المنيا`,
 text: label,
 url: listingPageUrl,
 })
 return
 } catch (e) {
 if ((e as Error).name === "AbortError") return
 }
 }
 try {
 await navigator.clipboard.writeText(listingPageUrl)
 toast.success("تم نسخ الرابط")
 } catch {
 toast.error("تعذر نسخ الرابط — انسخه يدوياً من المتصفح")
 }
 }

 return (
 <div className="min-h-screen bg-gradient-to-b from-[#faf8f4] via-[#F9F6F1] to-[#f4f1eb] pb-24">
 <main className={`${pageShell} pt-8 pb-24 lg:pt-11`}>
 <article className="mb-12 rounded-[1.75rem] border border-neutral-200/70 bg-card px-6 py-8 shadow-[0_4px_24px_-8px_rgb(26_26_26/0.12)] ring-1 ring-black/[0.03] sm:px-9 sm:py-10 lg:mb-14 lg:rounded-[2rem] lg:px-11 lg:py-11">
  <Breadcrumbs
    items={[
      { label: "آلات ومعدات", href: "/equipment" },
      { label: label },
    ]}
  />

 <header className="mb-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between xl:gap-12">
 <div className="min-w-0 flex-1 space-y-5">
 <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/95">
 إعلان معدات
 </p>
 <h1 className="text-pretty font-serif text-2xl font-bold leading-snug tracking-tight text-[#141414] sm:text-4xl lg:text-[2.25rem]">
 {label}
 <span className="mr-2 block text-xl font-semibold leading-normal text-muted-foreground sm:mr-0 sm:mt-1 sm:inline sm:text-2xl lg:text-[1.35rem]">
 للبيع
 </span>
 </h1>
 <div className="flex flex-wrap gap-2">
 <Badge
 variant="secondary"
 className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-semibold shadow-none"
 >
 <Tractor className="size-3.5 text-primary" />
 {item.category}
 </Badge>
 <Badge
 variant="secondary"
 className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-semibold shadow-none"
 >
 <Gauge className="size-3.5 text-primary" />
 {item.hours.toLocaleString("ar-EG")} ساعة
 </Badge>
 <Badge
 variant="secondary"
 className="flex max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-semibold shadow-none"
 >
 <MapPin className="size-3.5 shrink-0 text-primary" />
 <span className="truncate">{item.location}</span>
 </Badge>
 <Badge
 variant="outline"
 className="rounded-full border-primary/35 bg-primary/[0.07] px-3 py-1 text-xs font-semibold text-primary shadow-none"
 >
 {item.status}
 </Badge>
 </div>
 </div>

 <div className="flex w-full shrink-0 flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-5 sm:max-w-md sm:self-end xl:w-[min(100%,19rem)] xl:self-stretch">
 <div className="flex items-center justify-center gap-2 sm:justify-end xl:order-2">
 <Button
 type="button"
 variant="outline"
 size="icon"
 aria-label="مشاركة الإعلان"
 onClick={() => void handleShare()}
 className="size-10 rounded-xl border-neutral-200/90 bg-background shadow-none hover:bg-muted"
 >
 <Share2 className="size-4" />
 </Button>
 <Button
 type="button"
 variant="outline"
 size="icon"
 aria-label="المفضلة"
 className="size-10 rounded-xl border-neutral-200/90 bg-background shadow-none hover:bg-muted"
 >
 <Heart className="size-4" />
 </Button>
 </div>
 <div className="text-center xl:order-1 xl:text-end">
 <p className="text-[11px] font-semibold text-muted-foreground">
 السعر المعروض
 </p>
 <div className="mt-1 flex items-baseline justify-center gap-2 tabular-nums xl:justify-end">
 <span className="font-serif text-3xl font-bold text-primary tabular-nums tracking-tight sm:text-4xl">
 {item.price.toLocaleString("ar-EG")}
 </span>
 <span className="text-sm font-semibold text-muted-foreground">
 جنيه
 </span>
 </div>
 </div>
 </div>
 </header>

 {/* Image gallery */}
 <div
 className={
 images.length > 1
 ? "grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_7.75rem] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_8.5rem]"
 : "block"
 }
 >
 <div className="min-w-0">
 <button
 type="button"
 onClick={() => setIsLightboxOpen(true)}
 className="group relative isolate block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-neutral-200/65 bg-muted/35 text-start shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] outline-none ring-primary/35 transition-[box-shadow,transform] hover:shadow-none focus-visible:ring-2 lg:rounded-[1.625rem]"
 >
 <div className="relative aspect-[16/10] max-h-[min(52vh,440px)] w-full min-h-[200px] bg-neutral-100 sm:min-h-[240px]">
 <Image
 src={images[selectedImage]}
 alt={label}
 fill
 priority
 sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 68vw, 1150px"
 className="object-cover transition duration-[650ms] ease-out group-hover:scale-[1.025]"
 />
 <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.05]" />
 <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
 <span className="pointer-events-none absolute bottom-3 inset-x-0 text-center text-[11px] font-medium text-white/85">
 اضغط للتكبير
 </span>
 </div>
 </button>
 </div>

 {images.length > 1 ? (
 <aside className="min-w-0 w-full lg:sticky lg:top-[7.75rem] xl:top-[8rem] [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
 <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] font-semibold text-muted-foreground sm:text-xs lg:flex-col lg:items-stretch lg:justify-start">
 <span>معرض الصور</span>
 <span className="tabular-nums opacity-85">
 {images.length.toLocaleString("ar-EG")} صورة
 </span>
 </div>
 <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/90 p-2 shadow-none ring-1 ring-black/[0.02]">
 <Swiper
 modules={[FreeMode]}
 dir="rtl"
 freeMode
 slidesPerView="auto"
 spaceBetween={9}
 breakpoints={{
 1024: {
 direction: "vertical",
 },
 }}
 onSwiper={setGalleryStripSwiper}
 wrapperClass="swiper-thumb-strip-wrapper"
 className="swiper-thumb-strip w-full [--swiper-scrollbar-size:0] lg:h-[380px]"
 >
 {images.map((image, index) => (
 <SwiperSlide
 key={`${image}-${index}`}
 className="!box-border shrink-0 !h-[4.5rem] !w-[4.5rem] sm:!h-[4.875rem] sm:!w-[4.875rem] lg:!h-[5.125rem] lg:!w-[5.125rem]"
 >
 <button
 type="button"
 aria-label={`صورة رقم ${index + 1}`}
 {...(selectedImage === index
 ? { "aria-current": "true" as const }
 : {})}
 onClick={() => {
 setSelectedImage(index)
 setIsLightboxOpen(true)
 }}
 className={`relative h-full w-full overflow-hidden rounded-[0.65rem] border transition-[box-shadow,border-color] outline-none cursor-zoom-in ${
 selectedImage === index
 ? "border-primary shadow-none shadow-primary/10 ring-[3px] ring-primary/20"
 : "border-transparent bg-background/95 shadow-none hover:border-neutral-300/90 hover:shadow"
 }`}
 >
 <Image
 src={image}
 alt={`${label} — معاينة ${index + 1}`}
 fill
 sizes="92px"
 className="object-cover"
 />
 </button>
 </SwiperSlide>
 ))}
 </Swiper>
 </div>
 </aside>
 ) : null}
 </div>
 </article>

 {/* Below-the-fold */}
 <div className="grid grid-cols-1 gap-11 lg:grid-cols-[minmax(0,1fr)_minmax(276px,22rem)] lg:gap-14 xl:gap-16">
 {/* Details */}
 <div className="min-w-0 space-y-14">

 {/* Specs */}
 <section aria-labelledby="equipment-spec-heading" className="space-y-5">
 <h2 id="equipment-spec-heading" className="text-lg font-semibold tracking-tight text-foreground lg:text-xl">
 تفاصيل المعدة
 </h2>
 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
 <dl className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05)] divide-y divide-border/60">
 {[
 { k: "الماركة", v: item.brand },
 { k: "الموديل", v: item.model || "—" },
 { k: "الحالة", v: item.condition },
 ].map((row) => (
 <div key={row.k} className="grid grid-cols-[minmax(6.5rem,34%)_1fr] gap-2 px-4 py-3.5 sm:px-5">
 <dt className="text-sm font-medium text-muted-foreground">{row.k}</dt>
 <dd className="text-sm font-semibold text-foreground">{row.v}</dd>
 </div>
 ))}
 </dl>
 <dl className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05)] divide-y divide-border/60">
 {[
 { k: "سنة الصنع", v: item.year ?? "—" },
 { k: "ساعات العمل", v: `${item.hours.toLocaleString("ar-EG")} ساعة` },
 { k: "الموقع", v: item.location },
 ].map((row) => (
 <div key={row.k} className="grid grid-cols-[minmax(6.5rem,34%)_1fr] gap-2 px-4 py-3.5 sm:px-5">
 <dt className="text-sm font-medium text-muted-foreground">{row.k}</dt>
 <dd className="text-sm font-semibold text-foreground">{row.v}</dd>
 </div>
 ))}
 </dl>
 </div>
 </section>

 {/* Description */}
 <section aria-labelledby="equipment-desc-heading" className="space-y-5">
 <h2 id="equipment-desc-heading" className="text-lg font-semibold tracking-tight text-foreground lg:text-xl">
 الوصف التفصيلي
 </h2>
 <div className="rounded-2xl border border-border/65 bg-card p-7 shadow-[0_2px_12px_-4px_rgb(26_26_26/0.08)] lg:p-8">
 <p className="text-[15px] leading-[1.8] text-muted-foreground lg:text-[1rem] whitespace-pre-wrap">
 {item.description}
 </p>
 </div>
 </section>

 {/* Features */}
 {item.features && item.features.length > 0 && (
 <section aria-labelledby="equipment-features-heading" className="space-y-5">
 <h2 id="equipment-features-heading" className="text-lg font-semibold tracking-tight text-foreground lg:text-xl">
 المميزات الإضافية
 </h2>
 <div className="rounded-2xl border border-border/65 bg-card p-7 shadow-[0_2px_12px_-4px_rgb(26_26_26/0.08)] lg:p-8">
 <ul className="grid grid-cols-1 gap-y-3 gap-x-8 sm:grid-cols-2 md:grid-cols-3">
 {item.features.map((feature, i) => (
 <li key={i} className="flex gap-3 text-sm font-semibold text-foreground">
 <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
 <Check className="size-3.5 stroke-3" />
 </span>
 <span>{feature}</span>
 </li>
 ))}
 </ul>
 </div>
 </section>
 )}

 <button
 type="button"
 className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 rounded-md"
 >
 <MessageSquare className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
 الإبلاغ عن هذا الإعلان
 </button>
 </div>

 {/* Contact sidebar */}
 <div className="min-w-0">
 <div className="sticky top-[7.65rem] space-y-5">
 <Card className="overflow-hidden rounded-2xl border border-border/65 bg-card shadow-[0_12px_40px_-24px_rgb(26_26_26/0.18)] ring-1 ring-black/[0.04]">
 <CardContent className="space-y-7 p-7 sm:p-8">
 <div className="text-center space-y-4">
 <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
 جهة الإعلان
 </p>
 <div className="flex flex-col items-center gap-3">
 <div className="flex size-[4.5rem] items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-b from-muted/80 to-muted/40 shadow-none ring-4 ring-neutral-50">
 <Tractor className="size-11 text-primary/35" />
 </div>
 <div className="space-y-1">
 <h3 className="font-serif text-xl font-bold text-[#171717]">
 المنيا للمعدات الثقيلة
 </h3>
 <div className="flex flex-wrap justify-center gap-1 text-sm font-medium text-muted-foreground">
 <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
 محافظة المنيا
 </div>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-3 pt-1">
 <CallButton
 phone={item.phone}
 label="اتصال"
 className="h-14 w-full min-h-14 shrink-0 rounded-xl border-0 bg-[#1d4ed8] text-base font-bold text-white shadow-none shadow-blue-950/15 hover:bg-[#1e40af]"
 />
 <Button
 variant="outline"
 size="xl"
 className="h-14 min-h-14 w-full rounded-xl border-2 border-[#15803d] bg-background text-[15px] font-bold text-[#15803d] hover:bg-[#15803d]/[0.06] shadow-none"
 asChild
 >
 <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
 <MessageSquare className="size-5 ml-2" aria-hidden />
 واتساب
 </a>
 </Button>
 </div>
 </CardContent>
 </Card>

 <div className="rounded-xl border border-amber-200/65 bg-gradient-to-br from-amber-50 via-amber-50/95 to-orange-50/30 p-5">
 <p className="text-xs font-semibold uppercase tracking-wide text-amber-950">
 نصيحة فنية
 </p>
 <p className="mt-2 text-[13px] font-medium leading-relaxed text-amber-900/95">
 ننصح بفحص المحرك والهيدروليك مع فني قبل إتمام الشراء.
 </p>
 </div>
 </div>
 </div>
 </div>
 </main>

 {/* Fullscreen Swiper Lightbox */}
 <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
 <DialogContent
 showCloseButton={false}
 className="inset-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex flex-col gap-0 p-0 outline-none duration-0 sm:max-w-none rounded-none border-0 bg-black/95 overflow-hidden data-[slot=dialog-content]:max-w-none"
 >
 {/* Lightbox Header */}
 <div className="absolute top-0 inset-x-0 p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
 <div className="flex flex-col gap-1">
 <h2 className="text-white text-xl md:text-2xl font-black">{label}</h2>
 <div className="flex items-center gap-4">
 <p className="text-primary text-2xl font-black">{item.price.toLocaleString()} ج.م</p>
 <Badge variant="outline" className="border-white/20 text-white/60">{item.category}</Badge>
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="hidden md:flex gap-3 mr-8">
 <CallButton
 phone={item.phone}
 label="اتصال"
 showNumber={false}
 size="sm"
 variant="outline"
 className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-bold px-6"
 />
 <Button
 variant="outline"
 size="sm"
 className="bg-[#22C55E] border-0 text-white hover:bg-green-600 rounded-xl font-bold px-6"
 asChild
 >
 <a
 href={whatsappHref}
 target="_blank"
 rel="noopener noreferrer"
 >
 <MessageSquare className="h-4 w-4 ml-2" />
 واتساب
 </a>
 </Button>
 </div>
 <Button 
 variant="ghost" 
 size="icon" 
 onClick={() => setIsLightboxOpen(false)}
 className="text-white hover:bg-white/10 rounded-full h-12 w-12"
 >
 <X className="h-8 w-8" />
 </Button>
 </div>
 </div>

 {/* Main Swiper */}
 <div className="w-full flex-1 flex items-center justify-center relative px-4 md:px-20 overflow-hidden">
 <Swiper
 dir="rtl"
 spaceBetween={20}
 navigation={{
 prevEl: '.swiper-button-prev-custom',
 nextEl: '.swiper-button-next-custom',
 }}
 thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
 modules={[Navigation, Thumbs]}
 className="w-full h-full max-w-5xl flex items-center"
 initialSlide={selectedImage}
 onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
 >
 {images.map((image, index) => (
 <SwiperSlide key={index} className="flex items-center justify-center">
 <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
 <img
 src={image}
 alt={label}
 className="max-w-full max-h-full object-contain shadow-none rounded-lg"
 />
 </div>
 </SwiperSlide>
 ))}
 </Swiper>
 
 {/* Custom Navigation */}
 <button className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 text-white hover:text-primary transition-colors disabled:opacity-20">
 <ChevronRightIcon className="h-12 w-12" />
 </button>
 <button className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 text-white hover:text-primary transition-colors disabled:opacity-20">
 <ChevronLeftIcon className="h-12 w-12" />
 </button>
 </div>

 {/* Thumbnail Strip */}
 <div className="w-full bg-black/40 backdrop-blur-md py-4 px-3 border-t border-white/5">
 <Swiper
 dir="rtl"
 onSwiper={setThumbsSwiper}
 spaceBetween={12}
 slidesPerView="auto"
 freeMode={true}
 watchSlidesProgress={true}
 modules={[FreeMode, Thumbs]}
 className="max-w-5xl mx-auto thumbs-swiper"
 >
 {images.map((image, index) => (
 <SwiperSlide key={index} className="!w-20 !h-14 md:!w-[6.75rem] md:!h-[4.125rem] cursor-pointer opacity-40 hover:opacity-100 transition-opacity swiper-slide-thumb-active:opacity-100 swiper-slide-thumb- swiper-slide-thumb-active:ring-2 swiper-slide-thumb-active:ring-primary rounded-lg overflow-hidden border-2 border-transparent">
 <img
 src={image}
 alt="thumbnail"
 className="w-full h-full object-cover"
 />
 </SwiperSlide>
 ))}
 </Swiper>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 )
}
