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

/** Matches Equipment model + client-page expectations */
interface EquipmentDoc {
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

async function getEquipment(id: string): Promise<EquipmentDoc | null> {
  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  try {
    await connectDB();
    const equipment = await Equipment.findById(id).lean();
    if (!equipment) return null;
    
    return {
      _id: equipment._id.toString(),
      title: equipment.title,
      brand: equipment.brand,
      model: equipment.model ?? "",
      year: equipment.year ?? undefined,
      price: equipment.price ?? undefined,
      category: equipment.category,
      condition: equipment.condition,
      hours: equipment.hours,
      location: equipment.location,
      locationLink: equipment.locationLink,
      description: equipment.description,
      images: equipment.images || [],
      features: equipment.features || [],
      status: equipment.status,
      phone: equipment.phone,
      featured: equipment.featured,
      createdAt: equipment.createdAt
        ? equipment.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: equipment.updatedAt
        ? equipment.updatedAt.toISOString()
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const equipment = await getEquipment(id);
  
  if (!equipment) {
    return {
      title: "المعدة غير موجودة | سوق سيارات المنيا",
      description: "لم يتم العثور على المعدة المطلوبة",
    };
  }

  const label =
    equipment.title || `${equipment.brand} ${equipment.model || ""}`.trim();
  const title = `${label}${equipment.year ? ` ${equipment.year}` : ""} للبيع في المنيا`;
  const description = `${label}${equipment.year ? ` موديل ${equipment.year}` : ""} للبيع في المنيا. ${equipment.brand ? `الماركة: ${equipment.brand}. ` : ""}${equipment.price ? `السعر ${equipment.price.toLocaleString("ar-EG")} جنيه.` : "السعر حسب الطلب."} ${equipment.hours.toLocaleString("ar-EG")} ساعة عمل. ${equipment.status} — تواصل مع البائع.`;

  return buildPageMetadata({
    title,
    description,
    path: `equipment/${equipment._id}`,
    image: equipment.images?.[0] || "/logo.png",
    ogType: "article",
    keywords: [
      label,
      equipment.category,
      equipment.brand ?? "معدات ثقيلة",
      "معدات زراعية المنيا",
      "جرارات للبيع",
    ],
  });
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = await getEquipment(id);
  
  if (!equipment) {
    notFound();
  }

  const label =
    equipment.title || `${equipment.brand} ${equipment.model || ""}`.trim();

  const listingLd = buildEquipmentListingJsonLd(equipment);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "الرئيسية", path: "" },
    { name: "معدات للبيع", path: "equipment" },
    { name: label },
  ]);

  return (
    <>
      <JsonLd data={listingLd} />
      <JsonLd data={breadcrumbLd} />
      <ClientPage
        initialEquipment={{
          ...equipment,
          featured: equipment.featured ?? false,
          updatedAt: equipment.updatedAt ?? equipment.createdAt,
        }}
      />
    </>
  );
}
