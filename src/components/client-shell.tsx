"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { ScrollToTop } from "@/components/scroll-to-top";
import { VisitTracker } from "@/components/visit-tracker";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/auth");

  if (isAdmin || isAuth) {
    return <>{children}</>;
  }

  const isHomePage = pathname === "/";
  const contentPadding = isHomePage
    ? "pb-20 md:pb-0"
    : "pt-20 md:pt-[7.5rem] pb-20 md:pb-0";

  return (
    <>
      <Suspense fallback={null}>
        <VisitTracker />
      </Suspense>
      <Navbar />
      <div className={contentPadding}>{children}</div>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <BottomNav />
    </>
  );
}
