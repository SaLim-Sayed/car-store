import sys

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Enhance Details Grid
    target_details = """  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
  <dl className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05)] divide-y divide-border/60">
  {[
  { k: "الماركة", v: item.brand },
  { k: "الموديل", v: item.model || "—" },
  { k: "الحالة", v: item.condition },
  ].map((row) => (
  <div key={row.k} className="grid grid-cols-[minmax(6.5rem,34%)_1fr] gap-2 px-4 py-3.5 sm:px-5">
  <dt className="text-sm font-medium text-muted-foreground">{row.k}</dt>
  <dd className="text-sm font-semibold text-foreground">{row.v}</dd>
  </div>
  ))}
  </dl>
  <dl className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05)] divide-y divide-border/60">
  {[
  { k: "سنة الصنع", v: item.year ?? "—" },
  { k: "ساعات العمل", v: `${item.hours.toLocaleString("ar-EG")} ساعة` },
  { k: "الموقع", v: item.location },
  ].map((row) => (
  <div key={row.k} className="grid grid-cols-[minmax(6.5rem,34%)_1fr] gap-2 px-4 py-3.5 sm:px-5">
  <dt className="text-sm font-medium text-muted-foreground">{row.k}</dt>
  <dd className="text-sm font-semibold text-foreground">{row.v}</dd>
  </div>
  ))}
  </dl>
  </div>"""

    replacement_details = """  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[
      { label: "الماركة", value: item.brand, icon: <Tractor className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
      { label: "الموديل", value: item.model || "—", icon: <Tractor className="h-5 w-5 text-indigo-500" />, bg: "bg-indigo-50" },
      { label: "سنة الصنع", value: item.year ?? "—", icon: <Tractor className="h-5 w-5 text-orange-500" />, bg: "bg-orange-50" },
      { label: "الحالة", value: item.condition, icon: <Tractor className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
      { label: "ساعات العمل", value: `${item.hours.toLocaleString("ar-EG")} ساعة`, icon: <Gauge className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
      { label: "الموقع", value: item.location, icon: <MapPin className="h-5 w-5 text-rose-500" />, bg: "bg-rose-50" }
    ].map((row, idx) => (
      <div key={idx} className="group bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-neutral-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/20 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${row.bg}`}>
            {row.icon}
          </div>
          <span className="text-sm font-bold text-muted-foreground">{row.label}</span>
        </div>
        <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{row.value}</span>
      </div>
    ))}
  </div>"""

    content = content.replace(target_details, replacement_details)

    target_desc = """  <div className="rounded-2xl border border-border/65 bg-card p-7 shadow-[0_2px_12px_-4px_rgb(26_26_26/0.08)] lg:p-8">"""
    replacement_desc = """  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-0 ring-1 ring-neutral-100">"""
    content = content.replace(target_desc, replacement_desc)

    target_dealer_card = """<Card className="sticky top-32 overflow-hidden border border-border/60 bg-card shadow-[0_2px_12px_-4px_rgb(26_26_26/0.06)] rounded-2xl lg:rounded-[1.75rem]">
  <CardContent className="p-7 space-y-7 lg:p-8 lg:space-y-8">"""
    replacement_dealer_card = """<Card className="sticky top-32 overflow-hidden border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50">
  <CardContent className="p-8 space-y-8 relative isolate">
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />"""
    content = content.replace(target_dealer_card, replacement_dealer_card)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/app/equipment/[id]/page.tsx')
print("Done equipment/[id]/page.tsx")
