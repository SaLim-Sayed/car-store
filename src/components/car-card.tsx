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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "مباع":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "محجوز":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={car.images[0] || "/placeholder-car.jpg"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
          <Badge 
            className={`absolute top-2 left-2 ${getStatusColor(car.status)}`}
          >
            {car.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">
            {car.brand} {car.model}
          </h3>
          <span className="text-xl font-bold text-primary">
            {car.price.toLocaleString()} ج.م
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {car.year}
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            {car.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            {car.transmission}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {car.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/cars/${car._id}`}>
            عرض التفاصيل
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
