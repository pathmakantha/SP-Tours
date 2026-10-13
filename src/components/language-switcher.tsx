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
    <label className="relative flex flex-none items-center">
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
        className="h-10 cursor-pointer appearance-none rounded-[10px] border border-line-2 bg-surface px-3.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
      >
        {locales.map((code) => (
          <option
            key={code}
            value={code}
            title={localeLabels[code]}
          >
            {code === "zh" ? "中文" : code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
