"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Users,
  Plus,
  Search,
  UserCheck,
  UserX,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react"
import Link from "next/link"
import { FormattedDate } from "@/components/formatted-date"
import { ArrowRight } from "lucide-react"

interface UserDoc {
  _id: string
  name: string
  email: string
  role: "admin" | "user"
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      } else {
        toast.error("فشل في جلب المستخدمين")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = "الاسم مطلوب"
    if (!form.email.trim()) errors.email = "البريد الإلكتروني مطلوب"
    if (!form.password) errors.password = "كلمة المرور مطلوبة"
    else if (form.password.length < 6) errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setCreateLoading(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("تم إنشاء المستخدم بنجاح")
        setUsers((prev) => [data.data, ...prev])
        setForm({ name: "", email: "", password: "", role: "user" })
        setShowCreateForm(false)
      } else {
        toast.error(data.error || "فشل في إنشاء المستخدم")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setCreateLoading(false)
    }
  }

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
 
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white">
                <Link href="/admin/dashboard" className="flex items-center text-muted-foreground hover:text-primary font-black">
                  <ArrowRight className="h-4 w-4 ml-2" />
                  لوحة التحكم
                </Link>
              </Button>
            </div>
            <h1 className="text-5xl font-[1000] tracking-tighter">إدارة المستخدمين</h1>
            <p className="text-muted-foreground text-xl font-medium">عرض وإضافة مستخدمي النظام والمسؤولين</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          
          <Button onClick={() => setShowCreateForm((v) => !v)} className="rounded-2xl h-14 px-8 text-lg font-black shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 ml-2" />
            إضافة مستخدم جديد
          </Button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <Card className="mb-12 border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-top-8 duration-500">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <UserIcon className="h-6 w-6 text-primary" />
                إنشاء مستخدم جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCreateUser} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="create-name" className="text-lg font-black">الاسم الكامل *</Label>
                    <Input
                      id="create-name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                      className={`h-14 rounded-2xl border-2 px-6 font-bold ${formErrors.name ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 font-bold">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="create-email" className="text-lg font-black">البريد الإلكتروني *</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="example@email.com"
                      className={`h-14 rounded-2xl border-2 px-6 font-bold ${formErrors.email ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 font-bold">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="create-password" className="text-lg font-black">كلمة المرور *</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className={`h-14 rounded-2xl border-2 px-6 font-bold ${formErrors.password ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-500 font-bold">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="create-role" className="text-lg font-black">الصلاحية *</Label>
                    <select
                      id="create-role"
                      value={form.role}
                      onChange={(e) => setField("role", e.target.value)}
                      className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="user">مستخدم عادي</option>
                      <option value="admin">مسؤول</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl h-14 px-8 text-lg font-black border-2"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createLoading} className="rounded-2xl h-14 px-10 text-lg font-black shadow-lg shadow-primary/20">
                    {createLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-8 border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="relative group">
              <Search className="absolute right-6 top-4 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 pr-16 rounded-2xl border-2 border-gray-50 focus:border-primary text-lg font-bold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <Users className="h-6 w-6 text-primary" />
              قائمة المستخدمين ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-8 font-black text-muted-foreground text-sm uppercase tracking-wider">الاسم</th>
                      <th className="p-8 font-black text-muted-foreground text-sm uppercase tracking-wider">البريد الإلكتروني</th>
                      <th className="p-8 font-black text-muted-foreground text-sm uppercase tracking-wider">الصلاحية</th>
                      <th className="p-8 font-black text-muted-foreground text-sm uppercase tracking-wider">الحالة</th>
                      <th className="p-8 font-black text-muted-foreground text-sm uppercase tracking-wider text-left">تاريخ الإنشاء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-black text-primary shadow-inner">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-black text-lg">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className="font-bold text-muted-foreground">{user.email}</span>
                        </td>
                        <td className="p-8">
                          {user.role === "admin" ? (
                            <Badge className="bg-purple-100 text-purple-700 border-0 rounded-full px-4 py-1.5 font-black flex w-fit items-center">
                              <ShieldCheck className="h-4 w-4 ml-2" />
                              مسؤول
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full px-4 py-1.5 font-black flex w-fit items-center">
                              <UserIcon className="h-4 w-4 ml-2" />
                              مستخدم
                            </Badge>
                          )}
                        </td>
                        <td className="p-8">
                          {user.isActive ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full px-4 py-1.5 font-black flex w-fit items-center">
                              <UserCheck className="h-4 w-4 ml-2" />
                              نشط
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-100 text-rose-700 border-0 rounded-full px-4 py-1.5 font-black flex w-fit items-center">
                              <UserX className="h-4 w-4 ml-2" />
                              معطل
                            </Badge>
                          )}
                        </td>
                        <td className="p-8 text-left">
                          <span className="font-bold text-muted-foreground">
                            <FormattedDate value={user.createdAt?.slice(0, 10) || user.createdAt} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-20 bg-white">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <Users className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-2xl font-[1000] mb-2 tracking-tight">لا يوجد مستخدمون</h3>
                    <p className="text-muted-foreground text-lg font-medium">
                      {searchTerm ? "لا توجد نتائج مطابقة لبحثك حالياً" : "لم يتم إضافة أي مستخدمين للنظام بعد"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
