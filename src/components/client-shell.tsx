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

  return (
    <>
      <Navbar />
      <div className="">{children}</div>
      <WhatsAppFloat />
    </>
  )
}
