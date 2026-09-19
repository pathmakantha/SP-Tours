"use client";

import { useRef, useState } from "react";

const DURATION = 320;
const EASING = "cubic-bezier(.2,.8,.25,1)";

/**
 * A <details> whose height animates open and closed. The native element is kept
 * (find-in-page, no-JS fallback); we only intercept the toggle to animate it.
 */
export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const animRef = useRef<Animation | null>(null);
  const [expanded, setExpanded] = useState(false);

  const animateHeight = (from: number, to: number, onDone: () => void) => {
    const el = detailsRef.current;
    if (!el) return;
    animRef.current?.cancel();
    el.style.overflow = "hidden";
    const anim = el.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: DURATION, easing: EASING },
    );
    animRef.current = anim;
    anim.onfinish = () => {
      animRef.current = null;
      el.style.overflow = "";
      onDone();
    };
    anim.oncancel = () => {
      el.style.overflow = "";
    };
  };

  const collapsedHeight = (el: HTMLDetailsElement) => {
    const cs = getComputedStyle(el);
    return (
      (summaryRef.current?.offsetHeight ?? 0) +
      parseFloat(cs.paddingTop) +
      parseFloat(cs.paddingBottom) +
      parseFloat(cs.borderTopWidth) +
      parseFloat(cs.borderBottomWidth)
    );
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = detailsRef.current;
    if (!el) return;
    const opening = !expanded;
    setExpanded(opening);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.open = opening;
      return;
    }

    if (opening) {
      const from = el.offsetHeight;
      el.open = true;
      animateHeight(from, el.scrollHeight, () => {});
    } else {
      animateHeight(el.offsetHeight, collapsedHeight(el), () => {
        el.open = false;
      });
    }
  };

  return (
    <details
      ref={detailsRef}
      className="rounded-2xl border border-line bg-surface px-5.5 py-5"
    >
      <summary
        ref={summaryRef}
        onClick={toggle}
        aria-expanded={expanded}
        className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[clamp(19px,2vw,23px)] leading-[1.25] [&::-webkit-details-marker]:hidden"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className={`flex size-[22px] flex-none items-center justify-center rounded-full border text-[15px] leading-none transition-[transform,border-color,background-color] duration-300 ${
            expanded
              ? "rotate-45 border-terra bg-terra/10 text-terra"
              : "border-line-2 text-ink/60"
          }`}
        >
          +
        </span>
      </summary>
      <p
        className={`mt-3.5 max-w-[70ch] text-[15.5px] leading-[1.68] text-ink/72 transition-[opacity,transform] duration-300 ${
          expanded ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        {answer}
      </p>
    </details>
  );
}
