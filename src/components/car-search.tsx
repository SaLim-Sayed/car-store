"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
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
 <Card className="border-0 shadow-none rounded-2xl md:rounded-[2rem] bg-white overflow-hidden">
 <CardContent className="p-3 md:p-6 space-y-3 md:space-y-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="ابحث بالعلامة التجارية أو الموديل..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-11 md:h-14 pr-11 md:pr-12 pl-5 rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:ring-primary/20 transition-all text-sm md:text-base font-bold"
              />
            </div>
            <div className="flex gap-2 md:gap-4">
              <Button
                variant={isExpanded ? "default" : "secondary"}
                className={`flex-1 md:flex-none h-11 md:h-14 px-4 md:px-6 rounded-xl text-sm md:text-base font-black transition-all ${
                  isExpanded ? "bg-[#1A1A1A] hover:bg-black text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Filter className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                تصفية
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="flex-1 md:flex-none h-11 md:h-14 px-3 md:px-5 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold shadow-none"
                >
                  <X className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                  مسح الكل
                </Button>
              )}
            </div>
          </div>

        {isExpanded && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-1.5 md:space-y-2">
              <p className="text-xs md:text-sm font-bold text-muted-foreground mr-1">نوع الوقود</p>
              <Select
                dir="rtl"
                value={filters.fuelType}
                onValueChange={(value) => handleFilterChange('fuelType', value)}
              >
                <SelectTrigger className="h-11 md:h-12 rounded-xl border-2 border-gray-50 bg-gray-50 font-bold focus:ring-primary/20">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-100 shadow-xl">
                  <SelectItem value="null">الكل</SelectItem>
                  <SelectItem value="بنزين">بنزين</SelectItem>
                  <SelectItem value="كهرباء">كهرباء</SelectItem>
                  <SelectItem value="غاز طبيعي">غاز طبيعي</SelectItem>
                  <SelectItem value="غاز">غاز</SelectItem>
                  <SelectItem value="سولار">سولار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <p className="text-xs md:text-sm font-bold text-muted-foreground mr-1">ناقل الحركة</p>
              <Select
                dir="rtl"
                value={filters.transmission}
                onValueChange={(value) => handleFilterChange('transmission', value)}
              >
                <SelectTrigger className="h-11 md:h-12 rounded-xl border-2 border-gray-50 bg-gray-50 font-bold focus:ring-primary/20">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-100 shadow-xl">
                  <SelectItem value="null">الكل</SelectItem>
                  <SelectItem value="يدوي">يدوي</SelectItem>
                  <SelectItem value="أوتوماتيك">أوتوماتيك</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <p className="text-xs md:text-sm font-bold text-muted-foreground mr-1">السعر الأدنى</p>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="h-11 md:h-12 rounded-xl border-2 border-gray-50 bg-gray-50 font-bold focus:bg-white focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <p className="text-xs md:text-sm font-bold text-muted-foreground mr-1">السعر الأعلى</p>
              <Input
                type="number"
                placeholder="بلا حدود"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="h-11 md:h-12 rounded-xl border-2 border-gray-50 bg-gray-50 font-bold focus:bg-white focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>
        )}
 </CardContent>
 </Card>
 )
}
