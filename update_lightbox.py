import sys

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update cars/[id]/page.tsx
    target_car_header = """  {/* Lightbox Header */}
  <div className="absolute top-0 inset-x-0 p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
  <div className="flex flex-col gap-1">
  <h2 className="text-white text-xl md:text-2xl font-black">{car.brand} {car.model} {car.year}</h2>
  <div className="flex items-center gap-4">
  <p className="text-primary text-2xl font-black">{car.price ? `${car.price.toLocaleString()} ج.م` : "حسب الطلب"}</p>
  <div className="hidden md:flex gap-2">
  <Badge variant="outline" className="border-white/20 text-white/60">{car.transmission}</Badge>
  <Badge variant="outline" className="border-white/20 text-white/60">{car.fuelType}</Badge>
  </div>
  </div>
  </div>
  
  <div className="flex items-center gap-4">
  <div className="hidden md:flex gap-3 mr-8">
  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-bold px-6">
  <Phone className="h-4 w-4 ml-2" />
  اتصال
  </Button>
  <Button variant="outline" size="sm" className="bg-[#22C55E] border-0 text-white hover:bg-green-600 rounded-xl font-bold px-6">
  <MessageSquare className="h-4 w-4 ml-2" />
  واتساب
  </Button>
  </div>
  <Button 
  variant="ghost" 
  size="icon" 
  onClick={() => setIsLightboxOpen(false)}
  className="text-white hover:bg-white/10 rounded-full h-12 w-12"
  >
  <X className="h-8 w-8" />
  </Button>
  </div>
  </div>"""
    
    replacement_car_header = """  {/* Lightbox Header */}
  <div className="absolute top-0 inset-x-0 p-4 md:p-5 z-50 flex justify-between items-start bg-[#1c1c1c]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
    {/* Right Side: Title & Badges */}
    <div className="flex flex-col gap-3">
      <h2 className="text-white text-xl md:text-2xl font-black">
        {car.brand} {car.model} {car.year} للبيع
      </h2>
      <div className="hidden md:flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1 gap-1.5"><Calendar className="h-3.5 w-3.5" />{car.year}</Badge>
        <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1 gap-1.5"><Gauge className="h-3.5 w-3.5" />{car.mileage.toLocaleString()} كم</Badge>
        <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1 gap-1.5"><Settings className="h-3.5 w-3.5" />{car.transmission}</Badge>
        <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1 gap-1.5"><Fuel className="h-3.5 w-3.5" />{car.fuelType}</Badge>
      </div>
    </div>
    
    {/* Left Side: Close, Price, Buttons */}
    <div className="flex items-start gap-4 md:gap-8">
      <div className="flex flex-col items-end gap-3">
        <p className="text-white text-xl md:text-[1.7rem] font-black tabular-nums tracking-tighter">
          {car.price ? `${car.price.toLocaleString("ar-EG")} جنيه` : "حسب الطلب"}
        </p>
        <div className="hidden md:flex gap-3">
          <Button variant="outline" size="sm" className="bg-white border-0 text-[#2563EB] hover:bg-gray-100 rounded-lg font-bold px-6 h-9">
            <Phone className="h-4 w-4 ml-2" />
            اتصال
          </Button>
          <Button variant="outline" size="sm" className="bg-white border-0 text-[#22C55E] hover:bg-gray-100 rounded-lg font-bold px-6 h-9">
            <MessageSquare className="h-4 w-4 ml-2" />
            واتساب
          </Button>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsLightboxOpen(false)}
        className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 shrink-0 bg-white/5"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  </div>"""

    content = content.replace(target_car_header, replacement_car_header)
    
    target_thumb = 'swiper-slide-thumb-active:ring-primary'
    replacement_thumb = 'swiper-slide-thumb-active:ring-[#FBBF24]'
    content = content.replace(target_thumb, replacement_thumb)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/app/cars/[id]/page.tsx')
print("Done cars/[id]/page.tsx")
