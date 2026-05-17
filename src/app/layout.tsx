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
  title: {
    default: "سوق سيارات المنيا | بيع وشراء سيارات ومعدات جديدة ومستعملة",
    template: "%s | سوق سيارات المنيا"
  },
  description: "أكبر سوق للسيارات والمعدات الثقيلة والزراعية في محافظة المنيا. تصفح آلاف السيارات، الجرارات، والمعدات المستعملة والجديدة، وتواصل مع البائعين مباشرة مجاناً وبدون عمولة.",
  keywords: [
    "سيارات المنيا",
    "سوق سيارات المنيا",
    "بيع سيارات في المنيا",
    "شراء سيارات في المنيا",
    "جرارات زراعية المنيا",
    "معدات ثقيلة المنيا",
    "معارض سيارات المنيا",
    "سيارات مستعملة المنيا",
    "جرارات للبيع في مصر",
    "سوق المعدات الزراعية"
  ],
  authors: [{ name: "سيارات المنيا", url: "https://car-store-sepia.vercel.app" }],
  creator: "سيارات المنيا",
  publisher: "سيارات المنيا",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "سوق سيارات المنيا | بيع وشراء سيارات ومعدات جديدة ومستعملة",
    description: "أكبر سوق للسيارات والمعدات الثقيلة والزراعية في محافظة المنيا. تصفح آلاف السيارات والجرارات وتواصل مع معارض المنيا مباشرة.",
    url: 'https://car-store-sepia.vercel.app',
    siteName: 'سوق سيارات المنيا',
    locale: 'ar_EG',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'سوق سيارات المنيا',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "سوق سيارات المنيا | بيع وشراء سيارات ومعدات",
    description: "أكبر سوق للسيارات والمعدات الثقيلة والزراعية في المنيا. تواصل مع المعارض والشركات مباشرة.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
