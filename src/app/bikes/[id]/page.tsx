import { Metadata } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/mongoose";
import Equipment from "@/lib/models/Equipment";
import ClientPage from "./client-page";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildEquipmentListingJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

interface BikeDoc {
  _id: string;
  title: string;
  brand: string;
  model?: string;
  year?: number;
  price?: number;
  category: string;
  condition: string;
  hours: number;
  location: string;
  locationLink?: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  phone?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const dynamic = 'force-dynamic';

async function getBike(id: string): Promise<BikeDoc | null> {
  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  try {
    await connectDB();
    const bike = await Equipment.findById(id).lean();
    if (!bike) return null;
    
    return {
      _id: bike._id.toString(),
      title: bike.title,
      brand: bike.brand,
      model: bike.model ?? "",
      year: bike.year ?? undefined,
      price: bike.price ?? undefined,
      category: bike.category,
      condition: bike.condition,
      hours: bike.hours,
      location: bike.location,
      locationLink: bike.locationLink,
      description: bike.description,
      images: bike.images || [],
      features: bike.features || [],
      status: bike.status,
      phone: bike.phone,
      featured: bike.featured,
      createdAt: bike.createdAt
        ? bike.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: bike.updatedAt
        ? bike.updatedAt.toISOString()
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching bike:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const bike = await getBike(id);
  
  if (!bike) {
    return {
      title: "الدراجة غير موجودة | سوق سيارات المنيا",
      description: "لم يتم العثور على الدراجة المطلوبة",
    };
  }

  const label =
    bike.title || `${bike.brand} ${bike.model || ""}`.trim();
  const title = `${label}${bike.year ? ` ${bike.year}` : ""} للبيع في المنيا`;
  const description = `${label}${bike.year ? ` موديل ${bike.year}` : ""} للبيع في المنيا. ${bike.brand ? `الماركة: ${bike.brand}. ` : ""}${bike.price ? `السعر ${bike.price.toLocaleString("ar-EG")} جنيه.` : "السعر حسب الطلب."} ${bike.status} — تواصل مع البائع.`;

  return buildPageMetadata({
    title,
    description,
    path: `bikes/${bike._id}`,
    image: bike.images?.[0] || "/logo.png",
    ogType: "article",
    keywords: [
      label,
      bike.category,
      bike.brand ?? "دراجات نارية",
      "موتوسيكلات المنيا",
      "توك توك للبيع",
    ],
  });
}

export default async function BikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bike = await getBike(id);
  
  if (!bike) {
    notFound();
  }

  const label =
    bike.title || `${bike.brand} ${bike.model || ""}`.trim();

  // Re-use equipment JSON LD helper
  const listingLd = buildEquipmentListingJsonLd(bike as any);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "الرئيسية", path: "" },
    { name: "الدراجات النارية والتوك توك", path: "bikes" },
    { name: label },
  ]);

  return (
    <>
      <JsonLd data={listingLd} />
      <JsonLd data={breadcrumbLd} />
      <ClientPage
        initialBike={{
          ...bike,
          featured: bike.featured ?? false,
          updatedAt: bike.updatedAt ?? bike.createdAt,
        }}
      />
    </>
  );
}
