"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Tractor, Gauge, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Equipment } from "@/hooks/useEquipment"

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/equipment/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setItem(data.data)
        } else {
          setError(data.error || "المعدة غير موجودة")
        }
      } catch {
        setError("حدث خطأ في الاتصال")
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchItem()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <Skeleton className="h-96 w-full rounded-[2rem] mb-8" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center space-y-6">
          <p className="text-xl font-bold text-destructive">{error || "المعدة غير موجودة"}</p>
          <Button onClick={() => router.push("/equipment")} className="font-black">
            العودة للقائمة
          </Button>
        </main>
      </div>
    )
  }

  const images = item.images?.length ? item.images : ["/placeholder-car.jpg"]
  const label = item.title || `${item.brand} ${item.model || ""}`.trim()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <Button variant="ghost" asChild className="mb-8 -mr-4 font-black">
          <Link href="/equipment">
            <ArrowRight className="h-4 w-4 ml-2" />
            جميع المعدات
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image
                src={images[selectedImage]}
                alt={label}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-4 ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8 text-right">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-end">
                <Badge className="font-black">{item.category}</Badge>
                <Badge variant="secondary" className="font-black">{item.status}</Badge>
                <Badge variant="outline" className="font-black">{item.condition}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter">{label}</h1>
              <p className="text-4xl font-[1000] text-primary">
                {item.price.toLocaleString()} <span className="text-xl">ج.م</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {item.year && (
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardContent className="p-4 flex items-center gap-3 justify-end">
                    <span className="font-black">{item.year}</span>
                    <Calendar className="h-5 w-5 text-primary" />
                  </CardContent>
                </Card>
              )}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3 justify-end">
                  <span className="font-black">{item.hours} ساعة</span>
                  <Gauge className="h-5 w-5 text-primary" />
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md rounded-2xl col-span-2">
                <CardContent className="p-4 flex items-center gap-3 justify-end">
                  <span className="font-black">{item.location}</span>
                  <MapPin className="h-5 w-5 text-primary" />
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2 justify-end">
                  الوصف
                  <Tractor className="h-6 w-6 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{item.description}</p>
              </CardContent>
            </Card>

            {item.features?.length > 0 && (
              <Card className="border-0 shadow-xl rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-right">المميزات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-right">
                    {item.features.map((f) => (
                      <li key={f} className="font-bold text-muted-foreground">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
