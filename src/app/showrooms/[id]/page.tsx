import { notFound } from "next/navigation";
import connectDB from "@/lib/mongoose";
import Showroom from "@/lib/models/Showroom";
import CarModel from "@/lib/models/Car";
import EquipmentModel from "@/lib/models/Equipment";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapEmbed } from "@/components/map-embed";
import {
  ShowroomInventoryTabs,
  ShowroomPageContact,
} from "@/components/showroom-detail-client";
import { listingDetailMain, listingDetailShell } from "@/components/listing-detail-ui";
import { Clock3, Mail, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { ShareButton } from "@/components/share-button";
import { ContactInfoTile } from "@/components/contact-actions";
import { getContactPhone } from "@/lib/phone";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/app-url";
import type { Metadata } from "next";
import type { Car } from "@/hooks/useCars";
import type { Equipment } from "@/hooks/useEquipment";

export const dynamic = "force-dynamic";

const BIKE_CATEGORIES = [
  "موتوسيكل",
  "توك توك",
  "تروسيكل",
  "سكوتر",
  "دراجة نارية",
] as const;

type BikeCategory = (typeof BIKE_CATEGORIES)[number];

function isBikeCategory(category?: string | null): category is BikeCategory {
  return !!category && (BIKE_CATEGORIES as readonly string[]).includes(category);
}

type ShowroomDoc = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  logo?: string;
  description?: string;
  featured?: boolean;
  workingHours?: string;
  locationLink?: string;
  coordinates?: { lat: number; lng: number } | null;
};

type RelatedShowroom = {
  _id: string;
  name: string;
  address: string;
  logo?: string;
  featured?: boolean;
};

async function getShowroom(id: string): Promise<ShowroomDoc | null> {
  try {
    await connectDB();
    const showroom = (await Showroom.findById(id).lean()) as {
      _id: unknown;
      name: string;
      address: string;
      phone: string;
      email?: string;
      logo?: string;
      description?: string;
      featured?: boolean;
      workingHours?: string;
      locationLink?: string;
      location?: { coordinates?: [number, number] };
    } | null;
    if (!showroom) return null;

    const coords = showroom.location?.coordinates;
    const coordinates =
      Array.isArray(coords) && coords.length >= 2
        ? { lng: coords[0], lat: coords[1] }
        : null;

    return {
      _id: String(showroom._id),
      name: showroom.name,
      address: showroom.address,
      phone: showroom.phone,
      email: showroom.email ?? "",
      logo: showroom.logo ?? "",
      description: showroom.description ?? "",
      featured: !!showroom.featured,
      workingHours: showroom.workingHours ?? "",
      locationLink: showroom.locationLink ?? "",
      coordinates,
    };
  } catch {
    return null;
  }
}

