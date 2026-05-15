"use client"

import { useCallback, useId, useRef, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImageFile } from "@/lib/client-image-upload"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  error?: string
  allowUrl?: boolean
  onUploadingChange?: (uploading: boolean) => void
}

export function ImageUpload({
  value,
  onChange,
  error,
  allowUrl = true,
  onUploadingChange,
}: ImageUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة")
        return
      }

      setIsUploading(true)
      onUploadingChange?.(true)
      try {
        const url = await uploadImageFile(file)
        onChange(url)
        toast.success("تم رفع الصورة بنجاح")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "فشل رفع الصورة")
      } finally {
        setIsUploading(false)
        onUploadingChange?.(false)
        if (inputRef.current) inputRef.current.value = ""
      }
    },
    [onChange, onUploadingChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    if (next.startsWith("data:image/")) {
      toast.error("لا يمكن لصق صورة هنا. استخدم زر رفع الصورة من الجهاز")
      return
    }
    onChange(next)
  }

  return (
    <div className="space-y-8">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="space-y-4">
        <Label className="text-lg font-black">رفع صورة من الجهاز *</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-md border-4 border-dashed p-8 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-gray-100 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-1">
            <p className="font-black text-muted-foreground">
              {isUploading ? "جاري الرفع..." : "اسحب الصورة هنا"}
            </p>
            <p className="text-sm text-muted-foreground font-bold">JPG, PNG, WebP — حتى 5 ميجابايت</p>
          </div>
          <Button
            type="button"
            variant="default"
            className="font-black gap-2"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "جاري الرفع..." : "اختر صورة من الجهاز"}
          </Button>
        </div>
      </div>

      {allowUrl && (
        <div className="space-y-3">
          <Label htmlFor={`${inputId}-url`} className="text-lg font-black">
            أو أدخل رابط صورة (اختياري)
          </Label>
          <Input
            id={`${inputId}-url`}
            value={value.startsWith("data:") ? "" : value}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className={cn(
              "h-14 rounded-md border-2 px-6 font-bold",
              error ? "border-red-500" : "border-gray-50 focus:border-primary"
            )}
          />
        </div>
      )}

      {value && !value.startsWith("data:") && (
        <div className="relative aspect-video overflow-hidden rounded-md border-4 border-white shadow-xl">
          <img src={value} alt="معاينة" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-md bg-white text-destructive shadow-lg hover:scale-105 transition-transform"
            aria-label="إزالة الصورة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && <p className="text-sm font-bold text-red-500">{error}</p>}
    </div>
  )
}
