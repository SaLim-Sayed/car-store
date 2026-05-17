import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientShell } from "@/components/client-shell";

const inter = Inter({
 subsets: ["latin"],
 variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "سوق سيارات المنيا | بيع وشراء سيارات ومعدات",
  description: "أكبر سوق للسيارات والمعدات في المنيا - بيع وشراء سيارات جديدة ومستعملة وجرارات ومعدات زراعية بأفضل الأسعار",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html
 lang="ar"
 dir="rtl"
 className={`${inter.variable} h-full antialiased`}
 suppressHydrationWarning
 >
 <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
 <ThemeProvider>
 <QueryProvider>
 <ClientShell>{children}</ClientShell>
 <Toaster />
 </QueryProvider>
 </ThemeProvider>
 </body>
 </html>
 );
}