async function getRelatedShowrooms(currentId: string): Promise<RelatedShowroom[]> {
  await connectDB();
  const rows = await Showroom.find({ _id: { $ne: currentId } })
    .select("name address logo featured")
    .sort({ featured: -1, updatedAt: -1 })
    .limit(3)
    .lean();

  return rows.map((row) => ({
    _id: String(row._id),
    name: row.name,
    address: row.address,
    logo: row.logo ?? "",
    featured: !!row.featured,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const showroom = await getShowroom(id);
  if (!showroom) {
    return buildPageMetadata({
      title: "المعرض غير موجود",
      description: "لم يتم العثور على المعرض المطلوب.",
      path: `showrooms/${id}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: `${showroom.name} | معارض السيارات في المنيا`,
    description: `${showroom.name} — ${showroom.address}. تواصل مباشرة واطّلع على الإعلانات المتاحة داخل المعرض.`,
    path: `showrooms/${showroom._id}`,
    image: showroom.logo || "/logo.png",
    ogType: "article",
    keywords: ["معارض سيارات المنيا", showroom.name, showroom.address],
  });
}

export default async function ShowroomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const showroom = await getShowroom(id);
  if (!showroom) notFound();

  await connectDB();

  const [
    carsRaw,
    equipmentRaw,
    carCount,
    bikeCount,
    equipmentCount,
    relatedShowrooms,
  ] = await Promise.all([
    CarModel.find({ showroom: showroom._id }).sort({ createdAt: -1 }).limit(9).lean(),
    EquipmentModel.find({ showroom: showroom._id }).sort({ createdAt: -1 }).limit(18).lean(),
    CarModel.countDocuments({ showroom: showroom._id }),
    EquipmentModel.countDocuments({
      showroom: showroom._id,
      category: { $in: BIKE_CATEGORIES },
    }),
    EquipmentModel.countDocuments({
      showroom: showroom._id,
      category: { $nin: BIKE_CATEGORIES },
    }),
    getRelatedShowrooms(showroom._id),
  ]);

  const cars = JSON.parse(JSON.stringify(carsRaw)) as Car[];
  const equipmentList = JSON.parse(JSON.stringify(equipmentRaw)) as Equipment[];

  const bikes = equipmentList.filter((e) => isBikeCategory(e.category));
  const heavyEquipment = equipmentList.filter((e) => !isBikeCategory(e.category));

  const totalListings = carCount + bikeCount + equipmentCount;
  const whatsappHref = getWhatsAppUrl(
    `مرحباً، أريد الاستفسار عن معرض ${showroom.name}`,
    getContactPhone(showroom.phone),
  );

  const inventoryTabs = [
    carCount > 0
      ? {
          id: "cars",
          label: `سيارات (${carCount})`,
          count: carCount,
          href: `/cars?showroom=${showroom._id}`,
          kind: "cars" as const,
          items: cars,
        }
      : null,
    bikeCount > 0
      ? {
          id: "bikes",
          label: `دراجات (${bikeCount})`,
          count: bikeCount,
          href: `/bikes?showroom=${showroom._id}`,
          kind: "bikes" as const,
          items: bikes,
        }
      : null,
    equipmentCount > 0
      ? {
          id: "equipment",
          label: `معدات (${equipmentCount})`,
          count: equipmentCount,
          href: `/equipment?showroom=${showroom._id}`,
          kind: "equipment" as const,
          items: heavyEquipment,
        }
      : null,
  ].filter(Boolean) as {
    id: string;
    label: string;
    count: number;
    href: string;
    kind: "cars" | "bikes" | "equipment";
    items: Car[] | Equipment[];
  }[];

  const primaryLink = inventoryTabs[0] ?? {
    href: `/cars?showroom=${showroom._id}`,
    label: "إعلانات المعرض",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: showroom.name,
    description: showroom.description || undefined,
    image: showroom.logo || undefined,
    telephone: showroom.phone,
    email: showroom.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: showroom.address,
      addressRegion: "المنيا",
      addressCountry: "EG",
    },
    url: absoluteUrl(`showrooms/${showroom._id}`),
    ...(showroom.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: showroom.coordinates.lat,
            longitude: showroom.coordinates.lng,
          },
        }
      : {}),
  };

  return (
    <div className={listingDetailShell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className={listingDetailMain}>
        <div className="space-y-5">
          <Breadcrumbs
            items={[
              { label: "المعارض والشركاء", href: "/showrooms" },
              { label: showroom.name },
            ]}
          />

          <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 ring-4 ring-slate-50 sm:size-28">
                    {showroom.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={showroom.logo}
                        alt={showroom.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Store className="size-10 text-slate-300" />
                    )}
                  </div>
                  {totalListings > 0 ? (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {totalListings} إعلان
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-2 text-center sm:text-right">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-pretty text-lg font-semibold leading-snug text-slate-900 break-words sm:text-xl">
                      {showroom.name}
                    </h1>
                    {showroom.featured ? (
                      <Badge className="rounded-md border-0 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        شريك متميز
                      </Badge>
                    ) : null}
                  </div>

                  <p className="flex items-start justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>{showroom.address}</span>
                  </p>

                  {totalListings > 0 ? (
                    <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {carCount > 0 ? (
                        <Link
                          href={`/cars?showroom=${showroom._id}`}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {carCount} سيارة
                        </Link>
                      ) : null}
                      {bikeCount > 0 ? (
                        <Link
                          href={`/bikes?showroom=${showroom._id}`}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {bikeCount} دراجة
                        </Link>
                      ) : null}
                      {equipmentCount > 0 ? (
                        <Link
                          href={`/equipment?showroom=${showroom._id}`}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {equipmentCount} معدة
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              {showroom.description ? (
                <p className="text-sm leading-relaxed text-slate-600">{showroom.description}</p>
              ) : null}

              <ShowroomPageContact
                showroomId={showroom._id}
                phone={showroom.phone}
                whatsappHref={whatsappHref}
              />

              {showroom.email || showroom.workingHours ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {showroom.email ? (
                    <ContactInfoTile
                      icon={<Mail className="size-4" />}
                      label="البريد الإلكتروني"
                      value={showroom.email}
                      href={`mailto:${showroom.email}`}
                    />
                  ) : null}
                  {showroom.workingHours ? (
                    <ContactInfoTile
                      icon={<Clock3 className="size-4" />}
                      label="مواعيد العمل"
                      value={showroom.workingHours}
                      className={showroom.email ? undefined : "sm:col-span-2"}
                    />
                  ) : null}
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Button
                  asChild
                  variant="ghost"
                  className="h-10 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:underline"
                >
                  <Link href={primaryLink.href}>{primaryLink.label}</Link>
                </Button>
                <ShareButton
                  className="size-10 rounded-lg border-slate-200"
                  title={showroom.name}
                  text={`شاهد إعلانات معرض ${showroom.name}`}
                />
              </div>

              <MapEmbed
                url={showroom.locationLink}
                coordinates={showroom.coordinates}
                title="موقع المعرض"
              />
            </CardContent>
          </Card>

          {inventoryTabs.length > 0 ? (
            <ShowroomInventoryTabs tabs={inventoryTabs} />
          ) : (
            <Card className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 shadow-none">
              <CardContent className="py-10 text-center">
                <Store className="mx-auto mb-3 size-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">لا توجد إعلانات حالياً</p>
                <p className="mt-1 text-xs text-slate-500">
                  استخدم أزرار الاتصال أو واتساب أعلاه للاستفسار عن المتوفر.
                </p>
              </CardContent>
            </Card>
          )}

          {relatedShowrooms.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">معارض أخرى</h2>
                <Link href="/showrooms" className="text-xs font-medium text-primary hover:underline">
                  عرض الكل
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedShowrooms.map((related) => (
                  <Link
                    key={related._id}
                    href={`/showrooms/${related._id}`}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-primary/30 hover:bg-slate-50"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      {related.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={related.logo}
                          alt={related.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Store className="size-5 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-900">
                        {related.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">{related.address}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
