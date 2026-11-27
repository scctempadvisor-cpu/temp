"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
    __sccReady?: boolean;
  }
}

/** Heron-style inertial scrolling. Anchor links are offset for the sticky header. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 0.95,
      anchors: { offset: -68 },
    });
    window.__lenis = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    const onReady = () => lenis.start();
    window.addEventListener("scc:ready", onReady);
    return () => {
      window.removeEventListener("scc:ready", onReady);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
