import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { DEST_ORDER } from "@/lib/site-data";
import { languageAlternates, localizedUrl } from "@/lib/seo";

type ChangeFrequency = "weekly" | "monthly";

const PAGES: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/tours", priority: 0.9, changeFrequency: "weekly" },
  ...DEST_ORDER.map((slug) => ({
    path: `/destinations/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  })),
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // One entry per locale, each listing every language version as an alternate.
  return PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
