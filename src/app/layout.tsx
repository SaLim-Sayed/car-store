import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientShell } from "@/components/client-shell";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import {
  buildStaticPageMetadata,
  SITE_NAME,
  STATIC_PAGE_SEO,
} from "@/lib/seo";
import { getAppUrl } from "@/lib/app-url";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  ...buildStaticPageMetadata("home"),
  title: {
    default: STATIC_PAGE_SEO.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  authors: [{ name: SITE_NAME, url: getAppUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <SiteJsonLd />
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
