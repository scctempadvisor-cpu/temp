"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a || 1));
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** IntersectionObserver flag. once=true disconnects after first hit. */
export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  margin = "0px 0px -12% 0px",
  threshold = 0,
}: { once?: boolean; margin?: string; threshold?: number } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin: margin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, threshold]);
  return [ref, inView] as const;
}

/**
 * Calls cb(progress) on scroll (rAF-throttled). Writes should go straight to the DOM.
 * - "pin": 0 when the element top reaches `offset`, 1 when its bottom reaches the viewport bottom
 * - "through": 0 when the top enters the viewport, 1 when the bottom leaves it
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  cb: (p: number) => void,
  { mode = "pin", offset = 0 }: { mode?: "pin" | "through"; offset?: number } = {},
) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "pin"
          ? (offset - r.top) / Math.max(1, r.height - (vh - offset))
          : (vh - r.top) / (vh + r.height);
      cbRef.current(clamp01(p));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref, mode, offset]);
}

/** true once the intro loader has finished (or immediately if it never ran) */
export function useSiteReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as unknown as { __sccReady?: boolean };
    if (w.__sccReady) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("scc:ready", on);
    const t = setTimeout(on, 4500); // failsafe
    return () => {
      window.removeEventListener("scc:ready", on);
      clearTimeout(t);
    };
  }, []);
  return ready;
}
