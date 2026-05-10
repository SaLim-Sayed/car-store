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
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ArrowRight className="h-4 w-4 ml-1" />
              لوحة التحكم
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">عرض وإضافة مستخدمي النظام</p>
          </div>
          <Button onClick={() => setShowCreateForm((v) => !v)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <Card className="mb-8 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                إنشاء مستخدم جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-name">الاسم الكامل *</Label>
                    <Input
                      id="create-name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-email">البريد الإلكتروني *</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="example@email.com"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-password">كلمة المرور *</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className={formErrors.password ? "border-red-500" : ""}
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-500">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-role">الصلاحية *</Label>
                    <select
                      id="create-role"
                      value={form.role}
                      onChange={(e) => setField("role", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="user">مستخدم عادي</option>
                      <option value="admin">مسؤول</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              قائمة المستخدمين ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right pb-3 font-medium">الاسم</th>
                      <th className="text-right pb-3 font-medium">البريد الإلكتروني</th>
                      <th className="text-right pb-3 font-medium">الصلاحية</th>
                      <th className="text-right pb-3 font-medium">الحالة</th>
                      <th className="text-right pb-3 font-medium">تاريخ الإنشاء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {user.name.charAt(0)}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{user.email}</td>
                        <td className="py-3">
                          {user.role === "admin" ? (
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              <ShieldCheck className="h-3 w-3 ml-1" />
                              مسؤول
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <UserIcon className="h-3 w-3 ml-1" />
                              مستخدم
                            </Badge>
                          )}
                        </td>
                        <td className="py-3">
                          {user.isActive ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <UserCheck className="h-3 w-3 ml-1" />
                              نشط
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              <UserX className="h-3 w-3 ml-1" />
                              معطل
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground text-sm">
                          {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">لا يوجد مستخدمون</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "لا توجد نتائج مطابقة" : "لم يتم إضافة أي مستخدمين بعد"}
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
