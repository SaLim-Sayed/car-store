"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
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
import { FormattedDate } from "@/components/formatted-date"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/pagination"
import { Trash2 } from "lucide-react"

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
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

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

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = "الاسم مطلوب"
    if (!form.email.trim()) errors.email = "البريد الإلكتروني مطلوب"
    if (!form.password) errors.password = "كلمة المرور مطلوبة"
    else if (form.password.length < 6) errors.password = "يجب أن تكون 6 أحرف على الأقل"
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

  const handleDeleteUser = async (userId: string) => {
    setDeleteLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        toast.success("تم حذف المستخدم بنجاح")
        setUsers((prev) => prev.filter((u) => u._id !== userId))
      } else {
        toast.error(data.error || "فشل في حذف المستخدم")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setDeleteLoading(null)
    }
  }

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إدارة المستخدمين</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              إدارة حسابات المستخدمين وصلاحيات المسؤولين. يمكنك إضافة مستخدمين جدد والتحكم في إمكانية وصولهم.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button 
              onClick={() => setShowCreateForm((v) => !v)} 
              className="h-11 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 px-6"
            >
              <Plus className="h-5 w-5 ml-2" />
              إضافة مستخدم جديد
            </Button>
          </div>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <Card className="mt-8 border border-slate-100 shadow-xl shadow-slate-200/40 rounded-xl bg-white overflow-hidden animate-in fade-in slide-in-from-top-8 duration-500">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                إنشاء مستخدم جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="create-name" className="text-sm font-black text-slate-700">الاسم الكامل <span className="text-rose-500">*</span></Label>
                    <Input
                      id="create-name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                      className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", formErrors.name && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 font-bold">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="create-email" className="text-sm font-black text-slate-700">البريد الإلكتروني <span className="text-rose-500">*</span></Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="example@email.com"
                      className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold text-left", formErrors.email && "border-rose-500 focus-visible:ring-rose-500")}
                      dir="ltr"
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-500 font-bold">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="create-password" className="text-sm font-black text-slate-700">كلمة المرور <span className="text-rose-500">*</span></Label>
                    <PasswordInput
                      id="create-password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", formErrors.password && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {formErrors.password && (
                      <p className="text-xs text-rose-500 font-bold">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="create-role" className="text-sm font-black text-slate-700">الصلاحية <span className="text-rose-500">*</span></Label>
                    <select
                      id="create-role"
                      value={form.role}
                      onChange={(e) => setField("role", e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      <option value="user">مستخدم عادي</option>
                      <option value="admin">مسؤول نظام</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl h-11 px-6 text-sm font-black border-slate-200"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createLoading} className="rounded-xl h-11 px-8 text-sm font-black bg-primary hover:bg-primary/90 text-white">
                    {createLoading ? "جاري الإنشاء..." : "حفظ المستخدم"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Search bar */}
          <div className="relative group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-purple-600 transition-colors" />
            <Input
              placeholder="ابحث باسم المستخدم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 rounded-lg border-slate-200 shadow-sm pr-12 pl-6 text-sm font-bold bg-white focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
          </div>

          <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                سجل المستخدمين ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredUsers.length > 0 ? (
                <table className="w-full text-right border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-y border-slate-100/80 text-slate-500 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-bold bg-slate-50/50">
                      <th className="py-2.5 px-4 pr-8">المستخدم</th>
                      <th className="py-2.5 px-4">البريد الإلكتروني</th>
                      <th className="py-2.5 px-4">الصلاحية</th>
                      <th className="py-2.5 px-4">الحالة</th>
                      <th className="py-2.5 px-4 text-center">تاريخ الإنشاء</th>
                      <th className="py-2.5 px-4 pl-8 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 bg-white">
                    {paginatedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-2.5 px-4 pr-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-[1000] text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-slate-500 text-sm" dir="ltr">{user.email}</span>
                        </td>
                        <td className="py-2.5 px-4 text-sm font-bold">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-xs font-black">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              مسؤول
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs font-black">
                              <UserIcon className="h-3.5 w-3.5" />
                              مستخدم
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black">
                              <UserCheck className="h-3.5 w-3.5" />
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 text-xs font-black">
                              <UserX className="h-3.5 w-3.5" />
                              معطل
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="font-bold text-slate-500 text-xs">
                            <FormattedDate value={user.createdAt?.slice(0, 10) || user.createdAt} />
                          </span>
                        </td>
                        <td className="py-2.5 px-4 pl-8 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl">
                                <DialogHeader className="space-y-3">
                                  <DialogTitle className="text-xl font-bold text-slate-900">حذف المستخدم؟</DialogTitle>
                                  <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
                                    سيتم حذف {user.name} نهائياً من النظام ولن يتمكن من تسجيل الدخول بعد الآن.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6 gap-3">
                                  <DialogClose asChild>
                                    <Button variant="outline" className="rounded-xl h-11 px-6 text-sm font-black border-slate-200">إلغاء</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={() => handleDeleteUser(user._id)}
                                    disabled={deleteLoading === user._id}
                                    className="rounded-xl h-11 px-6 text-sm font-black bg-rose-600 hover:bg-rose-700 text-white"
                                  >
                                    {deleteLoading === user._id ? "جاري الحذف..." : "تأكيد الحذف"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-slate-500 text-sm font-bold flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-[1000] text-slate-700">لا يوجد مستخدمون</h3>
                  <p className="text-slate-500 font-medium">
                    {searchTerm ? "لا توجد نتائج مطابقة لبحثك حالياً" : "لم يتم إضافة أي مستخدمين للنظام بعد"}
                  </p>
                </div>
              )}
            </CardContent>

            <Pagination
              variant="admin"
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              pageSize={itemsPerPage}
              itemLabel="مستخدم"
            />
          </Card>
        </div>
      </main>
    </div>
  )
}
