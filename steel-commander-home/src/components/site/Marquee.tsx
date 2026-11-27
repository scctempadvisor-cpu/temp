"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const WORDS = ["Pre-engineered", "Stamped for your state", "Factory direct", "Clear-span interiors", "American-made steel"];

function Shield() {
  return (
    <svg viewBox="0 0 100 114" className="mx-[0.35em] inline-block h-[0.62em] w-auto -translate-y-[0.06em]" aria-hidden>
      <path
        d="M14 20 L27 20 L31 8 L69 8 L73 20 L86 20 L86 58 C86 78 70 94 50 106 C30 94 14 78 14 58 Z"
        fill="var(--scc)"
      />
      {[84, 91, 98].map((y) => (
        <rect key={y} x="20" y={y} width="60" height="3" fill="var(--paper)" />
      ))}
    </svg>
  );
}

/** Big type band whose speed + direction follow scroll velocity (Heron-style). */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? -1 : 1;
      boost += (Math.min(40, Math.abs(dy)) * 9 - boost) * 0.12;
      x += dir * (60 + boost) * dt;
      const w = el.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center">
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={i % 2 ? "text-outline" : "text-ink"}>{w}</span>
          <Shield />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-label="Why steel" className="theme-ink relative overflow-hidden border-y border-rule">
      <div className="mx-auto max-w-[1440px] border-x border-rule">
        <div className="mono-label flex items-center justify-between border-b border-rule px-4 py-2 text-[10px] text-pencil sm:px-6">
          <span>[ Spec sheet ]</span>
          <span className="hidden sm:inline">Every kit · every state · every use</span>
          <span>Scroll ↕ to steer</span>
        </div>
      </div>
      <div
        ref={track}
        className="flex w-max select-none whitespace-nowrap py-5 font-display text-[clamp(48px,8.4vw,132px)] font-extrabold uppercase leading-none tracking-[0.005em] will-change-transform"
      >
        {row("a")}
        {row("b")}
      </div>
    </section>
  );
}
