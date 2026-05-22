import sys

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Enhance Details Grid
    target_details = """  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-white rounded-2xl shadow-none overflow-hidden border border-gray-100">
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  الماركة
  </div>
  <div className="p-4 font-black">{car.brand}</div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  الموديل
  </div>
  <div className="p-4 font-black">{car.model}</div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  سنة الصنع
  </div>
  <div className="p-4 font-black">{car.year}</div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  اللون
  </div>
  <div className="p-4 font-black">{car.color}</div>
  </div>
  </div>
  <div className="bg-white rounded-2xl shadow-none overflow-hidden border border-gray-100">
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  تاريخ النشر
  </div>
  <div className="p-4 font-black">
  {new Date(car.createdAt).toLocaleDateString("ar-EG")}
  </div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  المسافة
  </div>
  <div className="p-4 font-black">
  {car.mileage.toLocaleString()} كم
  </div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  ناقل الحركة
  </div>
  <div className="p-4 font-black">{car.transmission}</div>
  </div>
  <div className="grid grid-cols-2 divide-x divide-gray-50 rtl:divide-x-reverse border-t border-gray-50">
  <div className="p-4 bg-gray-50/50 text-muted-foreground font-bold">
  نوع الوقود
  </div>
  <div className="p-4 font-black">{car.fuelType}</div>
  </div>
  </div>
  </div>"""

    replacement_details = """  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { label: "الماركة", value: car.brand, icon: <Car className="h-5 w-5 text-blue-500" />, bg: "bg-blue-50" },
      { label: "الموديل", value: car.model, icon: <Settings className="h-5 w-5 text-indigo-500" />, bg: "bg-indigo-50" },
      { label: "سنة الصنع", value: car.year, icon: <Calendar className="h-5 w-5 text-orange-500" />, bg: "bg-orange-50" },
      { label: "المسافة", value: `${car.mileage.toLocaleString()} كم`, icon: <Gauge className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-50" },
      { label: "ناقل الحركة", value: car.transmission, icon: <Settings className="h-5 w-5 text-purple-500" />, bg: "bg-purple-50" },
      { label: "الوقود", value: car.fuelType, icon: <Fuel className="h-5 w-5 text-rose-500" />, bg: "bg-rose-50" },
      { label: "اللون", value: car.color, icon: <Palette className="h-5 w-5 text-cyan-500" />, bg: "bg-cyan-50" },
      { label: "تاريخ النشر", value: new Date(car.createdAt).toLocaleDateString("ar-EG"), icon: <Calendar className="h-5 w-5 text-gray-500" />, bg: "bg-gray-100" }
    ].map((item, idx) => (
      <div key={idx} className="group bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-neutral-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/20 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${item.bg}`}>
            {item.icon}
          </div>
          <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
        </div>
        <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{item.value}</span>
      </div>
    ))}
  </div>"""

    content = content.replace(target_details, replacement_details)

    # Enhance Description
    target_desc = """  <div className="bg-white p-8 rounded-3xl shadow-none border border-gray-100">"""
    replacement_desc = """  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-0 ring-1 ring-neutral-100">"""
    content = content.replace(target_desc, replacement_desc)

    # Enhance Features
    target_features = """  <div className="bg-white p-8 rounded-3xl shadow-none border border-gray-100">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">"""
    replacement_features = """  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-0 ring-1 ring-neutral-100">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8">"""
    content = content.replace(target_features, replacement_features)

    target_dealer_card = """<Card className="sticky top-32 overflow-hidden border-2 border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem]">
  <CardContent className="p-8 space-y-8">"""
    replacement_dealer_card = """<Card className="sticky top-32 overflow-hidden border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50">
  <CardContent className="p-8 space-y-8 relative isolate">
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />"""
    content = content.replace(target_dealer_card, replacement_dealer_card)
    
    # Enhance buttons in contact card
    target_btn = """className="w-full h-16 rounded-2xl text-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-none shadow-blue-200"
  />
  <Button
  variant="outline"
  size="2xl"
  className="w-full h-16 rounded-2xl text-xl font-black border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/5 shadow-none shadow-green-50"
  >"""
    replacement_btn = """className="w-full h-14 rounded-xl text-lg bg-[#2563EB] hover:bg-blue-700 text-white shadow-[0_8px_20px_rgb(37,99,235,0.2)] transition-shadow"
  />
  <Button
  variant="outline"
  className="w-full h-14 rounded-xl text-lg font-black border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/5 shadow-none"
  >"""
    content = content.replace(target_btn, replacement_btn)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/app/cars/[id]/page.tsx')
print("Done cars/[id]/page.tsx")
