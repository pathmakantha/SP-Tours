"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          router.replace(
            // @ts-expect-error -- params shape is dynamic per route
            { pathname, params },
            { locale: nextLocale },
          );
        }}
        className="rounded-full border border-neutral-300 bg-transparent px-3 py-1.5 text-sm text-neutral-700 outline-none transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
