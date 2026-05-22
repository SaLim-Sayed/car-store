import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="min-h-screen bg-[#F8FAFC]">
 <AdminSidebar />
 <div className="lg:pr-72 pt-16 lg:pt-0">
 <div className="min-h-screen p-4 md:p-8">
 {children}
 </div>
 </div>
 </div>
 );
}
