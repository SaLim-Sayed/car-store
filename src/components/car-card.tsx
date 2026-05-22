"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, MapPin, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTelHref, getContactPhone } from "@/lib/phone";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

interface CarCardProps {
  car: {
    _id: string;
    brand: string;
    model: string;
    year: number;
    price?: number;
    fuelType: string;
    transmission: string;
    mileage: number;
    color: string;
    description: string;
    images: string[];
    status: string;
    createdAt: string;
    phone?: string;
  };
}

export function CarCard({ car }: CarCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

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

  const whatsappMessage = `مرحباً، أريد الاستفسار عن سيارة ${car.brand} ${car.model} موديل ${car.year} المعروضة للبيع${car.price ? ` بسعر ${car.price.toLocaleString()} جنيه` : ""}`;
  const whatsappUrl = `https://wa.me/${getContactPhone(car.phone)}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card
      onClick={() => router.push(`/cars/${car._id}`)}
      className="group flex flex-col p-0 h-full min-h-0 overflow-hidden border border-slate-200/80 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
    >
      <CardHeader className="shrink-0 p-0 relative">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={car.images[0] || "/placeholder-car.jpg"}
            alt={`${car.brand} ${car.model}`}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

          {/* Top Right: Turbo Tag */}
          <div className="absolute top-3 right-3 z-10 bg-amber-600/90 text-white font-black text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm select-none">
            <span>⚡ تيربو</span>
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
          <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1 rounded-lg select-none">
            1 / {car.images.length || 1}
          </div>

          {/* Bottom Right: Status Badge */}
          <Badge
            className={`absolute bottom-3 right-3 z-10 px-3 py-1 rounded-lg text-xs font-black border-0 shadow-sm ${getStatusColor(
              car.status,
            )}`}
          >
            {car.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-4 text-right">
        {/* Title */}
        <h3 className="font-[1000] text-base md:text-lg text-slate-800 transition-colors group-hover:text-primary leading-snug line-clamp-1 mb-1.5">
          {car.brand} {car.model}
        </h3>

        {/* Technical Specs Line */}
        <div
          className="flex items-center justify-end gap-1.5 text-[11px] md:text-xs font-bold text-slate-500 mb-2.5"
          dir="rtl"
        >
          <span>{car.year}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span>
            {car.mileage ? `${car.mileage.toLocaleString()} كم` : "0 كم"}
          </span>
          <span className="text-slate-300 font-normal">|</span>
          <span>{car.transmission}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span>{car.fuelType}</span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline justify-end gap-1 mb-4 select-none">
          <span className="text-xl md:text-2xl font-[1000] text-[#1B3E7A]">
            {car.price ? car.price.toLocaleString() : "حسب الطلب"}
          </span>
          <span className="text-[11px] md:text-xs font-black text-[#1B3E7A]/80">
            جنيه
          </span>
        </div>

        {/* Custom Tags Section */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 mb-5 border-t border-slate-100/80 pt-3">
          {/* Location Tag */}
          <span className="inline-flex items-center gap-0.5 rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            المنيا
          </span>
          {/* Brand Tag */}
          <span className="rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {car.brand}
          </span>
          {/* Model Tag */}
          <span className="rounded-lg bg-slate-50 px-2.5 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {car.model}
          </span>
          {/* Condition Tag */}
          <span className="rounded-lg bg-slate-50 px-2.5 py-0.5 text-[10px] font-black text-slate-500 border border-slate-100">
            {car.mileage === 0 ? "زيرو" : "كسر زيرو"}
          </span>
        </div>

        {/* Premium Bottom Action Bar (3 Actions) */}
        <div
          className="flex items-center gap-2 mt-auto w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-10 w-40 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 relative overflow-hidden p-1 shadow-inner select-none">
            <Link href={`/cars/${car._id}`}>عرض التفاصيل</Link>
          </div>
          {/* Call Button */}
          <a
            href={getTelHref(car.phone)}
            className="flex-1 h-10 rounded-xl bg-[#EFF6FF] text-[#1B3E7A] border border-[#BFDBFE]/60 hover:bg-[#DBEAFE] font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>اتصال</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-12 rounded-xl bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]/60 hover:bg-[#D1FAE5] flex items-center justify-center transition-all shrink-0 shadow-sm"
            aria-label="تواصل عبر واتساب"
          >
            <FaWhatsapp className="h-5 w-5 fill-current" />
          </a>

          {/* Showroom Logo / Brand Badge */}
        </div>
      </CardContent>
    </Card>
  );
}
