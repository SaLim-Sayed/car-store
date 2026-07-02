"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CallButton } from "@/components/call-button";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Car,
  Check,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Settings,
  Share2,
  X
} from "lucide-react";
import { MapEmbed } from "@/components/map-embed";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface CarDoc {
 _id: string;
 brand: string;
 model: string;
 year: number;
 price?: number;
 fuelType: string;
 transmission: string;
 mileage?: number;
 color: string;
 location?: string;
 phone?: string;
 description: string;
 images: string[];
 features: string[];
 status: string;
 locationLink?: string;
 showroom?: any;
 createdAt: string;
}

export default function ClientPage({ initialCar }: { initialCar: CarDoc }) {
 const params = useParams();
 const router = useRouter();
 const [car, setCar] = useState<CarDoc>(initialCar);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [selectedImage, setSelectedImage] = useState(0);
 const [isLightboxOpen, setIsLightboxOpen] = useState(false);
 const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

 const [galleryStripSwiper, setGalleryStripSwiper] = useState<any>(null);
 const [mainSwiper, setMainSwiper] = useState<any>(null);

  const trackCall = async () => {
    if (car.showroom) {
      const showroomId = typeof car.showroom === "object" ? car.showroom._id : car.showroom;
      if (showroomId) {
        fetch("/api/track/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            type: "showroom_contact", 
            targetId: showroomId,
            metadata: {
              itemName: `${car.brand} ${car.model}`,
              itemType: "car",
              itemId: car._id
            }
          }),
        }).catch(console.error);
      }
    }
  };

 useEffect(() => {
 setSelectedImage(0);
 }, [params.id]);

 

 useEffect(() => {
    if (!galleryStripSwiper || galleryStripSwiper.destroyed) return;
    const n = Math.max(0, (car?.images?.length ?? 1) - 1);
    const i = Math.min(Math.max(0, selectedImage), n);
    try {
      if (galleryStripSwiper.params.loop) {
        galleryStripSwiper.slideToLoop(i, 280);
      } else {
        galleryStripSwiper.slideTo(i, 280);
      }
    } catch {
      /* ignore */
    }
  }, [selectedImage, galleryStripSwiper, car?.images?.length]);

  useEffect(() => {
    if (mainSwiper && !mainSwiper.destroyed && mainSwiper.realIndex !== selectedImage) {
      if (mainSwiper.params.loop) {
        mainSwiper.slideToLoop(selectedImage, 280);
      } else {
        mainSwiper.slideTo(selectedImage, 280);
      }
    }
  }, [selectedImage, mainSwiper]);

 const getStatusColor = (status: string) => {
 switch (status) {
 case "متاح":
 return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
 case "مباع":
 return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
 case "محجوز":
 return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
 default:
 return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen">
 <main className="container mx-auto px-4 py-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div>
 <Skeleton className="h-96 w-full rounded-lg" />
 </div>
 <div className="space-y-4">
 <Skeleton className="h-8 w-3/4" />
 <Skeleton className="h-6 w-1/2" />
 <Skeleton className="h-20 w-full" />
 <Skeleton className="h-10 w-full" />
 </div>
 </div>
 </main>
 </div>
 );
 }

 if (error || !car) {
 return (
 <div className="min-h-screen">
 <main className="container mx-auto px-4 py-8">
 <Card className="p-8 text-center">
 <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
 <h3 className="text-lg font-semibold mb-2">السيارة غير موجودة</h3>
 <p className="text-muted-foreground mb-4">
 {error || "لم يتم العثور على السيارة المطلوبة"}
 </p>
 <Button onClick={() => router.push("/cars")}>
 العودة إلى قائمة السيارات
 </Button>
 </Card>
 </main>
 </div>
 );
 }

 const images = car.images?.length ? car.images : ["/placeholder-car.jpg"];
 const galleryLoop = images.length > 1;
 const listingTitle = `${car.brand} ${car.model} ${car.year}`;

 return (
 <div className="min-h-screen bg-[#F9F6F1] pb-20">
 <main className="container mx-auto px-4 pt-10 pb-24">
  {/* Breadcrumbs */}
  <Breadcrumbs
    items={[
      { label: "سيارات للبيع", href: "/cars" },
      { label: `${car.brand} ${car.model}` },
    ]}
  />

 {/* Top Header: Title and Price */}
 <header className="mb-10 flex flex-col gap-6 lg:gap-8">
   <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
     <div className="min-w-0 flex-1 space-y-4 lg:space-y-5">
       <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/95">
         إعلان سيارات
       </p>
       <h1 className="text-pretty font-serif text-3xl md:text-5xl font-black leading-snug tracking-tight text-[#1A1A1A]">
         {car.brand} {car.model} {car.year}
         <span className="mr-2 block text-xl font-semibold leading-normal text-muted-foreground sm:mr-0 sm:mt-1 sm:inline sm:text-2xl lg:text-[1.35rem]">
           للبيع
         </span>
       </h1>
       <div className="flex flex-wrap gap-2">
         <Badge
           variant="secondary"
           className="bg-white border-0 shadow-none px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
         >
           <Calendar className="h-3.5 w-3.5 text-primary" />
           {car.year}
         </Badge>
          {car.mileage !== undefined && car.mileage !== null && (
            <Badge
              variant="secondary"
              className="bg-white border-0 shadow-none px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
            >
              <Gauge className="h-3.5 w-3.5 text-primary" />
              {`${car.mileage.toLocaleString()} كم`}
            </Badge>
          )}
         <Badge
           variant="secondary"
           className="bg-white border-0 shadow-none px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
         >
           <Settings className="h-3.5 w-3.5 text-primary" />
           {car.transmission}
         </Badge>
         <Badge
           variant="secondary"
           className="bg-white border-0 shadow-none px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
         >
           <Fuel className="h-3.5 w-3.5 text-primary" />
           {car.fuelType}
         </Badge>
       </div>

       <div className="mt-4 flex items-baseline gap-2 tabular-nums pt-2">
         <span className="text-xl font-bold text-slate-500 ml-2">السعر</span>
         <span className="font-serif text-4xl font-black text-primary tracking-tighter md:text-5xl">
           {car.price ? car.price.toLocaleString("ar-EG") : "حسب الطلب"}
         </span>
         {car.price && (
           <span className="text-2xl font-black text-muted-foreground">
             جنيه
           </span>
         )}
       </div>
     </div>

     <div className="flex items-center gap-2 lg:flex-col shrink-0">
       <ShareButton
         className="size-11 rounded-xl border-neutral-200/90 bg-white shadow-none hover:bg-gray-50"
         title={`${car.brand} ${car.model} ${car.year}`}
         text={`شاهد سيارة ${car.brand} ${car.model} موديل ${car.year} المعروضة للبيع`}
       />
     </div>
   </div>
 </header>

 {/* Image gallery */}
 <div
   className={cn(
     "mb-10 w-full min-w-0 overflow-hidden",
     images.length > 1
       ? "grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_7rem] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_8.5rem] xl:gap-6"
       : "block",
   )}
 >
   <div className="group/main-slider relative isolate min-w-0 overflow-hidden rounded-[1.25rem] border border-neutral-200/70 bg-white shadow-[0_8px_30px_-12px_rgb(15_23_42/0.12)] ring-1 ring-black/[0.04] sm:rounded-[1.5rem] lg:rounded-[1.625rem]">
     <Swiper
       dir="rtl"
       loop={galleryLoop}
       loopAdditionalSlides={images.length}
       onSwiper={setMainSwiper}
       onSlideChange={(swiper) => setSelectedImage(swiper.realIndex)}
       className="h-full w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[1.625rem]"
       modules={[Navigation]}
       navigation={{
         prevEl: ".car-main-slider-prev",
         nextEl: ".car-main-slider-next",
       }}
       grabCursor
     >
       {images.map((img, idx) => (
         <SwiperSlide key={idx} className="h-full w-full">
           <div
             className="group relative flex aspect-[16/10] max-h-[min(58vh,500px)] w-full min-h-[230px] cursor-zoom-in items-center justify-center bg-[#f8f9fb] p-3 sm:min-h-[280px] sm:p-5 md:p-6"
             onClick={() => setIsLightboxOpen(true)}
           >
             <Image
               src={img}
               alt={`${listingTitle} - ${idx + 1}`}
               fill
               priority={idx === 0}
               sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 70vw, 1100px"
               className="object-contain p-1 transition duration-500 ease-out"
             />
             <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.05]" />
             <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
             <span className="pointer-events-none absolute bottom-3 inset-x-0 text-center text-[11px] font-bold text-white/95">
               اضغط للتكبير
             </span>
           </div>
         </SwiperSlide>
       ))}
     </Swiper>

     <Badge
       className={cn(
         "pointer-events-none absolute top-4 right-4 z-20 rounded-full border-0 px-4 py-1.5 text-xs font-black shadow-md backdrop-blur-sm",
         getStatusColor(car.status),
       )}
     >
       {car.status}
     </Badge>

     {images.length > 1 && (
       <>
         <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
           {selectedImage + 1} / {images.length}
         </div>
         <button
           type="button"
           className="car-main-slider-next absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg ring-1 ring-black/5 transition hover:bg-white sm:right-4"
           onClick={(e) => e.stopPropagation()}
           aria-label="الصورة السابقة"
         >
           <ChevronRightIcon className="size-5" />
         </button>
         <button
           type="button"
           className="car-main-slider-prev absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg ring-1 ring-black/5 transition hover:bg-white sm:left-4"
           onClick={(e) => e.stopPropagation()}
           aria-label="الصورة التالية"
         >
           <ChevronLeftIcon className="size-5" />
         </button>
       </>
     )}
   </div>

   {images.length > 1 ? (
     <aside className="min-w-0 w-full lg:sticky lg:top-28 xl:top-32">
       <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5 text-[11px] font-bold text-slate-500 sm:text-xs">
         <span>معرض الصور</span>
         <span className="tabular-nums">{images.length} صورة</span>
       </div>

       <div className="relative rounded-[1.1rem] border border-neutral-200/80 bg-white p-2 shadow-sm ring-1 ring-black/[0.03]">
         <button
           type="button"
           className="car-thumb-prev absolute right-1 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-black/5 transition hover:bg-slate-50 lg:right-1/2 lg:top-1 lg:translate-x-1/2 lg:translate-y-0"
           aria-label="الصورة السابقة في المعرض"
         >
           <ChevronRightIcon className="size-4 lg:rotate-90" />
         </button>
         <button
           type="button"
           className="car-thumb-next absolute left-1 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-black/5 transition hover:bg-slate-50 lg:bottom-1 lg:left-1/2 lg:top-auto lg:-translate-x-1/2 lg:translate-y-0"
           aria-label="الصورة التالية في المعرض"
         >
           <ChevronLeftIcon className="size-4 lg:rotate-90" />
         </button>

         <Swiper
           modules={[Navigation]}
           dir="rtl"
           loop={galleryLoop}
           loopAdditionalSlides={images.length}
           slidesPerView="auto"
           spaceBetween={10}
           watchSlidesProgress
           breakpoints={{
             0: { direction: "horizontal", spaceBetween: 10 },
             1024: { direction: "vertical", spaceBetween: 12 },
           }}
           navigation={{
             prevEl: ".car-thumb-prev",
             nextEl: ".car-thumb-next",
           }}
           onSwiper={setGalleryStripSwiper}
           className="w-full px-9 [--swiper-scrollbar-size:0] lg:h-[min(58vh,500px)] lg:px-2 lg:py-9"
         >
           {images.map((image, index) => (
             <SwiperSlide
               key={`${image}-${index}`}
               className="!box-border shrink-0 !h-[4.5rem] !w-[4.5rem] sm:!h-[5rem] sm:!w-[5rem] lg:!h-[5.75rem] lg:!w-full"
             >
               <button
                 type="button"
                 aria-label={`صورة رقم ${index + 1}`}
                 {...(selectedImage === index ? { "aria-current": "true" as const } : {})}
                 onClick={() => setSelectedImage(index)}
                 className={cn(
                   "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-2 bg-[#f8f9fb] p-1.5 transition-all outline-none",
                   selectedImage === index
                     ? "border-primary ring-2 ring-primary/25 shadow-md"
                     : "border-slate-200/80 opacity-85 hover:border-slate-300 hover:opacity-100",
                 )}
               >
                 <Image
                   src={image}
                   alt={`${listingTitle} — معاينة ${index + 1}`}
                   fill
                   sizes="96px"
                   className="object-contain"
                 />
               </button>
             </SwiperSlide>
           ))}
         </Swiper>
       </div>
     </aside>
   ) : null}
 </div>

 {/* Main Content: 2 Columns */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
 {/* Details Column */}
 <div className="lg:col-span-8 space-y-12">
 {/* Details Table */}
 <section className="space-y-6">
 <h2 className="text-3xl font-black flex items-center gap-3">
 <div className="w-2 h-8 bg-primary rounded-full" />
 تفاصيل السيارة
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="bg-white rounded-2xl shadow-none overflow-hidden border border-gray-100">
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 الماركة
 </div>
 <div className="p-4 font-black">{car.brand}</div>
 </div>
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 الموديل
 </div>
 <div className="p-4 font-black">{car.model}</div>
 </div>
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 سنة الصنع
 </div>
 <div className="p-4 font-black">{car.year}</div>
 </div>
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 اللون
 </div>
 <div className="p-4 font-black">{car.color}</div>
 </div>
 </div>
 <div className="bg-white rounded-2xl shadow-none overflow-hidden border border-gray-100">
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 تاريخ النشر
 </div>
 <div className="p-4 font-black">
 {new Date(car.createdAt).toLocaleDateString("ar-EG")}
 </div>
 </div>
  {car.mileage !== undefined && car.mileage !== null && (
    <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
      <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
        المسافة
      </div>
      <div className="p-4 font-black">
        {`${car.mileage.toLocaleString()} كم`}
      </div>
    </div>
  )}
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 ناقل الحركة
 </div>
 <div className="p-4 font-black">{car.transmission}</div>
 </div>
 <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
 <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
 نوع الوقود
 </div>
 <div className="p-4 font-black">{car.fuelType}</div>
 </div>
 </div>
 </div>
 </section>

 {/* Description */}
 <section className="space-y-6">
 <h2 className="text-3xl font-black flex items-center gap-3">
 <div className="w-2 h-8 bg-primary rounded-full" />
 الوصف
 </h2>
 <div className="bg-white p-8 rounded-3xl shadow-none border border-gray-100">
 <div
 className="text-muted-foreground text-lg leading-relaxed font-medium rich-text-content"
 dangerouslySetInnerHTML={{ __html: car.description }}
 />
 </div>
 </section>

 {/* Features (Checklist) */}
 {car.features && car.features.length > 0 && (
 <section className="space-y-6">
 <h2 className="text-3xl font-black flex items-center gap-3">
 <div className="w-2 h-8 bg-primary rounded-full" />
 المميزات
 </h2>
 <div className="bg-white p-8 rounded-3xl shadow-none border border-gray-100">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
 {car.features.map((feature, i) => (
 <div
 key={i}
 className="flex items-center gap-3 text-lg font-bold"
 >
 <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Check className="h-4 w-4 text-primary stroke-[4]" />
 </div>
 {feature}
 </div>
 ))}
 </div>
 </div>
 </section>
 )}

 <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors font-bold mt-12">
 <MessageSquare className="h-5 w-5" />
 الإبلاغ عن هذا الإعلان
 </button>
 </div>

 {/* Sticky Sidebar Column */}
 <div className="lg:col-span-4">
 <div className="sticky top-40 space-y-6">
 <Card className="border-0 shadow-none rounded-3xl overflow-hidden bg-white">
 <CardContent className="p-8 space-y-8">
 <div className="text-center space-y-4">
 <p className="text-sm font-black text-muted-foreground">
 تواصل مع المعلن
 </p>
 <div className="flex flex-col items-center gap-4">
 <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center border-4 border-gray-100 shadow-none">
 <Car className="h-12 w-12 text-primary opacity-20" />
 </div>
 <div className="space-y-1">
 <h3 className="text-2xl font-black">
 {car.showroom?.name || "معرض المنيا للسيارات"}
 </h3>
 <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-bold text-sm">
 <MapPin className="h-4 w-4 text-primary" />
 {car.location || car.showroom?.address || "مدينة المنيا. ميدان الحميات"}
 </div>
 {car.showroom && (
 <Button 
   variant="link" 
   className="mt-2 text-primary font-bold w-full"
   onClick={() => router.push(`/showrooms/${car.showroom?._id}`)}
 >
   عرض تفاصيل المعرض
 </Button>
 )}
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <CallButton
 phone={car.phone}
 label="اتصال"
 onClick={trackCall}
 className="w-full h-16 rounded-2xl text-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-none shadow-blue-200"
 />
 <Button
 variant="outline"
 size="2xl"
 className="w-full h-16 rounded-2xl text-xl font-black border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/5 shadow-none shadow-green-50"
 >
 <MessageSquare className="h-6 w-6 ml-3" />
 واتساب
 </Button>
 <Button
 variant="ghost"
 className="w-full text-primary font-black hover:bg-primary/5"
 onClick={() => {
 if (car.showroom?._id) {
 router.push(`/showrooms/${car.showroom._id}`);
 } else {
 router.push('/cars');
 }
 }}
 >
 عرض جميع الإعلانات
 <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
 </Button>
 </div>
 </CardContent>
 </Card>

 <Card className="border-0 shadow-none rounded-3xl overflow-hidden bg-white">
 <CardContent className="p-6">
 <MapEmbed
   url={car.locationLink || car.showroom?.locationLink}
   title="الموقع على الخريطة"
 />
 </CardContent>
 </Card>

 {/* Safety Tips or Similar Ads could go here */}
 <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-3">
 <p className="font-black text-amber-900 text-sm">نصيحة أمان</p>
 <p className="text-amber-800 text-xs font-bold leading-relaxed">
 لا تقم بتحويل أي مبالغ مالية قبل فحص السيارة والتأكد من كافة
 الأوراق القانونية.
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
 <h2 className="text-white text-xl md:text-2xl font-black">{car.brand} {car.model} {car.year}</h2>
 <div className="flex items-center gap-4">
 <p className="text-primary text-2xl font-black">{car.price ? `السعر: ${car.price.toLocaleString()} ج.م` : "السعر حسب الطلب"}</p>
 <div className="hidden md:flex gap-2">
 <Badge variant="outline" className="border-white/20 text-white/60">{car.transmission}</Badge>
 <Badge variant="outline" className="border-white/20 text-white/60">{car.fuelType}</Badge>
 </div>
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="hidden md:flex gap-3 mr-8">
 <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-bold px-6" onClick={trackCall} asChild>
 <a href={`tel:${car.phone}`}>
 <Phone className="h-4 w-4 ml-2" />
 اتصال
 </a>
 </Button>
 <Button variant="outline" size="sm" className="bg-[#22C55E] border-0 text-white hover:bg-green-600 rounded-xl font-bold px-6">
 <MessageSquare className="h-4 w-4 ml-2" />
 واتساب
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
 loop={galleryLoop}
 loopAdditionalSlides={images.length}
 spaceBetween={20}
 navigation={{
 prevEl: '.swiper-button-prev-custom',
 nextEl: '.swiper-button-next-custom',
 }}
 thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
 modules={[Navigation, Thumbs]}
 className="w-full h-full max-w-5xl flex items-center"
 initialSlide={selectedImage}
 onSlideChange={(swiper) => setSelectedImage(swiper.realIndex)}
 >
 {car.images.map((image, index) => (
 <SwiperSlide key={index} className="flex items-center justify-center">
 <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
 <img
 src={image}
 alt={`${car.brand} ${car.model}`}
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
 {car.images.map((image, index) => (
 <SwiperSlide key={index} className="!w-20 !h-14 md:!w-[6.75rem] md:!h-[4.125rem] cursor-pointer opacity-40 hover:opacity-100 transition-opacity swiper-slide-thumb-active:opacity-100 swiper-slide-thumb- swiper-slide-thumb-active:ring-2 swiper-slide-thumb-active:ring-[#FBBF24] rounded-lg overflow-hidden border-2 border-transparent">
 <img
 src={image}
 alt="thumbnail"
 className="w-full h-full object-contain bg-[#f8f9fb] p-0.5"
 />
 </SwiperSlide>
 ))}
 </Swiper>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 );
}
