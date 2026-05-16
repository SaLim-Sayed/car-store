"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Edit, Store, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useShowrooms, useDeleteShowroom } from "@/hooks/useContent"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
 DialogClose,
} from "@/components/ui/dialog"

export default function AdminShowrooms() {
 const { data: showroomsData, isLoading } = useShowrooms()
 const deleteMutation = useDeleteShowroom()

 const showrooms = showroomsData?.data || []

 return (
 <div className="min-h-screen bg-[#F9F6F1]">
 
 <main className="container mx-auto px-4 pb-8">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
 <div className="space-y-4">
 <h1 className="text-5xl font-[1000] tracking-tighter">إدارة المعارض</h1>
 <p className="text-muted-foreground text-xl font-medium">إدارة معارض السيارات المسجلة والشركاء</p>
 <div className="h-1.5 w-24 bg-primary rounded-full" />
 </div>
 
 <Button asChild className="rounded-2xl h-14 px-8 text-lg font-black shadow-none shadow-primary/20">
 <Link href="/admin/showrooms/new" className="flex items-center">
 <Plus className="h-5 w-5 ml-2" />
 إضافة معرض جديد
 </Link>
 </Button>
 </div>

 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {Array.from({ length: 6 }).map((_, i) => (
 <Card key={i} className="border-0 shadow-none rounded-[2.5rem] bg-white overflow-hidden">
 <CardContent className="p-8 space-y-6">
 <div className="flex items-center gap-6">
 <Skeleton className="h-16 w-16 rounded-2xl" />
 <Skeleton className="h-8 w-1/2" />
 </div>
 <Skeleton className="h-6 w-full" />
 <Skeleton className="h-6 w-3/4" />
 <Skeleton className="h-12 w-full rounded-xl" />
 </CardContent>
 </Card>
 ))}
 </div>
 ) : showrooms.length === 0 ? (
 <Card className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center bg-white">
 <p className="text-2xl font-black text-muted-foreground mb-6">لا توجد معارض حالياً</p>
 <Button asChild variant="outline" className="rounded-2xl h-12 px-6">
 <Link href="/admin/showrooms/new">ابدأ بإضافة أول معرض</Link>
 </Button>
 </Card>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {showrooms.map((showroom: any) => (
 <Card key={showroom._id} className="border-0 shadow-none rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-none transition-all duration-500">
 <CardContent className="p-8 space-y-6">
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-6">
 <div className="h-20 w-20 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-gray-100 overflow-hidden shadow-none">
 {showroom.logo ? (
 <img src={showroom.logo} alt={showroom.name} className="w-full h-full object-cover" />
 ) : (
 <Store className="h-10 w-10 text-primary opacity-40" />
 )}
 </div>
 <div className="space-y-1">
 <CardTitle className="text-2xl font-black">{showroom.name}</CardTitle>
 {showroom.featured && (
 <div className="flex items-center gap-1.5 text-amber-600">
 <CheckCircle className="h-4 w-4" />
 <span className="text-sm font-black uppercase tracking-wider">شريك متميز</span>
 </div>
 )}
 </div>
 </div>
 </div>

 <div className="space-y-4 pt-2">
 <div className="flex items-center gap-3 text-muted-foreground font-bold">
 <MapPin className="h-5 w-5 text-primary shrink-0" />
 <span className="line-clamp-1">{showroom.address}</span>
 </div>
 <div className="flex items-center gap-3 text-muted-foreground font-bold">
 <Phone className="h-5 w-5 text-primary shrink-0" />
 <span>{showroom.phone}</span>
 </div>
 {showroom.email && (
 <div className="flex items-center gap-3 text-muted-foreground font-bold">
 <Mail className="h-5 w-5 text-primary shrink-0" />
 <span className="line-clamp-1">{showroom.email}</span>
 </div>
 )}
 </div>

 <div className="flex gap-3 pt-4">
 <Button variant="outline" asChild className="flex-1 rounded-xl h-12 font-bold border-2">
 <Link href={`/admin/showrooms/edit/${showroom._id}`}>
 <Edit className="h-4 w-4 ml-2" />
 تعديل
 </Link>
 </Button>
 
 <Dialog>
 <DialogTrigger asChild>
 <Button variant="outline" className="w-12 h-12 rounded-xl border-2 text-destructive hover:bg-destructive/10">
 <Trash2 className="h-5 w-5" />
 </Button>
 </DialogTrigger>
 <DialogContent className="rounded-[2.5rem] p-10 border-0 shadow-none">
 <DialogHeader className="space-y-4">
 <DialogTitle className="text-2xl font-black">هل أنت متأكد من الحذف؟</DialogTitle>
 <DialogDescription className="text-lg font-medium leading-relaxed">
 سيتم حذف المعرض وبياناته نهائياً. لن يؤثر هذا على السيارات المرتبطة به ولكن يفضل نقلها أولاً.
 </DialogDescription>
 </DialogHeader>
 <DialogFooter className="mt-8 gap-4">
 <DialogClose asChild>
 <Button variant="outline" className="rounded-2xl h-14 px-8 text-lg font-black border-2">إلغاء</Button>
 </DialogClose>
 <Button 
 onClick={() => deleteMutation.mutate(showroom._id)}
 className="rounded-2xl h-14 px-8 text-lg font-black bg-destructive hover:bg-destructive/90"
 >
 تأكيد الحذف
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </main>
 </div>
 )
}
