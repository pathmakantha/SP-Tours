import { getTranslations } from "next-intl/server";
import { CONTACT } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

export async function ReachUs({
  headingId = "reach-h",
  background = "bg-bg-alt",
}: {
  headingId?: string;
  background?: string;
} = {}) {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <section
      aria-labelledby={headingId}
      className={`${background} px-4 py-12 sm:px-8 sm:py-20`}
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id={headingId}
          className="max-w-[20ch] font-serif text-[28px] leading-tight font-normal sm:text-[42px]"
        >
          {t("contactH")}
        </h2>
        <div className="mt-6.5 grid gap-3.5 sm:grid-cols-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="flex flex-col gap-1.5 rounded-2xl bg-green px-5.5 py-5.5 text-green-ink"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-75">
              WhatsApp
            </span>
            <span className="font-serif text-[22px]">+{WHATSAPP_NUMBER}</span>
          </a>
          <a
            href={`tel:${CONTACT.tel}`}
            className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface px-5.5 py-5.5 text-ink"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] text-terra uppercase">
              {t("contactPhone")}
            </span>
            <span className="font-serif text-[22px]">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface px-5.5 py-5.5 text-ink"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] text-terra uppercase">
              {t("contactEmail")}
            </span>
            <span className="font-serif text-[22px]">{CONTACT.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
