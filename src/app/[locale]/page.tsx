import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <header className="flex items-center justify-end gap-3 p-6">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
          {t("eyebrow")}
        </p>
        <h1 className="max-w-xl font-serif text-3xl font-semibold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="max-w-md text-neutral-500 dark:text-neutral-400">
          {t("body")}
        </p>
      </main>
    </>
  );
}
