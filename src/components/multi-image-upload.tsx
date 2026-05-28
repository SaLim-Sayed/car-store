"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { ImageIcon, Upload, X, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImageFile } from "@/lib/client-image-upload";
import { cn } from "@/lib/utils";

type MultiImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
  allowUrl?: boolean;
  max?: number;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  label?: string;
};

function moveItem<T>(arr: T[], from: number, to: number) {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function MultiImageUpload({
  value,
  onChange,
  error,
  allowUrl = true,
  max = 12,
  disabled = false,
  onUploadingChange,
  label = "الصور",
}: MultiImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const remaining = Math.max(0, max - value.length);
  const canAdd = remaining > 0 && !disabled && !isUploading;

  const coverUrl = value[0] ?? "";
  const previewUrls = useMemo(() => value.filter(Boolean), [value]);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (images.length === 0) {
        toast.error("يرجى اختيار ملفات صور");
        return;
      }

      const slice = images.slice(0, remaining);
      if (slice.length < images.length) {
        toast.warning(`تم تجاهل ${images.length - slice.length} صورة (الحد ${max})`);
      }

      setIsUploading(true);
      onUploadingChange?.(true);
      try {
        const uploaded: string[] = [];
        for (const f of slice) {
          // sequential upload = simpler + less flaky for large selections
          const url = await uploadImageFile(f);
          uploaded.push(url);
        }
        onChange([...value, ...uploaded]);
        toast.success(`تم رفع ${uploaded.length} صورة`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "فشل رفع الصور");
      } finally {
        setIsUploading(false);
        onUploadingChange?.(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [max, onChange, onUploadingChange, remaining, value],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) void uploadFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) void uploadFiles(files);
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const setCover = (idx: number) => {
    if (idx <= 0) return;
    onChange(moveItem(value, idx, 0));
  };

  const moveLeft = (idx: number) => {
    if (idx <= 0) return;
    onChange(moveItem(value, idx, idx - 1));
  };

  const moveRight = (idx: number) => {
    if (idx >= value.length - 1) return;
    onChange(moveItem(value, idx, idx + 1));
  };

  const addUrl = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (url.startsWith("data:image/")) {
      toast.error("لا يمكن لصق صورة هنا. استخدم رفع الصور من الجهاز");
      return;
    }
    if (!canAdd) return;
    onChange([...value, url]);
    setNewUrl("");
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-black text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </Label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleFileChange}
        disabled={!canAdd}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!canAdd) return;
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-slate-50 px-4 py-4 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-slate-200",
          !canAdd && "opacity-60 pointer-events-none",
        )}
      >
        <ImageIcon className="h-6 w-6 text-slate-500" />
        <p className="text-xs font-bold text-slate-600 text-center">
          {isUploading ? "جاري رفع الصور..." : "اسحب الصور هنا أو اختر من الجهاز"}
        </p>
        <p className="text-[11px] font-bold text-slate-400">
          JPG, PNG, WebP — حتى 5MB — المتبقي: {remaining}
        </p>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-9 rounded-lg px-4 font-black gap-2"
          disabled={!canAdd}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "جاري الرفع..." : "اختيار صور"}
        </Button>
      </div>

      {allowUrl && (
        <div className="space-y-2">
          <Label className="text-xs font-black text-slate-500">
            أو إضافة برابط مباشر
          </Label>
          <div className="flex gap-2">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="h-10 rounded-xl border-slate-200 bg-slate-50 px-4 font-bold text-sm"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              dir="ltr"
              disabled={!canAdd}
            />
            <Button
              type="button"
              onClick={addUrl}
              size="icon"
              className="h-10 w-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 shrink-0"
              disabled={!canAdd}
              aria-label="إضافة رابط"
            >
              +
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previewUrls.map((img, idx) => {
            const isCover = img === coverUrl;
            return (
              <div
                key={`${img}-${idx}`}
                className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white group"
              >
                <img
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
                  {isCover ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-black text-white">
                      <Star className="h-3 w-3" /> الغلاف
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCover(idx)}
                      className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-black text-white hover:bg-black/60"
                      aria-label="تعيين كغلاف"
                    >
                      <Star className="h-3 w-3" /> غلاف
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600"
                    aria-label="حذف الصورة"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1.5">
                  <button
                    type="button"
                    onClick={() => moveLeft(idx)}
                    disabled={idx === 0}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60",
                      idx === 0 && "opacity-40 pointer-events-none",
                    )}
                    aria-label="تحريك لليسار"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRight(idx)}
                    disabled={idx === previewUrls.length - 1}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60",
                      idx === previewUrls.length - 1 &&
                        "opacity-40 pointer-events-none",
                    )}
                    aria-label="تحريك لليمين"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

