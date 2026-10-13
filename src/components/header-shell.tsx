"use client";

import { useEffect, useState } from "react";

/** Fixed, blurred header bar that picks up a soft shadow once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b border-line bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_30px_-20px_rgba(14,27,29,0.35)]" : ""
      }`}
    >
      {children}
    </header>
  );
}
