import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fuel, Settings, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarCardProps {
 car: {
 _id: string;
 brand: string;
 model: string;
 year: number;
 price: number;
 fuelType: string;
 transmission: string;
 mileage: number;
 color: string;
 description: string;
 images: string[];
 status: string;
 createdAt: string;
 };
}

export function CarCard({ car }: CarCardProps) {
 const getStatusColor = (status: string) => {
 switch (status) {
 case "متاح":
 return "bg-green-500 text-white";
 case "مباع":
 return "bg-red-500 text-white";
 case "محجوز":
 return "bg-amber-500 text-white";
 default:
 return "bg-gray-500 text-white";
 }
 };

 const router = useRouter()
 return (
 <Card onClick={() => router.push(`/cars/${car._id}`)} cursor-pointer className="group flex h-full min-h-0 flex-col overflow-hidden border border-gray-200 rounded-lg bg-white shadow-none transition-all duration-300 hover:shadow-sm">
 <CardHeader className="shrink-0 p-0">
 <div className="relative h-36 overflow-hidden sm:h-40 md:h-44">
 <Image
 src={car.images[0] || "/placeholder-car.jpg"}
 alt={`${car.brand} ${car.model}`}
 fill
 className="object-cover group- transition-transform duration-1000"
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
 <Badge
 className={`absolute top-2.5 right-2.5 md:top-4 md:right-4 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-black border-0 shadow-none ${getStatusColor(car.status)}`}
 >
 {car.status}
 </Badge>
 </div>
 </CardHeader>

 <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-3 pb-4 text-right md:gap-3 md:p-4 md:pb-4">
 <div className="space-y-2">
 <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-snug text-foreground transition-colors group-hover:text-primary md:min-h-11 md:text-base">
 {car.brand} {car.model}
 </h3>
 <span className="block text-base font-[1000] text-primary md:text-xl">
 {car.price.toLocaleString()}{" "}
 <span className="text-xs font-black md:text-base">ج.م</span>
 </span>
 </div>

 <div className="flex flex-wrap items-center justify-end gap-2 border-y border-gray-100 py-2.5 md:gap-2.5 md:py-3">
 <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-muted-foreground md:rounded-xl md:px-3 md:py-2">
 <span className="text-xs font-black md:text-sm">{car.year}</span>
 <Calendar className="h-3.5 w-3.5 shrink-0 text-primary md:h-4 md:w-4" />
 </div>
 <div className="flex max-w-[48%] items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-muted-foreground md:max-w-none md:rounded-xl md:px-3 md:py-2">
 <span className="truncate text-xs font-black md:text-sm">
 {car.transmission}
 </span>
 <Settings className="h-3.5 w-3.5 shrink-0 text-primary md:h-4 md:w-4" />
 </div>
 <div className="flex max-w-[48%] items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-muted-foreground md:max-w-none md:rounded-xl md:px-3 md:py-2">
 <span className="truncate text-xs font-black md:text-sm">
 {car.fuelType}
 </span>
 <Fuel className="h-3.5 w-3.5 shrink-0 text-primary md:h-4 md:w-4" />
 </div>
 </div>

 <Button
 asChild
 className="mt-auto w-full h-9 shrink-0 rounded-lg bg-[#1A1A1A] text-xs font-bold shadow-none transition-all hover:bg-black hover:shadow-none md:h-10 md:rounded-xl md:text-sm md:shadow-none"
 >
 <Link href={`/cars/${car._id}`}>عرض التفاصيل</Link>
 </Button>
 </CardContent>
 </Card>
 );
}
