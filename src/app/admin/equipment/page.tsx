"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2, Tractor } from "lucide-react"
import Link from "next/link"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog"
import { useEquipment, useDeleteEquipment, type Equipment } from "@/hooks/useEquipment"

export default function AdminEquipmentPage() {
 const { data, isLoading } = useEquipment(1, 100)
 const deleteMutation = useDeleteEquipment()
 const items = data?.data || []

 return (
 <div className="min-h-screen bg-[#F9F6F1]">
 <main className="container mx-auto px-4 pb-8">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
 <div className="space-y-4">
 <h1 className="text-5xl font-[1000] tracking-tighter">المعدات الزراعية</h1>
 <p className="text-muted-foreground text-xl font-medium">إدارة جرارات ومعدات ثقيلة</p>
 <div className="h-1.5 w-24 bg-primary rounded-full" />
 </div>
 <Button asChild className="h-14 px-8 rounded-2xl text-lg font-black shadow-none">
 <Link href="/admin/equipment/new">
 <Plus className="h-5 w-5 ml-2" />
 إضافة معدة
 </Link>
 </Button>
 </div>

 {isLoading ? (
 <div className="grid gap-6">
 {Array.from({ length: 3 }).map((_, i) => (
 <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />
 ))}
 </div>
 ) : items.length === 0 ? (
 <Card className="p-16 text-center border-0 shadow-none rounded-[2.5rem] bg-white">
 <Tractor className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
 <p className="text-xl font-black mb-6">لا توجد معدات بعد</p>
 <Button asChild className="font-black">
 <Link href="/admin/equipment/new">إضافة أول معدة</Link>
 </Button>
 </Card>
 ) : (
 <div className="grid gap-6">
 {items.map((item: Equipment) => (
 <Card key={item._id} className="border-0 shadow-none rounded-[2rem] bg-white overflow-hidden">
 <CardHeader className="p-6 pb-0">
 <div className="flex flex-col md:flex-row justify-between gap-4">
 <div className="text-right space-y-2">
 <CardTitle className="text-2xl font-black">
 {item.title || `${item.brand} ${item.model || ""}`}
 </CardTitle>
 <div className="flex flex-wrap gap-2 justify-end">
 <Badge>{item.category}</Badge>
 <Badge variant="secondary">{item.status}</Badge>
 {item.featured && <Badge className="bg-amber-500">مميز</Badge>}
 </div>
 </div>
 <span className="text-2xl font-[1000] text-primary">
 {item.price ? item.price.toLocaleString() : "حسب الطلب"} {item.price ? "ج.م" : ""}
 </span>
 </div>
 </CardHeader>
 <CardContent className="p-6 flex flex-wrap gap-3 justify-end">
 <Button variant="outline" asChild className="font-black rounded-xl">
 <Link href={`/admin/equipment/${item._id}/edit`}>
 <Pencil className="h-4 w-4 ml-2" />
 تعديل
 </Link>
 </Button>
 <Dialog>
 <DialogTrigger asChild>
 <Button variant="destructive" className="font-black rounded-xl">
 <Trash2 className="h-4 w-4 ml-2" />
 حذف
 </Button>
 </DialogTrigger>
 <DialogContent>
 <DialogHeader>
 <DialogTitle className="text-right font-black">تأكيد الحذف</DialogTitle>
 <DialogDescription className="text-right">
 سيتم حذف هذه المعدة نهائياً.
 </DialogDescription>
 </DialogHeader>
 <DialogFooter className="gap-2 sm:justify-start">
 <Button
 variant="destructive"
 className="font-black"
 onClick={() => deleteMutation.mutate(item._id)}
 >
 حذف
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </main>
 </div>
 )
}
