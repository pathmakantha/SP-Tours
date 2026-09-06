import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/logo-mark";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

export async function MinimalFooter({
  showLegal = false,
}: {
  showLegal?: boolean;
} = {}) {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <footer className="bg-deep px-4 py-9 text-od sm:px-8 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
        <p className="flex items-center gap-2.5 font-serif text-[22px]">
          <LogoMark />
          SP Tours
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-green px-6 py-3.5 text-sm font-medium text-green-ink hover:bg-gold"
        >
          {t("ftCta")}
        </a>
      </div>
      {showLegal && (
        <p className="mx-auto mt-7 max-w-6xl border-t border-od/14 pt-4.5 text-xs text-od/42">
          {t("ftLegal")}
        </p>
      )}
    </footer>
  );
}
