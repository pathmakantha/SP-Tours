import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { MinimalFooter } from "@/components/minimal-footer";
import photoCredits from "@/lib/photo-credits.json";

export const metadata: Metadata = {
  title: "Photo credits — SP Tours",
  description: "Attribution for photography used on the SP Tours website.",
};

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader variant="about" />
      <main className="bg-bg px-4 pt-[92px] pb-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-tight font-normal tracking-tight sm:text-5xl">
            Photo credits
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink/72">
            Photography on this site is sourced from Wikimedia Commons.
            Attribution is provided below as required by each photo&rsquo;s
            license.
          </p>
          <ul className="mt-10 flex flex-col gap-0 rounded-2xl border border-line bg-surface">
            {photoCredits.map((c) => (
              <li
                key={c.file}
                className="flex flex-col gap-1 border-b border-line px-6 py-4 text-[14px] leading-relaxed last:border-none sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span>
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-terra"
                  >
                    {c.title}
                  </a>{" "}
                  <span className="text-ink/50">by {c.author}</span>
                </span>
                <span className="flex-none font-mono text-[11px] tracking-[0.06em] text-ink/50 uppercase">
                  {c.license}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <MinimalFooter />
    </>
  );
}
