"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F6F1] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-[1000] text-slate-800 tracking-tight">
            عذراً، حدث خطأ غير متوقع
          </h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            لقد واجهنا مشكلة أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="w-full h-12 rounded-xl font-bold bg-white border-neutral-200"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>
        
        {/* Optional: Show technical error in development mode */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-red-50/50 rounded-xl border border-red-100 text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-800 break-words" dir="ltr">
              {error.message || "Unknown error"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
