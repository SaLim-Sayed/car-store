"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { useCarStore } from "@/lib/store/carStore"

export function CarSearch() {
  const { filters, setFilters, clearFilters } = useCarStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (value: string) => {
    setFilters({ search: value })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث عن السيارات
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            فلاتر متقدمة
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="ابحث بالعلامة التجارية أو الموديل..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <Select
              value={filters.fuelType}
              onValueChange={(value) => handleFilterChange('fuelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="نوع الوقود" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                <SelectItem value="بنزين">بنزين</SelectItem>
                <SelectItem value="ديزل">ديزل</SelectItem>
                <SelectItem value="كهرباء">كهرباء</SelectItem>
                <SelectItem value="هايبرد">هايبرد</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.transmission}
              onValueChange={(value) => handleFilterChange('transmission', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ناقل الحركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                <SelectItem value="يدوي">يدوي</SelectItem>
                <SelectItem value="أوتوماتيك">أوتوماتيك</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="السعر الأدنى"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />

            <Input
              type="number"
              placeholder="السعر الأعلى"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
