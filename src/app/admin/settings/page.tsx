"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Phone, Mail, Globe, MapPin, Link as LinkIcon } from "lucide-react"
import { useSettings, useUpdateSettings, type SettingsData } from "@/hooks/useSettings"
import { toEnglishDigits } from "@/lib/utils"

export default function AdminSettingsPage() {
  const { data, isLoading } = useSettings()
  const updateMutation = useUpdateSettings()
  const [form, setForm] = useState<SettingsData>({
    phoneDisplay: "",
    phoneE164: "",
    facebook: "",
    instagram: "",
    twitter: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    if (data?.data) {
      setForm({
        phoneDisplay: data.data.phoneDisplay || "",
        phoneE164: data.data.phoneE164 || "",
        facebook: data.data.facebook || "",
        instagram: data.data.instagram || "",
        twitter: data.data.twitter || "",
        email: data.data.email || "",
        address: data.data.address || "",
      })
    }
  }, [data])

  const set = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      ...form,
      phoneDisplay: toEnglishDigits(form.phoneDisplay),
      phoneE164: toEnglishDigits(form.phoneE164),
    })
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 pb-8 border-b border-slate-200">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">إعدادات الموقع</h1>
            <p className="text-sm text-slate-500 font-bold mt-1">تعديل أرقام التواصل وروابط السوشيال ميديا للموقع بالكامل.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          {/* Contact Details */}
          <Card className="border-0 shadow-sm rounded-xl ring-1 ring-slate-100 bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                معلومات الاتصال الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-black text-slate-700">رقم الهاتف (للعرض)</Label>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={form.phoneDisplay}
                      onChange={(e) => set("phoneDisplay", e.target.value)}
                      placeholder="+20 109 903 9480"
                      className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-primary font-bold"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-black text-slate-700">رقم الواتساب (للرابط)</Label>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={form.phoneE164}
                      onChange={(e) => set("phoneE164", e.target.value)}
                      placeholder="201099039480"
                      className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-primary font-bold"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">يجب أن يبدأ بكود الدولة بدون + (مثال: 2010...)</p>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-black text-slate-700">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="info@carstore.com"
                      className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-primary font-bold"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-black text-slate-700">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="مدينة المنيا، مصر"
                      className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-primary font-bold"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-0 shadow-sm rounded-xl ring-1 ring-slate-100 bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                روابط التواصل الاجتماعي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">رابط فيسبوك</Label>
                <div className="relative">
                  <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <Input
                    value={form.facebook}
                    onChange={(e) => set("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-blue-500 font-bold text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">رابط انستجرام</Label>
                <div className="relative">
                  <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                  <Input
                    value={form.instagram}
                    onChange={(e) => set("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-pink-500 font-bold text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">رابط تويتر (X)</Label>
                <div className="relative">
                  <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                  <Input
                    value={form.twitter}
                    onChange={(e) => set("twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="h-12 bg-slate-50 border-slate-200 pr-10 focus-visible:ring-sky-500 font-bold text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 text-lg"
          >
            {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </main>
    </div>
  )
}
