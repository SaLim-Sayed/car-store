"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isAuth = pathname?.startsWith("/auth")

  if (isAdmin || isAuth) {
    return <>{children}</>
  }

  const isHomePage = pathname === "/"
  const contentPadding = isHomePage ? "" : "pt-[7.5rem] md:pt-[8.75rem]"

  return (
    <>
      <Navbar />
      <div className={contentPadding}>{children}</div>
      <WhatsAppFloat />
    </>
  )
}
