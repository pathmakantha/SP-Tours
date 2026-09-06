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
        className="cursor-pointer appearance-none rounded-full border border-od/22 bg-transparent px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] text-od outline-none transition-colors hover:border-gold"
      >
        {locales.map((code) => (
          <option
            key={code}
            value={code}
            title={localeLabels[code]}
            className="text-[#0A2A2B]"
          >
            {code === "zh" ? "中文" : code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
