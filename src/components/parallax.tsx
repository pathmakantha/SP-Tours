"use client";

import { useEffect, useRef } from "react";

/**
 * Drifts its child on scroll (translateY = -scrollY * speed) on top of a base
 * transform. Disabled for visitors who prefer reduced motion.
 */
export function Parallax({
  speed,
  baseTransform = "",
  className,
  style,
  children,
}: {
  speed: number;
  baseTransform?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY || 0;
      el.style.transform = `${baseTransform} translate3d(0,${(-y * speed).toFixed(1)}px,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, baseTransform]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transform: baseTransform || undefined }}
    >
      {children}
    </div>
  );
}
