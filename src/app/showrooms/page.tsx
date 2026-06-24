"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Store,
  CheckCircle,
  ChevronLeft,
  Search,
} from "lucide-react";
import { CallPhoneLink } from "@/components/call-button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatPhoneDisplay } from "@/lib/phone";
import Link from "next/link";
import { useShowrooms } from "@/hooks/useContent";

function ShowroomsPageContent() {
  const searchParams = useSearchParams();
  const { data: showroomsData, isLoading } = useShowrooms();
  const showrooms = showroomsData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const filteredShowrooms = showrooms.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <main className="container mx-auto px-4 py-8 md:py-24">
        <div className="max-w-5xl mx-auto mb-8 md:mb-16">
          <Breadcrumbs items={[{ label: "معارض السيارات" }]} />
        </div>
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-16">
          <div className="text-center space-y-3 md:space-y-6">
            <h1 className="text-3xl md:text-7xl font-[1000] tracking-tighter">
              شركاؤنا ومعارضنا
            </h1>
            <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-3xl mx-auto">
              تصفح معارض السيارات الموثوقة والمنتشرة في جميع أنحاء المنيا
            </p>
            <div className="h-1.5 w-24 md:w-32 bg-primary rounded-full mx-auto" />
          </div>

          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث عن معرض بالاسم أو المنطقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 md:h-16 rounded-xl md:rounded-[2rem] border-0 shadow-none pr-12 md:pr-16 pl-6 text-base md:text-lg font-bold bg-white focus-visible:ring-primary/20"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-none rounded-2xl md:rounded-[2rem] bg-white overflow-hidden"
                >
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <Skeleton className="h-8 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShowrooms.map((showroom: any) => (
                <Card
                  key={showroom._id}
                  className="border-0 shadow-none rounded-2xl md:rounded-[2rem] bg-white overflow-hidden group hover:shadow-none transition-all duration-500 "
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="w-full h-56 md:h-64 bg-gray-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
                      {showroom.featured && (
                        <Badge className="absolute right-4 top-4 z-10 bg-amber-500 text-white border-0 rounded-full px-4 py-1.5 font-black text-xs shadow-sm uppercase">
                          شريك متميز
                        </Badge>
                      )}
                      {showroom.logo ? (
                        <img
                          src={showroom.logo}
                          alt={showroom.name}
                          className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <Store className="h-16 w-16 text-primary opacity-20" />
                      )}
                    </div>

                    <div className="w-full px-6 py-6 flex flex-col gap-4 flex-1 bg-white">
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-[900] text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {showroom.name}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground font-bold">
                          <MapPin className="h-5 w-5 text-primary shrink-0" />
                          <span className="line-clamp-1 text-sm md:text-base">
                            {showroom.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full mt-auto pt-4 border-t border-gray-50">
                        <CallPhoneLink
                          phone={showroom.phone}
                          className="flex items-center justify-between bg-gray-50/80 rounded-xl py-3 px-4 text-gray-800 font-bold hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10 transition-all"
                        >
                          <span
                            dir="ltr"
                            className="text-base md:text-lg tracking-wide"
                          >
                            {formatPhoneDisplay(showroom.phone)}
                          </span>
                          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                            <Phone className="h-4 w-4" />
                          </div>
                        </CallPhoneLink>

                        {showroom.email && (
                          <div className="flex items-center justify-between bg-gray-50/80 rounded-xl py-3 px-4 text-gray-800 font-bold hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10 transition-all cursor-pointer">
                            <span className="line-clamp-1 text-sm md:text-base">
                              {showroom.email}
                            </span>
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                              <Mail className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        asChild
                        className="w-full h-12 md:h-14 mt-2 rounded-xl text-base md:text-lg font-black shadow-none hover:shadow-lg transition-all duration-300 group/btn bg-[#1B3E7A] hover:bg-[#1B3E7A]/90 text-white"
                      >
                        <Link
                          href={`/showrooms/${showroom._id}`}
                          className="flex items-center justify-center"
                        >
                          تفاصيل المعرض
                          <ChevronLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredShowrooms.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] shadow-none border-4 border-dashed border-gray-100">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Store className="h-16 w-16 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-4xl font-black mb-4">لا توجد معارض</h3>
              <p className="text-muted-foreground text-xl font-medium max-w-md mx-auto leading-relaxed">
                {searchTerm
                  ? "لم نجد أي معرض يطابق بحثك، جرب البحث بكلمات أخرى"
                  : "سيتم إضافة المعارض قريباً"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ShowroomsPageFallback() {
  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <main className="container mx-auto px-4 py-24">
        <Skeleton className="h-16 w-96 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-[3rem]" />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ShowroomsPage() {
  return (
    <Suspense fallback={<ShowroomsPageFallback />}>
      <ShowroomsPageContent />
    </Suspense>
  );
}
