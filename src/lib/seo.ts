import type { Metadata } from "next";
import { absoluteUrl, getAppUrl } from "@/lib/app-url";

export const SITE_NAME = "سوق سيارات المنيا";
export const SITE_TAGLINE = "بيع وشراء سيارات ومعدات في محافظة المنيا";
export const LOCALE = "ar_EG";
export const LANGUAGE = "ar";

/** كلمات مفتاحية عامة لبحث عربي محلي (المنيا وصعيد مصر) */
export const GLOBAL_ARABIC_KEYWORDS = [
  "سيارات المنيا",
  "سوق سيارات المنيا",
  "بيع سيارات المنيا",
  "شراء سيارات المنيا",
  "سيارات مستعملة المنيا",
  "سيارات للبيع في المنيا",
  "معارض سيارات المنيا",
  "معدات ثقيلة المنيا",
  "جرارات زراعية المنيا",
  "معدات زراعية للبيع",
  "سوق السيارات في مصر",
  "إعلانات سيارات مجانية",
  "سيارات صعيد مصر",
  "سوق المعدات الزراعية",
  "أخبار السيارات في مصر",
  "سيارات مستعملة للبيع",
  "سيارات للبيع بالتقسيط",
  "سوق السيارات",
  "حراج السيارات",
  "اسعار السيارات اليوم",
  "عربيات للبيع",
  "موتوسيكلات للبيع",
  "عربيات مستعملة",
] as const;

