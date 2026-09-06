"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function WhatsAppFloat({ href }: { href: string }) {
  const t = useTranslations("site");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={t("ctaWa")}
      className={`fixed right-4 bottom-4 z-[70] flex items-center gap-2.5 rounded-full bg-green px-5 py-3.5 text-sm font-medium text-green-ink shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-gold sm:right-7 sm:bottom-7 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      <span className="h-2 w-2 flex-none rounded-full bg-green-ink" />
      WhatsApp
    </a>
  );
}
