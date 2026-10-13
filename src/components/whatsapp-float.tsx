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
      className={`fixed right-[clamp(14px,3vw,28px)] bottom-[clamp(14px,3vw,28px)] z-[70] flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#1E7A48] px-5 text-[15px] font-bold text-white shadow-[0_18px_36px_-14px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-300 hover:text-white ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      <span className="h-[9px] w-[9px] flex-none rounded-full bg-white" />
      WhatsApp
    </a>
  );
}