export type PageSeoConfig = {
  title: string;
  description: string;
  /** مسار بدون شرطة مائلة في البداية، مثل: cars أو about */
  path: string;
  keywords?: string[];
  image?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata(config: PageSeoConfig): Metadata {
  const canonical = absoluteUrl(config.path);
  const keywords = [
    ...GLOBAL_ARABIC_KEYWORDS,
    ...(config.keywords ?? []),
  ];
  const image = config.image ?? "/logo.png";

  return {
    title: config.title,
    description: config.description,
    keywords: [...new Set(keywords)],
    alternates: {
      canonical,
      languages: {
        "ar-EG": canonical,
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: LOCALE,
      type: config.ogType ?? "website",
      images: [
        {
          url: image,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [image],
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    other: {
      "content-language": LANGUAGE,
      "geo.placename": "المنيا، مصر",
      "geo.region": "EG",
    },
  };
}

/** بيانات الصفحات الثابتة */
export const STATIC_PAGE_SEO = {
  home: {
    title: "سوق سيارات المنيا | بيع وشراء سيارات ومعدات جديدة ومستعملة",
    description:
      "أكبر سوق عربي لبيع وشراء السيارات والمعدات الثقيلة والزراعية في محافظة المنيا. تصفّح آلاف الإعلانات، قارن الأسعار، وتواصل مع البائعين والمعارض مباشرة بدون عمولة.",
    path: "",
    keywords: ["الصفحة الرئيسية", "سوق سيارات", "إعلانات سيارات المنيا", "شراء عربيات", "سوق السيارات المستعملة"],
  },
  cars: {
    title: "سيارات للبيع في المنيا",
    description:
      "تصفّح سيارات جديدة ومستعملة معروضة للبيع في المنيا والصعيد. فلترة حسب السعر والماركة ونوع الوقود والناقل، وتواصل مباشرة مع البائع.",
    path: "cars",
    keywords: [
      "سيارات للبيع",
      "سيارات مستعملة",
      "سيارات جديدة المنيا",
      "أسعار السيارات في المنيا",
      "عربيات مستعملة للبيع",
      "سيارات بالتقسيط",
      "سوق السيارات المستعملة",
      "حراج سيارات",
    ],
  },
  equipment: {
    title: "معدات ثقيلة وزراعية للبيع في المنيا",
    description:
      "جرارات زراعية، حفارات، شاحنات، ومعدات ثقيلة جديدة ومستعملة في المنيا. قارن الأسعار وتواصل مع البائع فوراً.",
    path: "equipment",
    keywords: [
      "معدات ثقيلة للبيع",
      "جرار زراعي للبيع",
      "معدات زراعية مستعملة",
      "حفارات للبيع",
      "لوادر للبيع",
      "معدات بناء",
      "جرارات مستعملة",
    ],
  },
  news: {
    title: "أخبار السيارات والسوق في المنيا",
    description:
      "آخر أخبار السيارات، العروض، نصائح الشراء والصيانة، وتحديثات سوق السيارات في المنيا ومصر.",
    path: "news",
    keywords: ["أخبار السيارات", "أسعار السيارات", "سوق السيارات مصر", "عروض السيارات", "نصائح صيانة السيارات"],
  },
  bikes: {
    title: "دراجات نارية للبيع في المنيا",
    description:
      "تصفّح دراجات نارية وسكوتر جديدة ومستعملة للبيع في المنيا والصعيد. تواصل مباشرة مع البائع بدون عمولة.",
    path: "bikes",
    keywords: [
      "دراجات نارية للبيع",
      "سكوتر مستعمل",
      "موتوسيكلات المنيا",
      "أسعار الموتوسيكلات",
      "موتوسيكلات للبيع",
      "تروسيكل للبيع",
      "توك توك للبيع",
    ],
  },
  showrooms: {
    title: "معارض السيارات في المنيا",
    description:
      "دليل معارض ووكلاء السيارات المعتمدين في المنيا. اكتشف العروض والسيارات المتاحة وتواصل مع المعرض مباشرة.",
    path: "showrooms",
    keywords: ["معارض سيارات", "وكلاء سيارات المنيا", "شركات سيارات", "معارض السيارات المستعملة", "أرقام معارض السيارات"],
  },
  about: {
    title: "من نحن",
    description:
      "تعرّف على سوق سيارات المنيا، المنصة العربية الرائدة لربط البائع بالمشتري في محافظة المنيا.",
    path: "about",
  },
  contact: {
    title: "اتصل بنا",
    description:
      "تواصل مع فريق سوق سيارات المنيا للاستفسارات، الإعلانات، والدعم الفني.",
    path: "contact",
  },
  services: {
    title: "خدماتنا",
    description:
      "خدمات بيع وشراء السيارات، عرض المعدات، وإدراج المعارض على منصة سوق سيارات المنيا.",
    path: "services",
  },
  faq: {
    title: "الأسئلة الشائعة",
    description:
      "إجابات عن كيفية نشر إعلان سيارة، التواصل مع البائعين، والخدمات في سوق سيارات المنيا.",
    path: "faq",
  },
  finance: {
    title: "تمويل السيارات",
    description:
      "معلومات عن تمويل وشراء السيارات بالتقسيط في المنيا وخيارات الدفع المتاحة.",
    path: "finance",
  },
  privacy: {
    title: "سياسة الخصوصية",
    description: "سياسة الخصوصية وحماية بيانات المستخدمين في سوق سيارات المنيا.",
    path: "privacy",
    noIndex: true,
  },
  terms: {
    title: "شروط الاستخدام",
    description: "شروط وأحكام استخدام منصة سوق سيارات المنيا.",
    path: "terms",
    noIndex: true,
  },
} as const satisfies Record<string, PageSeoConfig>;

export function buildStaticPageMetadata(
  key: keyof typeof STATIC_PAGE_SEO,
): Metadata {
  return buildPageMetadata(STATIC_PAGE_SEO[key]);
}

/** Schema.org — WebSite + Organization للبحث العربي */
export function buildSiteJsonLd() {
  const base = getAppUrl();
  const home = absoluteUrl("");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        name: SITE_NAME,
        alternateName: ["سوق المنيا", "سيارات المنيا", "سوق سيارات صعيد مصر"],
        url: home,
        description: STATIC_PAGE_SEO.home.description,
        inLanguage: LANGUAGE,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl("cars?search={search_term_string}"),
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${home}#organization`,
        name: SITE_NAME,
        url: home,
        logo: absoluteUrl("logo.png"),
        description: SITE_TAGLINE,
        areaServed: {
          "@type": "AdministrativeArea",
          name: "محافظة المنيا",
          containedInPlace: { "@type": "Country", name: "مصر" },
        },
        knowsLanguage: ["ar"],
      },
      {
        "@type": "AutoDealer",
        "@id": `${home}#dealer`,
        name: SITE_NAME,
        url: home,
        image: absoluteUrl("logo.png"),
        description: STATIC_PAGE_SEO.home.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "المنيا",
          addressRegion: "المنيا",
          addressCountry: "EG",
        },
        areaServed: "محافظة المنيا",
        inLanguage: LANGUAGE,
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path?: string }[],
) {
  const base = getAppUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: LANGUAGE,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  };
}

export function buildCarListingJsonLd(car: {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  status?: string;
  images?: string[];
}) {
  const url = absoluteUrl(`cars/${car._id}`);
  const image = car.images?.[0]
    ? car.images[0].startsWith("http")
      ? car.images[0]
      : absoluteUrl(car.images[0].replace(/^\//, ""))
    : absoluteUrl("logo.png");

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Vehicle"],
    name: `${car.brand} ${car.model} ${car.year}`,
    description: `${car.brand} ${car.model} موديل ${car.year} للبيع في المنيا — سوق سيارات المنيا`,
    url,
    image,
    inLanguage: LANGUAGE,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: car.mileage
      ? {
          "@type": "QuantitativeValue",
          value: car.mileage,
          unitCode: "KMT",
        }
      : undefined,
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    offers: {
      "@type": "Offer",
      price: car.price ?? 0,
      priceCurrency: "EGP",
      availability:
        car.status === "متاح"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      availableAtOrFrom: {
        "@type": "Place",
        name: "محافظة المنيا",
        address: { "@type": "PostalAddress", addressLocality: "المنيا", addressCountry: "EG" },
      },
    },
  };
}

export function buildEquipmentListingJsonLd(equipment: {
  _id: string;
  title?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  condition?: string;
  status?: string;
  images?: string[];
}) {
  const url = absoluteUrl(`equipment/${equipment._id}`);
  const label =
    equipment.title || `${equipment.brand ?? ""} ${equipment.model ?? ""}`.trim();
  const image = equipment.images?.[0]
    ? equipment.images[0].startsWith("http")
      ? equipment.images[0]
      : absoluteUrl(equipment.images[0].replace(/^\//, ""))
    : absoluteUrl("logo.png");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: equipment.year ? `${label} ${equipment.year}` : label,
    description: equipment.year
      ? `${label} موديل ${equipment.year} للبيع في المنيا`
      : `${label} للبيع في المنيا`,
    url,
    image,
    inLanguage: LANGUAGE,
    brand: equipment.brand
      ? { "@type": "Brand", name: equipment.brand }
      : undefined,
    model: equipment.model,
    productionDate: String(equipment.year),
    itemCondition:
      equipment.condition === "جديد"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: equipment.price ?? 0,
      priceCurrency: "EGP",
      availability:
        equipment.status === "متاح"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },
  };
}

export function buildBikeListingJsonLd(bike: {
  _id: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  condition?: string;
  status?: string;
  images?: string[];
}) {
  const url = absoluteUrl(`bikes/${bike._id}`);
  const label = `${bike.brand ?? ""} ${bike.model ?? ""}`.trim();
  const image = bike.images?.[0]
    ? bike.images[0].startsWith("http")
      ? bike.images[0]
      : absoluteUrl(bike.images[0].replace(/^\//, ""))
    : absoluteUrl("logo.png");

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Vehicle"],
    name: bike.year ? `${label} ${bike.year}` : label,
    description: bike.year
      ? `${label} موديل ${bike.year} دراجة نارية للبيع في المنيا`
      : `${label} دراجة نارية للبيع في المنيا`,
    url,
    image,
    inLanguage: LANGUAGE,
    brand: bike.brand ? { "@type": "Brand", name: bike.brand } : undefined,
    model: bike.model,
    vehicleModelDate: String(bike.year),
    itemCondition:
      bike.condition === "جديد"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: bike.price ?? 0,
      priceCurrency: "EGP",
      availability:
        bike.status === "متاح"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      availableAtOrFrom: {
        "@type": "Place",
        name: "محافظة المنيا",
        address: { "@type": "PostalAddress", addressLocality: "المنيا", addressCountry: "EG" },
      },
    },
  };
}

export function buildNewsArticleJsonLd(article: {
  _id: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  image?: string;
}) {
  const url = absoluteUrl(`news/${article._id}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    url,
    inLanguage: LANGUAGE,
    datePublished: article.date,
    articleSection: article.category,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("logo.png") },
    },
    image: article.image ? absoluteUrl(article.image.replace(/^\//, "")) : absoluteUrl("logo.png"),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}
