"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconClassName?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className,
  variant = "outline",
  size = "icon",
  iconClassName,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title: title || "شاهد هذا الإعلان",
      text: text || "تفضل بزيارة هذا الرابط لمشاهدة التفاصيل",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label="مشاركة الإعلان"
      className={cn("transition-all duration-300", className)}
      onClick={handleShare}
    >
      {copied ? (
        <Check className={cn("size-5 text-green-500", iconClassName)} />
      ) : (
        <Share2 className={cn("size-5", iconClassName)} />
      )}
    </Button>
  );
}
