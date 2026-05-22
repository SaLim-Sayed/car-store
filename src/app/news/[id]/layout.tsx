import { Metadata } from "next";
import connectDB from "@/lib/mongoose";
import News from "@/lib/models/News";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildNewsArticleJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectDB();
    const article = (await News.findById(id).lean()) as {
      title?: string;
      excerpt?: string;
      content?: string;
      image?: string;
      category?: string;
    } | null;

    if (!article?.title) {
      return buildPageMetadata({
        title: "الخبر غير موجود",
        description: "لم يتم العثور على الخبر المطلوب في سوق سيارات المنيا.",
        path: `news/${id}`,
        noIndex: true,
      });
    }

    const description =
      article.excerpt ||
      `${article.content?.slice(0, 155).trim()}…` ||
      `اقرأ ${article.title} على سوق سيارات المنيا.`;

    return buildPageMetadata({
      title: article.title,
      description,
      path: `news/${id}`,
      image: article.image || "/logo.png",
      ogType: "article",
      keywords: [
        article.category ?? "أخبار السيارات",
        "أخبار السيارات في مصر",
        "سوق السيارات المنيا",
      ],
    });
  } catch (error) {
    console.error("Error generating news metadata:", error);
    return buildPageMetadata({
      title: "أخبار السيارات",
      description: "آخر أخبار سوق السيارات في المنيا.",
      path: "news",
    });
  }
}

export default async function NewsArticleLayout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;
  let jsonLd: Record<string, unknown> | null = null;
  let breadcrumbLd: Record<string, unknown> | null = null;

  try {
    await connectDB();
    const article = (await News.findById(id).lean()) as {
      _id: string;
      title: string;
      excerpt?: string;
      date?: string;
      category?: string;
      image?: string;
    } | null;

    if (article) {
      jsonLd = buildNewsArticleJsonLd({
        _id: String(article._id),
        title: article.title,
        excerpt: article.excerpt,
        date: article.date,
        category: article.category,
        image: article.image,
      });
      breadcrumbLd = buildBreadcrumbJsonLd([
        { name: "الرئيسية", path: "" },
        { name: "أخبار السوق", path: "news" },
        { name: article.title },
      ]);
    }
  } catch {
    // Metadata still works; JSON-LD is optional enhancement
  }

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      {breadcrumbLd ? <JsonLd data={breadcrumbLd} /> : null}
      {children}
    </>
  );
}
