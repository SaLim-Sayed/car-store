import type { Metadata } from "next";
import { absoluteUrl, getAppUrl } from "@/lib/app-url";

export const SITE_NAME = "سوق سيارات المنيا";
export const SITE_TAGLINE = "بيع وشراء سيارات ومعدات في محافظة المنيا";
export const LOCALE = "ar_EG";
export const LANGUAGE = "ar";

/** كلمات مفتاحية عامة لبحث عربي محلي (المنيا وصعيد مصر) */
export const GLOBAL_ARABIC_KEYWORDS = [
  "سيارات مستعملة للبيع في المنيا",
  "سيارات المنيا",
  "سوق سيارات المنيا",
  "بيع سيارات المنيا",
  "شراء سيارات المنيا",
  "سيارات مستعملة المنيا",
  "سيارات للبيع في المنيا",
  "اسعار السيارات المستعملة في المنيا",
  "سيارات للبيع في سمالوط",
  "سيارات مستعملة للبيع بالتقسيط في المنيا",
  "سيارات اتوماتيك للبيع في المنيا",
  "سوق سيارات المنيا بدون وسيط",
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
    title: "سوق سيارات المنيا | سيارات مستعملة للبيع في المنيا",
    description:
      "أكبر سوق لبيع وشراء السيارات المستعملة والجديدة في محافظة المنيا. تصفّح إعلانات موثوقة، قارن الأسعار، وتواصل مع البائعين والمعارض مباشرة بدون وسيط.",
    path: "",
    keywords: [
      "سيارات مستعملة للبيع في المنيا",
      "الصفحة الرئيسية",
      "سوق سيارات",
      "إعلانات سيارات المنيا",
      "شراء عربيات",
      "سوق السيارات المستعملة",
      "اسعار السيارات المستعملة في المنيا",
    ],
  },
  cars: {
    title: "سيارات مستعملة للبيع في المنيا",
    description:
      "اشترِ أفضل السيارات المستعملة في المنيا بأسعار تنافسية. إعلانات محدثة من معارض وأفراد في المنيا وسمالوط ومراكز المحافظة — قارن العروض وتواصل مع البائعين فوراً بدون وسيط.",
    path: "cars",
    keywords: [
      "سيارات مستعملة للبيع في المنيا",
      "اسعار السيارات المستعملة في المنيا",
      "سيارات مستعملة للبيع بالتقسيط في المنيا",
      "سيارات اتوماتيك للبيع في المنيا",
      "سيارات للبيع في سمالوط",
      "سيارات للبيع في المنيا شاهين",
      "سوق سيارات المنيا بدون وسيط",
      "سيارات للبيع",
      "سيارات مستعملة",
      "سيارات جديدة المنيا",
      "أسعار السيارات في المنيا",
      "عربيات مستعملة للبيع",
      "سيارات بالتقسيط",
      "سوق السيارات المستعملة",
      "حراج سيارات المنيا",
      "دوبيزل سيارات المنيا",
      "أولكس سيارات المنيا",
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
    title: "الأسئلة الشائعة عن سيارات المنيا",
    description:
      "إجابات عن أسعار السيارات المستعملة في المنيا، التقسيط، نشر الإعلانات، والتواصل مع البائعين على سوق سيارات المنيا.",
    path: "faq",
    keywords: [
      "اسعار السيارات المستعملة في المنيا",
      "افضل سيارة بسعر 200 الف جنيه",
      "سيارات مستعملة للبيع في المنيا",
      "أسئلة شراء سيارات",
    ],
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
        alternateName: [
          "سوق المنيا",
          "سيارات المنيا",
          "سيارات مستعملة للبيع في المنيا",
          "سوق سيارات صعيد مصر",
        ],
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
    description: `${car.brand} ${car.model} موديل ${car.year} — سيارة مستعملة للبيع في المنيا | سوق سيارات المنيا`,
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

/** أسئلة شائعة من بحث Google — صفحة السيارات والأسئلة الشائعة */
export const CARS_MARKET_FAQ = [
  {
    question: "ما أسعار السيارات المستعملة في المنيا؟",
    answer:
      "تختلف أسعار السيارات المستعملة في المنيا حسب الماركة والموديل والحالة والكيلومترات. على سوق سيارات المنيا يمكنك تصفّح إعلانات محدثة يومياً، مقارنة الأسعار بين المعارض والأفراد، والتواصل مع البائع مباشرة.",
  },
  {
    question: "أين أجد سيارات مستعملة للبيع في المنيا؟",
    answer:
      "يمكنك تصفّح آلاف إعلانات السيارات المستعملة في المنيا وسمالوط ومراكز المحافظة على موقع سوق سيارات المنيا، مع فلترة حسب السعر والماركة ونوع الناقل والوقود.",
  },
  {
    question: "هل توجد سيارات مستعملة للبيع بالتقسيط في المنيا؟",
    answer:
      "نعم، بعض المعارض والبائعين يعرضون سيارات بالتقسيط. تصفّح قسم التمويل أو تواصل مع المعرض مباشرة من صفحة الإعلان للاستفسار عن خطط التقسيط المتاحة.",
  },
  {
    question: "ما أفضل سيارة بسعر 200 ألف جنيه في مصر؟",
    answer:
      "يعتمد الاختيار على احتياجك اليومي. في هذا السعر غالباً تجد موديلات مثل شيفروليه أوفيو أو أوبل أسترا أو هيونداي أكسنت مستعملة. قارن الإعلانات المتاحة في المنيا على موقعنا واختر الأنسب بعد المعاينة والفحص.",
  },
  {
    question: "هل يمكن شراء سيارة أوتوماتيك في المنيا؟",
    answer:
      "نعم، يتوفر قسم خاص بسيارات الأوتوماتيك في إعلاناتنا. استخدم فلاتر البحث لتصفية السيارات الأوتوماتيك المعروضة للبيع في المنيا والصعيد.",
  },
] as const;

export function buildFaqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: LANGUAGE,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildCarsCollectionJsonLd() {
  const url = absoluteUrl("cars");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "سيارات مستعملة للبيع في المنيا",
    description: STATIC_PAGE_SEO.cars.description,
    url,
    inLanguage: LANGUAGE,
    isPartOf: { "@id": `${absoluteUrl("")}#website` },
    about: {
      "@type": "Thing",
      name: "سيارات مستعملة في محافظة المنيا",
      description: "إعلانات سيارات مستعملة وجديدة للبيع في المنيا وسمالوط ومراكز الصعيد",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("") },
        { "@type": "ListItem", position: 2, name: "سيارات مستعملة للبيع في المنيا", item: url },
      ],
    },
  };
}
