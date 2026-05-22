"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTelHref, getContactPhone } from "@/lib/phone";
import { useState, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import type { Equipment } from "@/hooks/useEquipment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-500 text-white";
      case "مباع":
        return "bg-red-500 text-white";
      case "محجوز":
        return "bg-amber-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const images = equipment.images?.length ? equipment.images : ["/placeholder-car.jpg"];
  const label =
    equipment.title || `${equipment.brand} ${equipment.model || ""}`.trim();

  const whatsappMessage = `مرحباً، أريد الاستفسار عن معدة ${label} المعروضة للبيع${equipment.price ? ` بسعر ${equipment.price.toLocaleString()} جنيه` : ""}`;
  const whatsappUrl = `https://wa.me/${getContactPhone(equipment.phone)}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card
      onClick={() => router.push(`/equipment/${equipment._id}`)}
      className="group flex flex-col h-full min-h-0 overflow-hidden border border-slate-200/80 rounded-xl sm:rounded-2xl bg-white p-0  hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
    >
      <CardHeader className="shrink-0 p-0 relative">
        <div 
          className="relative aspect-[4/3] w-full overflow-hidden group/slider"
          onClick={(e) => {
            // Prevent navigating if the user dragged
            if (e.defaultPrevented) return;
          }}
        >
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            nested={true}
            className="w-full h-full"
            dir="rtl"
            onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
            grabCursor={true}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx} className="w-full h-full relative">
                <Image
                  src={img}
                  alt={`${label} - ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  draggable={false}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none z-10" />

          {/* Slider Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Top Right: Category Tag */}
          <div className="absolute top-3 right-3 z-10 bg-primary/90 text-white font-black text-[11px] px-2.5 py-1 rounded-md sm:rounded-lg flex items-center gap-1 shadow-sm select-none">
            <span>⚙️ {equipment.category}</span>
          </div>

          {/* Top Left: Favorites Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-black/35 hover:bg-black/50 text-white flex items-center justify-center transition-all"
            aria-label="حفظ في المفضلة"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          {/* Bottom Left: Images Counter */}
          <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1 rounded-md sm:rounded-lg select-none">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Bottom Right: Status Badge */}
          <Badge
            className={`absolute bottom-3 right-3 z-10 px-3 py-1 rounded-lg text-xs font-black border-0 shadow-sm ${getStatusColor(
              equipment.status,
            )}`}
          >
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-4 text-right">
        {/* Title */}
        <h3 className="font-[1000] text-base md:text-lg text-slate-800 transition-colors group-hover:text-primary leading-snug line-clamp-1 mb-1.5">
          {label}
        </h3>

        {/* Technical Specs Line */}
        <div
          className="flex items-center justify-end gap-1.5 text-[11px] md:text-xs font-bold text-slate-500 mb-2.5"
          dir="rtl"
        >
          <span>{equipment.year || "موديل حديث"}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span>{equipment.condition}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span>{equipment.location}</span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline justify-end gap-1 mb-4 select-none">
          <span className="text-xl md:text-2xl font-[1000] text-[#1B3E7A]">
            {equipment.price != null && equipment.price > 0 
              ? equipment.price.toLocaleString("ar-EG") 
              : "حسب الطلب"}
          </span>
          <span className="text-[11px] md:text-xs font-black text-[#1B3E7A]/80">
            {equipment.price != null && equipment.price > 0 ? "جنيه" : ""}
          </span>
        </div>

        {/* Custom Tags Section */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 mb-5 border-t border-slate-100/80 pt-3">
          {/* Location Tag */}
          <span className="inline-flex items-center gap-0.5 rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
            {equipment.location}
          </span>
          {/* Brand Tag */}
          <span className="rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {equipment.brand}
          </span>
          {/* Category Tag */}
          <span className="rounded-lg bg-slate-50 px-2.5 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {equipment.category}
          </span>
          {/* Condition Tag */}
          <span className="rounded-lg bg-slate-50 px-2.5 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {equipment.condition}
          </span>
        </div>

        {/* Premium Bottom Action Bar (3 Actions) */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 mt-auto w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/equipment/${equipment._id}`} className="flex-1 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary text-white text-[11px] sm:text-sm font-bold flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            التفاصيل
          </Link>
          {/* Call Button */}
          <a
            href={getTelHref(equipment.phone)}
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/60 hover:bg-[#DBEAFE] flex items-center justify-center transition-all shadow-sm"
            aria-label="اتصال"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]/60 hover:bg-[#D1FAE5] flex items-center justify-center transition-all shadow-sm"
            aria-label="تواصل عبر واتساب"
          >
            <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          </a>

          {/* Showroom Logo / Brand Badge */}
        </div>
      </CardContent>
    </Card>
  );
}
