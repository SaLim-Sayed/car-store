import { notFound } from "next/navigation";
import connectDB from "@/lib/mongoose";
import Showroom from "@/lib/models/Showroom";
import Car from "@/lib/models/Car";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapEmbed } from "@/components/map-embed";
import { CarCard } from "@/components/car-card";
import { ChevronLeft, Mail, MapPin, Phone, Store } from "lucide-react";
import Link from "next/link";
import { formatPhoneDisplay } from "@/lib/phone";
import { buildPageMetadata } from "@/lib/seo";
import { ShareButton } from "@/components/share-button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
};

async function getShowroom(id: string): Promise<ShowroomDoc | null> {
  try {
    await connectDB();
    const showroom = (await Showroom.findById(id).lean()) as any;
    if (!showroom) return null;
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
    };
  } catch {
    return null;
  }
}

async function getShowroomCars(showroomId: string) {
  await connectDB();
  const cars = await Car.find({ showroom: showroomId })
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();
  return JSON.parse(JSON.stringify(cars)) as any[];
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
    description: `${showroom.name} — ${showroom.address}. تواصل مباشرة واطّلع على السيارات المتاحة داخل المعرض.`,
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

  const cars = await getShowroomCars(showroom._id);

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <Breadcrumbs
            items={[
              { label: "المعارض والشركاء", href: "/showrooms" },
              { label: showroom.name },
            ]}
          />

          <Card className="border-0 shadow-none rounded-2xl md:rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-100 overflow-hidden shrink-0">
                      {showroom.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={showroom.logo}
                          alt={showroom.name}
                          className="w-full h-full object-contain p-3"
                        />
                      ) : (
                        <Store className="h-10 w-10 text-primary opacity-20" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-4xl font-[1000] tracking-tighter truncate">
                          {showroom.name}
                        </h1>
                        {showroom.featured ? (
                          <Badge className="bg-amber-100 text-amber-700 border-0 rounded-full px-3 py-1 font-black text-[11px]">
                            شريك متميز
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-bold">
                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                        <span className="line-clamp-2">{showroom.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {showroom.description ? (
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {showroom.description}
                  </p>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <span dir="ltr" className="font-black text-slate-800">
                      {formatPhoneDisplay(showroom.phone)}
                    </span>
                  </div>
                  {showroom.email ? (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <Mail className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-black text-slate-800 line-clamp-1">
                        {showroom.email}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild className="h-12 rounded-xl font-black">
                    <Link href={`/cars?showroom=${showroom._id}`}>
                      عرض سيارات المعرض
                      <ChevronLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-xl font-black bg-white"
                  >
                    <a href={`tel:${showroom.phone}`} dir="ltr">
                      اتصال
                    </a>
                  </Button>
                  <ShareButton
                    className="h-12 w-12 rounded-xl bg-white border-neutral-200"
                    title={showroom.name}
                    text={`شاهد سيارات معرض ${showroom.name}`}
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <MapEmbed url={showroom.locationLink} title="موقع المعرض" />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl md:text-3xl font-[1000] tracking-tighter">
              سيارات المعرض
            </h2>
            <Button
              asChild
              variant="outline"
              className="rounded-xl bg-white font-bold"
            >
              <Link href={`/cars?showroom=${showroom._id}`}>
                عرض الكل <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={String(car._id)} car={car} />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-none rounded-2xl bg-white">
              <CardContent className="p-10 text-center space-y-3">
                <Store className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="text-lg font-black">لا توجد سيارات للعرض حالياً</p>
                <p className="text-sm font-bold text-muted-foreground">
                  سيتم إضافة سيارات المعرض قريباً.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

