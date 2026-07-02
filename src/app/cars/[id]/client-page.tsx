"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactActionsCard } from "@/components/contact-actions";
import {
  ListingContentLayout,
  ListingDescription,
  ListingDetailHeader,
  ListingDetailSection,
  ListingFeatureList,
  ListingSafetyTip,
  ListingSellerCard,
  ListingSpecTable,
  listingDetailMain,
  listingDetailShell,
} from "@/components/listing-detail-ui";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Car,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Fuel,
  Gauge,
  MessageSquare,
  Phone,
  Settings,
  Share2,
  X
} from "lucide-react";
import { MapEmbed } from "@/components/map-embed";
import { getAppUrl } from "@/lib/app-url";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
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
 showroom?: {
  _id?: string;
  name?: string;
  address?: string;
  logo?: string;
  locationLink?: string;
  location?: { coordinates?: [number, number] };
 };
 createdAt: string;
}

export default function ClientPage({ initialCar }: { initialCar: CarDoc }) {
 const params = useParams();
 const pathname = usePathname();
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

  const trackWhatsapp = trackCall;

 const images = car.images?.length ? car.images : ["/placeholder-car.jpg"];
 const galleryLoop = images.length > 1;
 const listingTitle = buildListingTitle(car);
 const listingPageUrl = `${getAppUrl().replace(/\/$/, "")}${pathname || ""}`;
 const whatsappHref = getWhatsAppUrl(
   `مرحباً، أريد الاستفسار عن سيارة ${listingTitle} المعروضة للبيع\nالرابط: ${listingPageUrl}`,
 );
 const mapCoordinates =
   car.showroom?.location?.coordinates && car.showroom.location.coordinates.length >= 2
     ? {
         lng: car.showroom.location.coordinates[0],
         lat: car.showroom.location.coordinates[1],
       }
     : null;

 const specRows = [
   { label: "الماركة", value: car.brand },
   { label: "الموديل", value: car.model },
   { label: "سنة الصنع", value: String(car.year) },
   { label: "اللون", value: car.color },
   { label: "تاريخ النشر", value: new Date(car.createdAt).toLocaleDateString("ar-EG") },
   ...(car.mileage !== undefined && car.mileage !== null
     ? [{ label: "المسافة", value: `${car.mileage.toLocaleString("ar-EG")} كم` }]
     : []),
   { label: "ناقل الحركة", value: car.transmission },
   { label: "نوع الوقود", value: car.fuelType },
 ];

 return (
 <div className={listingDetailShell}>
 <main className={listingDetailMain}>
  <div className="mb-4">
  <Breadcrumbs
    items={[
      { label: "سيارات للبيع", href: "/cars" },
      { label: listingTitle },
    ]}
  />
  </div>

 <ListingDetailHeader
   category="إعلان سيارات"
   title={listingTitle}
   price={car.price}
   chips={[
     { icon: <Calendar className="size-3.5" />, label: String(car.year) },
     ...(car.mileage !== undefined && car.mileage !== null
       ? [{ icon: <Gauge className="size-3.5" />, label: `${car.mileage.toLocaleString("ar-EG")} كم` }]
       : []),
     { icon: <Settings className="size-3.5" />, label: car.transmission },
     { icon: <Fuel className="size-3.5" />, label: car.fuelType },
   ]}
   status={
     <Badge
       className={cn(
         "rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold",
         getStatusColor(car.status),
       )}
     >
       {car.status}
     </Badge>
   }
   actions={
     <ShareButton
       className="size-10 rounded-lg border-slate-200 bg-white shadow-sm hover:bg-slate-50"
       title={`${car.brand} ${car.model} ${car.year}`}
       text={`شاهد سيارة ${car.brand} ${car.model} موديل ${car.year} المعروضة للبيع`}
     />
   }
 />

 {/* Image gallery */}
 <div
   className={cn(
     "mt-5 w-full min-w-0 overflow-hidden",
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
         <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm" dir="ltr">
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

 <ContactActionsCard
   className="mt-5 lg:hidden"
   phone={car.phone}
   whatsappHref={whatsappHref}
   onCall={trackCall}
   onWhatsapp={trackWhatsapp}
   subtitle={car.showroom?.name ? `تواصل مع ${car.showroom.name}` : "اتصال أو واتساب مع المعلن"}
 />

 {/* Main Content */}
 <div className="mt-6">
 <ListingContentLayout
   main={
     <>
 <ListingDetailSection title="تفاصيل السيارة">
 <ListingSpecTable rows={specRows} />
 </ListingDetailSection>

 <ListingDetailSection title="الوصف">
 <ListingDescription html={car.description} />
 </ListingDetailSection>

 {car.features && car.features.length > 0 ? (
 <ListingDetailSection title="المميزات">
 <ListingFeatureList features={car.features} />
 </ListingDetailSection>
 ) : null}

 <button
 type="button"
 className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-destructive"
 >
 <MessageSquare className="size-4" />
 الإبلاغ عن هذا الإعلان
 </button>
     </>
   }
   sidebar={
     <>
 <ListingSellerCard
   name={car.showroom?.name || "معرض المنيا للسيارات"}
   location={car.location || car.showroom?.address || "مدينة المنيا"}
   logo={car.showroom?.logo}
   fallbackIcon={<Car className="size-8 text-primary/30" />}
   showroomHref={car.showroom?._id ? `/showrooms/${car.showroom._id}` : null}
 />

 <ContactActionsCard
   className="hidden lg:block"
   phone={car.phone}
   whatsappHref={whatsappHref}
   onCall={trackCall}
   onWhatsapp={trackWhatsapp}
   subtitle={car.showroom?.name ? `تواصل مع ${car.showroom.name}` : "اتصال أو واتساب مع المعلن"}
 />

 {(car.locationLink || car.showroom?.locationLink || mapCoordinates) ? (
 <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
 <CardContent className="p-4 sm:p-5">
 <MapEmbed
   url={car.locationLink || car.showroom?.locationLink}
   coordinates={mapCoordinates}
   title="الموقع على الخريطة"
 />
 </CardContent>
 </Card>
 ) : null}

 <ListingSafetyTip>
 لا تقم بتحويل أي مبالغ مالية قبل فحص السيارة والتأكد من كافة الأوراق القانونية.
 </ListingSafetyTip>

 <Button
 variant="ghost"
 className="w-full text-sm font-medium text-primary hover:bg-primary/5"
 onClick={() => {
 if (car.showroom?._id) {
 router.push(`/showrooms/${car.showroom._id}`);
 } else {
 router.push("/cars");
 }
 }}
 >
 عرض جميع الإعلانات
 <ChevronRight className="mr-2 size-4 rotate-180" />
 </Button>
     </>
   }
 />
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
 <Button variant="outline" size="sm" className="bg-[#22C55E] border-0 text-white hover:bg-green-600 rounded-xl font-bold px-6" asChild>
 <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={trackWhatsapp}>
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

function buildListingTitle(car: CarDoc) {
 const parts = [car.brand, car.model].filter(Boolean);
 if (!car.model?.includes(String(car.year))) {
   parts.push(String(car.year));
 }
 return parts.join(" ");
}
