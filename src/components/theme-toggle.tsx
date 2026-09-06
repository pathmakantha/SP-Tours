"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        aria-hidden
        className="h-[38px] w-[38px] flex-none rounded-full border border-od/22"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggleLabel")}
      title={isDark ? t("light") : t("dark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border border-od/22 bg-transparent transition-all duration-300 hover:border-gold hover:bg-gold/14"
    >
      <span className="block h-[15px] w-[15px] rounded-full bg-gold" />
    </button>
  );
}
