import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Tractor } from "lucide-react"
import type { Equipment } from "@/hooks/useEquipment"
import { useRouter } from "next/navigation"

interface EquipmentCardProps {
 equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
 const statusColor =
 equipment.status === "متاح"
 ? "bg-green-500 text-white"
 : equipment.status === "مباع"
 ? "bg-red-500 text-white"
 : "bg-amber-500 text-white"

 const image = equipment.images?.[0] || "/placeholder-car.jpg"
 const label = equipment.title || `${equipment.brand} ${equipment.model || ""}`.trim()
 const router = useRouter()
 return (
 <Card onClick={() => router.push(`/equipment/${equipment._id}`)} cursor-pointer className="group flex h-full min-h-0 flex-col overflow-hidden border-0 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:rounded-[2rem]">
 <CardHeader className="shrink-0 p-0">
 <div className="relative h-36 md:h-44 overflow-hidden">
 <Image
 src={image}
 alt={label}
 fill
 className="object-cover group- transition-transform duration-1000"
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
 />
 <Badge className={`absolute top-2.5 right-2.5 md:top-4 md:right-4 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-black border-0 shadow-none ${statusColor}`}>
 {equipment.status}
 </Badge>
 <Badge className="absolute top-2.5 left-2.5 md:top-4 md:left-4 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-sm font-black border-0 bg-[#1A1A1A] text-[#D97706]">
 {equipment.category}
 </Badge>
 </div>
 </CardHeader>

 <CardContent className="flex flex-1 flex-col gap-2 p-3 pb-4 text-right md:gap-3 md:p-4 md:pb-4">
 <div className="flex flex-col gap-2">
 <div className="flex justify-between items-start gap-4">
 <span className="text-base md:text-2xl font-[1000] text-primary shrink-0">
 {equipment.price.toLocaleString()} <span className="text-xs md:text-base">ج.م</span>
 </span>
 <h3 className="text-sm md:text-xl font-black text-foreground group-hover:text-primary transition-colors">
 {label}
 </h3>
 </div>
 </div>

 <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 py-2 md:py-3 border-y border-gray-50">
 {equipment.year && (
 <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl">
 <span className="text-xs md:text-sm font-black">{equipment.year}</span>
 <Calendar className="h-4 w-4 text-primary" />
 </div>
 )}
 <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl">
 <span className="text-xs md:text-sm font-black">{equipment.condition}</span>
 <Tractor className="h-4 w-4 text-primary" />
 </div>
 <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl">
 <span className="text-xs md:text-sm font-black">{equipment.location}</span>
 <MapPin className="h-4 w-4 text-primary" />
 </div>
 </div>

 <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-8 md:min-h-11 text-right font-medium">
 {equipment.description.replace(/<[^>]*>?/gm, "")}
 </p>

 <Button asChild className="mt-auto w-full h-9 shrink-0 rounded-lg bg-[#1A1A1A] text-xs font-bold shadow-none transition-all hover:bg-black hover:shadow-none md:h-10 md:rounded-xl md:text-sm md:shadow-none">
 <Link href={`/equipment/${equipment._id}`}>عرض التفاصيل</Link>
 </Button>
 </CardContent>
 </Card>
 )
}
