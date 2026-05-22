const fs = require('fs');

function updateCarForm(filePath, isEditPage) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Imports
  content = content.replace(
    'import { ArrowRight, Plus, X, Phone } from "lucide-react"',
    'import { ArrowRight, Plus, X, Phone, MapPin, Store } from "lucide-react"\nimport { useShowrooms } from "@/hooks/useContent"'
  );

  // 2. CarForm interface
  content = content.replace(
    /status: Status\n}/,
    'status: Status\n  locationLink: string\n  showroom: string\n}'
  );

  // 3. Setup (hooks)
  if (isEditPage) {
    content = content.replace(
      'export default function EditCarPage() {\n  const router = useRouter()',
      'export default function EditCarPage() {\n  const router = useRouter()\n  const { data: showroomsRes } = useShowrooms()\n  const showrooms = showroomsRes?.data || []'
    );
    // 4. Initial state
    content = content.replace(
      /status: "متاح",\n  }\)/,
      'status: "متاح",\n    locationLink: "",\n    showroom: "",\n  })'
    );
    // 4.5 useEffect update
    content = content.replace(
      /status: c\.status,\n\s+}\)/,
      'status: c.status,\n          locationLink: c.locationLink ?? "",\n          showroom: c.showroom ?? "",\n        })'
    );
  } else {
    content = content.replace(
      'export default function NewCarPage() {\n  const router = useRouter()',
      'export default function NewCarPage() {\n  const router = useRouter()\n  const { data: showroomsRes } = useShowrooms()\n  const showrooms = showroomsRes?.data || []'
    );
    // 4. Initial state
    content = content.replace(
      /status: "متاح",\n  }\)/,
      'status: "متاح",\n    locationLink: "",\n    showroom: "",\n  })'
    );
  }

  // 5. handleFileUpload
  const oldUpload = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }))
        toast.success("تم رفع الصورة بنجاح")
      } else {
        toast.error(data.error || "فشل رفع الصورة")
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الصورة")
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }`;

  const newUpload = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          urls.push(data.url)
        } else {
          toast.error(data.error || "فشل رفع إحدى الصور")
        }
      }
      if (urls.length > 0) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
        toast.success("تم رفع الصور بنجاح")
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الصور")
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }`;
  content = content.replace(oldUpload, newUpload);

  // 6. payload
  content = content.replace(
    /phone: form\.phone\.trim\(\),\n\s+}/,
    'phone: form.phone.trim(),\n        locationLink: form.locationLink.trim(),\n        showroom: form.showroom || undefined,\n      }'
  );

  // 7. JSX inputs
  const jsxInputs = `
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="locationLink" className="text-lg font-black">رابط الموقع (اختياري)</Label>
              <div className="relative">
                <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="locationLink"
                  value={form.locationLink}
                  onChange={(e) => set("locationLink", e.target.value)}
                  placeholder="رابط خرائط جوجل..."
                  className="h-14 rounded-2xl border-2 pr-14 pl-6 font-bold border-gray-50 focus:border-primary"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="showroom" className="text-lg font-black">المعرض (اختياري)</Label>
              <div className="relative">
                <Store className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  id="showroom"
                  value={form.showroom}
                  onChange={(e) => set("showroom", e.target.value)}
                  className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white pr-14 pl-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">لا ينتمي لمعرض</option>
                  {showrooms.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
`;

  content = content.replace(
    /<div className="space-y-3">\n\s+<Label htmlFor="status" className="text-lg font-black">الحالة/,
    jsxInputs + '\n          <div className="space-y-3">\n            <Label htmlFor="status" className="text-lg font-black">الحالة'
  );

  // 8. multiple file upload
  content = content.replace(
    /<Input\n\s+type="file"\n\s+accept="image\/\*"\n\s+onChange=\{handleFileUpload\}/g,
    '<Input\n                    type="file"\n                    accept="image/*"\n                    multiple\n                    onChange={handleFileUpload}'
  );

  fs.writeFileSync(filePath, content);
}

updateCarForm('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/cars/new/page.tsx', false);
updateCarForm('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/cars/[id]/edit/page.tsx', true);

