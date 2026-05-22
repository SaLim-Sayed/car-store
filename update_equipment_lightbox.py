import sys

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    target_equipment_header = """  {/* Lightbox Header */}
  <div className="absolute top-0 inset-x-0 p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
  <div className="flex flex-col gap-1">
  <h2 className="text-white text-xl md:text-2xl font-black">{label}</h2>
  <div className="flex items-center gap-4">
  <p className="text-primary text-2xl font-black">{item.price ? `${item.price.toLocaleString()} ج.م` : "حسب الطلب"}</p>
  <Badge variant="outline" className="border-white/20 text-white/60">{item.category}</Badge>
  </div>
  </div>
  
  <div className="flex items-center gap-4">
  <div className="hidden md:flex gap-3 mr-8">
  <CallButton
  phone={item.phone}
  label="اتصال"
  showNumber={false}
  size="sm"
  variant="outline"
  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-bold px-6"
  />
  <Button
  variant="outline"
  size="sm"
  className="bg-[#22C55E] border-0 text-white hover:bg-green-600 rounded-xl font-bold px-6"
  asChild
  >
  <a
  href={whatsappHref}
  target="_blank"
  rel="noopener noreferrer"
  >
  <MessageSquare className="h-4 w-4 ml-2" />
  واتساب
  </a>
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

    replacement_equipment_header = """  {/* Lightbox Header */}
  <div className="absolute top-0 inset-x-0 p-4 md:p-5 z-50 flex justify-between items-start bg-[#1c1c1c]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
    {/* Right Side: Title & Badges */}
    <div className="flex flex-col gap-3">
      <h2 className="text-white text-xl md:text-2xl font-black">
        {label} للبيع
      </h2>
      <div className="hidden md:flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1">{item.category}</Badge>
        {item.status && <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1">{item.status}</Badge>}
        {item.location && <Badge variant="outline" className="bg-white/10 border-0 text-white/90 rounded-md font-bold px-3 py-1"><MapPin className="h-3.5 w-3.5 ml-1" />{item.location}</Badge>}
      </div>
    </div>
    
    {/* Left Side: Close, Price, Buttons */}
    <div className="flex items-start gap-4 md:gap-8">
      <div className="flex flex-col items-end gap-3">
        <p className="text-white text-xl md:text-[1.7rem] font-black tabular-nums tracking-tighter">
          {item.price ? `${item.price.toLocaleString("ar-EG")} جنيه` : "حسب الطلب"}
        </p>
        <div className="hidden md:flex gap-3">
          <CallButton
            phone={item.phone}
            label="اتصال"
            showNumber={false}
            size="sm"
            variant="outline"
            className="bg-white border-0 text-[#2563EB] hover:bg-gray-100 rounded-lg font-bold px-6 h-9"
          />
          <Button variant="outline" size="sm" className="bg-white border-0 text-[#22C55E] hover:bg-gray-100 rounded-lg font-bold px-6 h-9" asChild>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4 ml-2" />
              واتساب
            </a>
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

    content = content.replace(target_equipment_header, replacement_equipment_header)

    target_thumb = 'swiper-slide-thumb-active:ring-primary'
    replacement_thumb = 'swiper-slide-thumb-active:ring-[#FBBF24]'
    content = content.replace(target_thumb, replacement_thumb)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/app/equipment/[id]/page.tsx')
print("Done equipment/[id]/page.tsx")
