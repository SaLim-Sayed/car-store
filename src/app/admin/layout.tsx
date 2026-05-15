import { AdminNavbar } from "@/components/admin-navbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <AdminNavbar />
      <div className="pt-16 md:pt-[4.5rem]">{children}</div>
    </div>
  )
}