// Showrooms edit
function updateShowroomForm(filePath, isEditPage) {
  let content = fs.readFileSync(filePath, 'utf8');

  // interface update
  if (!content.includes('locationLink: "",')) {
    content = content.replace(
      /featured: false\n\s+}\)/,
      'featured: false,\n    locationLink: ""\n  })'
    );
  }
  
  if (isEditPage) {
    content = content.replace(
      /featured: s\.featured,\n\s+}\)/,
      'featured: s.featured,\n          locationLink: s.locationLink ?? ""\n        })'
    );
  }
  
  const jsxInput = `
          <div className="space-y-3">
            <Label htmlFor="locationLink" className="text-lg font-black">رابط الموقع</Label>
            <div className="relative">
              <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="locationLink"
                value={form.locationLink}
                onChange={(e) => setForm({ ...form, locationLink: e.target.value })}
                placeholder="رابط خرائط جوجل..."
                className="h-14 rounded-2xl border-2 pr-14 pl-6 font-bold border-gray-50 focus:border-primary"
                dir="ltr"
              />
            </div>
          </div>
`;

  content = content.replace(
    /<div className="space-y-3">\n\s+<Label htmlFor="description"/,
    jsxInput + '\n          <div className="space-y-3">\n            <Label htmlFor="description"'
  );

  fs.writeFileSync(filePath, content);
}

updateShowroomForm('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/showrooms/new/page.tsx', false);
if (fs.existsSync('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/showrooms/[id]/edit/page.tsx')) {
  updateShowroomForm('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/showrooms/[id]/edit/page.tsx', true);
} else if (fs.existsSync('/Users/salemsayed/1-Work/FREE/car_store/src/app/admin/showrooms/[id]/page.tsx')) {
  // Check if there is an edit page for showroom, let's just ignore if not found
}

// Equipment component update
function updateEquipmentForm(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // interface
  content = content.replace(
    /featured: boolean\n}/,
    'featured: boolean\n  locationLink: string\n}'
  );
  
  // emptyEquipmentForm
  content = content.replace(
    /featured: false,\n}/,
    'featured: false,\n  locationLink: "",\n}'
  );
  
  // add multiple to extra image
  content = content.replace(
    /<Input type="file" accept="image\/\*" onChange=\{addExtraImage\} disabled=\{isUploading\} \/>/,
    '<Input type="file" accept="image/*" multiple onChange={addExtraImage} disabled={isUploading} />'
  );
  
  // update addExtraImage
  const oldExtra = `  const addExtraImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUploadingChange(true)
    try {
      const url = await uploadImageFile(file)
      onChange({ ...form, images: [...form.images, url] })
      toast.success("تم رفع الصورة")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل رفع الصورة")
    } finally {
      onUploadingChange(false)
      e.target.value = ""
    }
  }`;
  
  const newExtra = `  const addExtraImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    onUploadingChange(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageFile(files[i])
        urls.push(url)
      }
      onChange({ ...form, images: [...form.images, ...urls] })
      toast.success("تم رفع الصور")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل رفع بعض الصور")
    } finally {
      onUploadingChange(false)
      e.target.value = ""
    }
  }`;
  content = content.replace(oldExtra, newExtra);
  
  // JSX Location Link
  const jsxInput = `
          <div className="space-y-3">
            <Label className="text-lg font-black">رابط الموقع (خريطة)</Label>
            <Input
              value={form.locationLink}
              onChange={(e) => set("locationLink", e.target.value)}
              className="h-14 rounded-md border-2 border-gray-50 px-6 font-bold"
              dir="ltr"
            />
          </div>
`;
  
  content = content.replace(
    /<div className="space-y-3">\n\s+<Label className="text-lg font-black">رقم الهاتف للتواصل<\/Label>/,
    jsxInput + '\n          <div className="space-y-3">\n            <Label className="text-lg font-black">رقم الهاتف للتواصل</Label>'
  );
  
  // payload
  content = content.replace(
    /featured: form\.featured,\n\s+}/,
    'featured: form.featured,\n    locationLink: form.locationLink.trim(),\n  }'
  );
  
  fs.writeFileSync(filePath, content);
}
updateEquipmentForm('/Users/salemsayed/1-Work/FREE/car_store/src/components/equipment-form.tsx');

console.log('Update finished!');
