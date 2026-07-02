import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/app-url";
import connectDB from "@/lib/mongoose";
import Car from "@/lib/models/Car";
import Equipment from "@/lib/models/Equipment";
import Showroom from "@/lib/models/Showroom";
import News from "@/lib/models/News";

const BIKE_CATEGORIES = [
  "موتوسيكل",
  "توك توك",
  "تروسيكل",
  "سكوتر",
  "دراجة نارية",
] as const;

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "about",
  "cars",
  "equipment",
  "bikes",
  "news",
  "contact",
  "services",
  "showrooms",
  "faq",
  "finance",
  "privacy",
  "terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  try {
    await connectDB();

    const [cars, equipment, bikes, showrooms, news] = await Promise.all([
      Car.find({}, "_id updatedAt").lean(),
      Equipment.find({ category: { $nin: BIKE_CATEGORIES } }, "_id updatedAt").lean(),
      Equipment.find({ category: { $in: BIKE_CATEGORIES } }, "_id updatedAt").lean(),
      Showroom.find({}, "_id updatedAt").lean(),
      News.find({}, "_id updatedAt").lean(),
    ]);

    const carEntries = cars.map((car) => ({
      url: absoluteUrl(`cars/${String(car._id)}`),
      lastModified: car.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const equipmentEntries = equipment.map((equip) => ({
      url: absoluteUrl(`equipment/${String(equip._id)}`),
      lastModified: equip.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const bikeEntries = bikes.map((bike) => ({
      url: absoluteUrl(`bikes/${String(bike._id)}`),
      lastModified: bike.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const showroomEntries = showrooms.map((sr) => ({
      url: absoluteUrl(`showrooms/${String(sr._id)}`),
      lastModified: sr.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const newsEntries = news.map((item) => ({
      url: absoluteUrl(`news/${String(item._id)}`),
      lastModified: item.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [
      ...staticEntries,
      ...carEntries,
      ...equipmentEntries,
      ...bikeEntries,
      ...showroomEntries,
      ...newsEntries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticEntries;
  }
}
