import type { Metadata } from "next";
import { locales, routing, type Locale } from "@/i18n/routing";
import { getPhoto } from "@/lib/photos";
import { CONTACT_EMAIL, CONTACT_TEL, WHATSAPP_NUMBER } from "@/lib/config";

// Canonical production origin. Set NEXT_PUBLIC_SITE_URL to the real domain
// before going live — canonical URLs, hreflang, the sitemap and structured
// data are all built from it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://sptours.lk")
).replace(/\/$/, "");

export const SITE_NAME = "SP Tours";

/** hreflang / Open Graph locale codes for each route locale. */
const HREFLANG: Record<Locale, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  ru: "ru",
  zh: "zh-CN",
};

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
  zh: "zh_CN",
};

/** Path for `path` in `locale`, matching the `as-needed` prefix strategy. */
export function localizedPath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function localizedUrl(locale: Locale, path = "/"): string {
  return absoluteUrl(localizedPath(locale, path));
}

/** hreflang map for every locale plus x-default, keyed by hreflang code. */
export function languageAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[HREFLANG[l]] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

/** Absolute URL of the photo registered for a design label, if any. */
export function photoImage(label: string) {
  const photo = getPhoto(label);
  if (!photo) return undefined;
  return { url: absoluteUrl(`/photos/${photo.key}.jpg`), alt: photo.alt };
}

/**
 * Per-page metadata: canonical, hreflang alternates, Open Graph and Twitter
 * cards. Titles are passed bare; the root layout's template appends the brand.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = localizedUrl(locale, path);
  // 1200×630 crops of /photos, pre-rendered into /og for social cards.
  const photo = getPhoto(image ?? "Sigiriya rock at sunrise");
  const images = photo
    ? [
        {
          url: absoluteUrl(`/og/${photo.key}.jpg`),
          alt: photo.alt,
          width: 1200,
          height: 630,
        },
      ]
    : undefined;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: title ? `${title} | ${SITE_NAME}` : undefined,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${SITE_NAME}` : undefined,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Site-wide Organization + WebSite graph, rendered once in the layout. */
export function siteJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/logo.png"),
        image: photoImage("Sigiriya rock at sunrise")?.url,
        description,
        telephone: CONTACT_TEL,
        email: CONTACT_EMAIL,
        areaServed: { "@type": "Country", name: "Sri Lanka" },
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressLocality: "Colombo",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: CONTACT_TEL,
          email: CONTACT_EMAIL,
          url: `https://wa.me/${WHATSAPP_NUMBER}`,
          availableLanguage: ["English", "German", "French", "Russian", "Chinese"],
        },
        knowsLanguage: [...locales],
        priceRange: "$$",
        openingHours: "Mo-Su 00:00-24:00",
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: HREFLANG[locale],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** BreadcrumbList from [name, path] pairs (paths are unlocalized). */
export function breadcrumbJsonLd(locale: Locale, items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: localizedUrl(locale, path),
    })),
  };
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLdHtml(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
