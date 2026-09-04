import { defineRouting } from "next-intl/routing";

export const locales = ["en", "de", "fr", "ru", "zh"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  zh: "中文",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
