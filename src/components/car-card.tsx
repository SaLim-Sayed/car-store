import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car as CarIcon, Fuel, Settings, Calendar } from "lucide-react"

interface CarCardProps {
  car: {
    _id: string
    brand: string
    model: string
    year: number
    price: number
    fuelType: string
    transmission: string
    mileage: number
    color: string
    description: string
    images: string[]
    status: string
    createdAt: string
  }
}

export function CarCard({ car }: CarCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-500 text-white"
      case "مباع":
        return "bg-red-500 text-white"
      case "محجوز":
        return "bg-amber-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 bg-white">
      <CardHeader className="p-0">
        <div className="relative h-72 overflow-hidden">
          <Image
            src={car.images[0] || "/placeholder-car.jpg"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge 
            className={`absolute top-6 right-6 px-6 py-2 rounded-full text-sm font-black border-0 shadow-lg ${getStatusColor(car.status)}`}
          >
            {car.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-6 text-right">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-3xl font-[1000] text-primary">
              {car.price.toLocaleString()} <span className="text-lg">ج.م</span>
            </span>
            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
              {car.brand} {car.model}
            </h3>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-end gap-3 py-4 border-y border-gray-50">
          <div className="flex items-center gap-2 text-muted-foreground bg-gray-50 px-3 py-1.5 rounded-xl">
            <span className="text-sm font-black">{car.year}</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-gray-50 px-3 py-1.5 rounded-xl">
            <span className="text-sm font-black">{car.transmission}</span>
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-gray-50 px-3 py-1.5 rounded-xl">
            <span className="text-sm font-black">{car.fuelType}</span>
            <Fuel className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed h-12 text-right font-medium">
          {car.description.replace(/<[^>]*>?/gm, '')}
        </p>

        <Button asChild className="w-full h-16 rounded-2xl text-xl font-black bg-[#1A1A1A] hover:bg-black transition-all shadow-xl hover:shadow-black/20">
          <Link href={`/cars/${car._id}`}>
            عرض التفاصيل
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
