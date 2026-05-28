import { Metadata } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/mongoose";
import Car from "@/lib/models/Car";
import "@/lib/models/Showroom";
import ClientPage from "./client-page";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildCarListingJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

// Define the interface based on what the client expects
interface CarDoc {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price?: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
  phone?: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  locationLink?: string;
  showroom?: any;
  createdAt: string;
}

export const dynamic = 'force-dynamic';

async function getCar(id: string): Promise<CarDoc | null> {
  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  try {
    await connectDB();
    const car = await Car.findById(id).populate("showroom").lean();
    if (!car) return null;
    
    return {
      _id: car._id.toString(),
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      fuelType: car.fuelType,
      transmission: car.transmission,
      mileage: car.mileage,
      color: car.color,
      phone: car.phone,
      description: car.description,
      images: car.images || [],
      features: car.features || [],
      status: car.status,
      locationLink: car.locationLink,
      showroom: car.showroom,
      createdAt: car.createdAt ? car.createdAt.toISOString() : new Date().toISOString()
    } as CarDoc;
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);
  
  if (!car) {
    return {
      title: "السيارة غير موجودة | سوق سيارات المنيا",
      description: "لم يتم العثور على السيارة المطلوبة",
    };
  }

  const title = `${car.brand} ${car.model} ${car.year} للبيع في المنيا`;
  const description = `${car.brand} ${car.model} موديل ${car.year} للبيع في المنيا. ${car.price ? `السعر ${car.price.toLocaleString("ar-EG")} جنيه مصري.` : "السعر حسب الطلب."} ${car.transmission}، ${car.fuelType}، ${car.mileage.toLocaleString("ar-EG")} كم. ${car.status} — تواصل مع البائع مباشرة.`;

  return buildPageMetadata({
    title,
    description,
    path: `cars/${car._id}`,
    image: car.images?.[0] || "/logo.png",
    ogType: "article",
    keywords: [
      `${car.brand} للبيع`,
      `${car.brand} ${car.model}`,
      `سيارات ${car.brand} المنيا`,
      `سيارة ${car.year}`,
      car.fuelType,
      car.transmission,
    ],
  });
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);
  
  if (!car) {
    notFound();
  }

  const listingLd = buildCarListingJsonLd(car);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "الرئيسية", path: "" },
    { name: "سيارات للبيع", path: "cars" },
    { name: `${car.brand} ${car.model} ${car.year}` },
  ]);

  return (
    <>
      <JsonLd data={listingLd} />
      <JsonLd data={breadcrumbLd} />
      <ClientPage initialCar={car} />
    </>
  );
}
