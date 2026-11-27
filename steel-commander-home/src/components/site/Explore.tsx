"use client";

import { useEffect, useRef, useState } from "react";
import { CtaLink } from "@/components/ui/button";
import { LINKS } from "@/lib/buildings";
import { prefersReducedMotion } from "@/lib/motion";
import { Cross, Label } from "./kit";
import { RevealHeading } from "./motion";

const IMGS = [
  { src: "/scc/gambrel.jpg", cap: "Gambrel barn" },
  { src: "/scc/steel-garage.png", cap: "Steel garage" },
  { src: "/scc/ag-assembly.jpg", cap: "Ag building" },
  { src: "/scc/steel-home.png", cap: "Steel home" },
  { src: "/scc/garage.jpg", cap: "Garage kit" },
  { src: "/scc/roof-install.jpg", cap: "Roof install" },
  { src: "/scc/featured.jpg", cap: "SCC kit" },
  { src: "/scc/barn-erection.jpg", cap: "Barn erection" },
];
const POOL = 10;

export function Explore() {
  const area = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) }));
    ro.observe(el);
    if (prefersReducedMotion()) return () => ro.disconnect();

    let lx = -999;
    let ly = -999;
    let n = 0;
    let z = 1;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (readRef.current) readRef.current.textContent = `[${Math.round(x)},${Math.round(y)}]`;
      if (Math.hypot(x - lx, y - ly) < 110) return;
      lx = x;
      ly = y;
      const node = nodes.current[n % POOL];
      const img = IMGS[n % IMGS.length];
      n++;
      if (!node) return;
      const im = node.querySelector("img");
      const cap = node.querySelector("span");
      if (im && im.getAttribute("src") !== img.src) im.setAttribute("src", img.src);
      if (cap) cap.textContent = `${String(n).padStart(3, "0")} · ${img.cap}`;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.zIndex = String((z++ % 90) + 1);
      const rot = (Math.random() - 0.5) * 8;
      node.getAnimations().forEach((a) => a.cancel());
      node.animate(
        [
          { opacity: 0, transform: `translate(-50%,-50%) scale(.55) rotate(${rot}deg)` },
          { opacity: 1, transform: `translate(-50%,-50%) scale(1) rotate(${rot}deg)`, offset: 0.14 },
          { opacity: 1, transform: `translate(-50%,-50%) scale(1) rotate(${rot}deg)`, offset: 0.62 },
          { opacity: 0, transform: `translate(-50%,-36%) scale(.92) rotate(${rot}deg)` },
        ],
        { duration: 1500, easing: "cubic-bezier(.2,.7,.1,1)", fill: "forwards" },
      );
    };
    el.addEventListener("pointermove", move);
    return () => {
      ro.disconnect();
      el.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section id="contact" className="relative border-t border-rule">
      <div className="relative mx-auto max-w-[1440px] border-x border-rule">
        <Cross className="-left-[6px] -top-[6px]" />
        <Cross className="-right-[6px] -top-[6px]" />
        <div ref={area} className="relative min-h-[620px] cursor-crosshair overflow-hidden bg-grid lg:min-h-[720px]">
          {/* trail pool */}
          {Array.from({ length: POOL }, (_, i) => (
            <div
              key={i}
              ref={(n) => {
                nodes.current[i] = n;
              }}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 w-[200px] border border-ink bg-paper p-1 opacity-0 sm:w-[240px]"
            >
              <img src={IMGS[i % IMGS.length].src} alt="" className="print-photo aspect-[4/3] w-full object-cover" />
              <span className="mono-label block px-1 pt-1 text-[9px] text-graphite" />
            </div>
          ))}

          {/* corner coordinates */}
          <span className="mono-label absolute left-3 top-3 text-[10px] text-pencil">[0,0]</span>
          <span className="mono-label absolute right-3 top-3 text-[10px] text-pencil">[{size.w},0]</span>
          <span className="mono-label absolute bottom-3 left-3 text-[10px] text-pencil">[0,{size.h}]</span>
          <span className="mono-label absolute bottom-3 right-3 text-[10px] text-pencil">
            [{size.w},{size.h}]
          </span>

          <div className="pointer-events-none relative z-[100] mx-auto flex min-h-[620px] max-w-[980px] flex-col items-center justify-center px-4 py-20 text-center lg:min-h-[720px]">
            <Label className="justify-center">Speak with an expert</Label>
            <RevealHeading
              text="Talk to a steel building *expert* today"
              className="h-display mt-7 text-[clamp(44px,7.2vw,124px)] text-ink"
            />
            <p className="mt-7 max-w-[560px] text-[17px] leading-relaxed text-graphite">
              Call us today and speak with a steel building expert to see how we can help. Tell us what you&apos;re
              building and we&apos;ll plan the right steel structure for your project.
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap justify-center gap-3">
              <CtaLink href={LINKS.quote} size="lg">
                Contact Us Now
              </CtaLink>
              <CtaLink href={LINKS.phone} size="lg" variant="ink" arrow={false}>
                Call {LINKS.phoneLabel}
              </CtaLink>
            </div>
            <span className="mono-label mt-8 hidden text-[10.5px] text-pencil md:block">
              Move your cursor to flip through our buildings · <span ref={readRef}>[0,0]</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
