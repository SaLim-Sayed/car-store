"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Globe, Store, CheckCircle, ChevronLeft, Search } from "lucide-react"
import Link from "next/link"
import { useShowrooms } from "@/hooks/useContent"

export default function ShowroomsPage() {
  const { data: showroomsData, isLoading } = useShowrooms()
  const showrooms = showroomsData?.data || []
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShowrooms = showrooms.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-[1000] tracking-tighter">شركاؤنا ومعارضنا</h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-3xl mx-auto">
              تصفح معارض السيارات الموثوقة والمنتشرة في جميع أنحاء المنيا
            </p>
            <div className="h-2 w-32 bg-primary rounded-full mx-auto" />
          </div>

          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث عن معرض بالاسم أو المنطقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-20 rounded-[2.5rem] border-0 shadow-2xl pr-18 pl-8 text-xl font-bold bg-white focus-visible:ring-primary/20"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="border-0 shadow-lg rounded-[3rem] bg-white overflow-hidden">
                  <CardContent className="p-10 space-y-6">
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-20 w-20 rounded-[1.5rem]" />
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
                <Card key={showroom._id} className="border-0 shadow-xl rounded-[3rem] bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-10 space-y-8 h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center border-2 border-gray-100 overflow-hidden shadow-inner group-hover:border-primary/20 transition-colors">
                          {showroom.logo ? (
                            <img src={showroom.logo} alt={showroom.name} className="w-full h-full object-contain p-4" />
                          ) : (
                            <Store className="h-12 w-12 text-primary opacity-20" />
                          )}
                        </div>
                      </div>
                      {showroom.featured && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 rounded-full px-4 py-1.5 font-black text-xs uppercase tracking-tighter">
                          شريك متميز
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-black group-hover:text-primary transition-colors leading-tight">{showroom.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground font-bold">
                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                        <span className="line-clamp-1">{showroom.address}</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50 flex-1">
                      <div className="flex items-center gap-4 text-muted-foreground font-bold hover:text-primary transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5">
                          <Phone className="h-5 w-5" />
                        </div>
                        <span>{showroom.phone}</span>
                      </div>
                      {showroom.email && (
                        <div className="flex items-center gap-4 text-muted-foreground font-bold hover:text-primary transition-colors cursor-pointer">
                          <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5">
                            <Mail className="h-5 w-5" />
                          </div>
                          <span className="line-clamp-1">{showroom.email}</span>
                        </div>
                      )}
                    </div>

                    <Button asChild className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-lg shadow-primary/10 group/btn">
                      <Link href={`/cars?showroom=${showroom._id}`} className="flex items-center justify-center">
                        عرض السيارات المتاحة
                        <ChevronLeft className="mr-2 h-6 w-6 group-hover/btn:-translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredShowrooms.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] shadow-xl border-4 border-dashed border-gray-100">
               <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Store className="h-16 w-16 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-4xl font-black mb-4">لا توجد معارض</h3>
              <p className="text-muted-foreground text-xl font-medium max-w-md mx-auto leading-relaxed">
                {searchTerm ? "لم نجد أي معرض يطابق بحثك، جرب البحث بكلمات أخرى" : "سيتم إضافة المعارض قريباً"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

