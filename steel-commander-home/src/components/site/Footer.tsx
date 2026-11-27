"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { CtaLink } from "@/components/ui/button";
import { LINKS } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { InView } from "./motion";

const SCC = "https://steelcommandercorp.com";

const COLS = [
  {
    title: "Company",
    links: [
      ["About Us", `${SCC}/about-us-steel-building-kits/`],
      ["Blog", `${SCC}/blog/`],
      ["Learning Center", `${SCC}/?page_id=124`],
      ["Buy Metal Buildings", `${SCC}/?page_id=2694`],
      ["Request A Quote", LINKS.quote],
    ],
  },
  {
    title: "Our Products",
    links: [
      ["Commercial Steel Buildings", `${SCC}/commercial-steel-buildings/`],
      ["Steel Building Homes", `${SCC}/steel-building-homes/`],
      ["Steel Building Kits", `${SCC}/steel-building-kits/`],
      ["Steel Garage Buildings", `${SCC}/steel-garage-buildings/`],
      ["Our Builder Partners", "https://www.mbcea.org/"],
    ],
  },
];

const SOCIAL = [
  ["Facebook", "https://www.facebook.com/steelcommandercorp"],
  ["Twitter", "https://twitter.com/SCommanderCorp/?hl=en"],
  ["Instagram", "https://www.instagram.com/steelcommandercorp/?hl=en"],
  ["LinkedIn", "https://www.linkedin.com/company/steel-commander-corp"],
  ["YouTube", "https://www.youtube.com/@SteelCommanderCorp"],
];

const REVIEW =
  "https://www.google.com/search?q=steel+commander+corp#lrd=0x88d91f8d1e16ee43:0x8a2a58209dc75ca3,1";

function toTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const word = "STEEL COMMANDER".split("");
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,var(--paper)_1px,transparent_1px),linear-gradient(to_bottom,var(--paper)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="relative mx-auto max-w-[1440px] border-x border-paper/15">
        <div className="grid gap-10 border-b border-paper/15 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <img src="/scc/logo-white.png" alt="Steel Commander Corp" className="h-12 w-auto" />
            <p className="mt-6 max-w-[380px] text-[15px] leading-relaxed text-paper/65">
              Steel Commander Corp provides American-made steel building kits shipped factory direct across the
              United States. We help customers design metal buildings for commercial, industrial, agricultural,
              residential, garage, workshop, and storage applications.
            </p>
            <div className="mt-8">
              <CtaLink href={LINKS.quote}>Get A Free Quote</CtaLink>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="mono-label text-[10.5px] text-paper/45">{c.title}</h4>
              <ul className="mt-5 space-y-2.5">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="group inline-flex items-center gap-2 text-[14.5px] text-paper/85 transition-colors hover:text-paper">
                      <span className="h-px w-0 bg-scc transition-all duration-300 group-hover:w-3" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="mono-label text-[10.5px] text-paper/45">Contact</h4>
            <a href={LINKS.phone} className="mt-5 block">
              <span className="mono-label block text-[10px] text-paper/45">Give us a call</span>
              <span className="font-tech text-[26px] font-bold tracking-[0.02em] text-paper">{LINKS.phoneLabel}</span>
              <span className="mono-label block text-[10px] text-scc">844.SCC.IRON</span>
            </a>
            <a href={REVIEW} className="mt-5 inline-block border-b border-scc pb-0.5 text-[14px] text-paper/85 hover:text-paper">
              Leave us a review
            </a>
            <h4 className="mono-label mt-8 text-[10.5px] text-paper/45">Follow us</h4>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {SOCIAL.map(([l, h]) => (
                <li key={l}>
                  <a href={h} target="_blank" rel="noreferrer" className="text-[13.5px] text-paper/75 hover:text-scc">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mono-label text-[10.5px] text-paper/45">Visit us</h4>
            <a href="https://g.page/steel-commander-corp" target="_blank" rel="noreferrer" className="mt-5 block text-[14.5px] leading-relaxed text-paper/85 hover:text-paper">
              2200 Corporate Blvd NW Ste 402
              <br />
              Boca Raton, FL 33431
            </a>
            <a href="https://g.page/steel-commander-corp" target="_blank" rel="noreferrer" className="mono-label mt-3 inline-block text-[10.5px] text-scc">
              Get directions →
            </a>
            <a
              href="https://www.bbb.org/us/fl/boca-raton/profile/metal-building/steel-commander-0633-90566615#bbbseal"
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex w-max items-center gap-3 border border-paper/25 px-3 py-2 transition-colors hover:border-paper/60"
            >
              <span className="font-display text-[22px] font-extrabold leading-none">A+</span>
              <span className="mono-label text-[9.5px] leading-tight text-paper/60">
                BBB
                <br />
                Rated
              </span>
            </a>
          </div>
        </div>

        {/* giant wordmark */}
        <InView className="relative overflow-hidden border-b border-paper/15 px-2 pb-2 pt-8 sm:px-4">
          <div
            aria-label="Steel Commander"
            className="flex select-none justify-between font-display text-[clamp(40px,12.4vw,190px)] font-extrabold leading-[0.8] tracking-[-0.05em]"
          >
            {word.map((ch, i) => (
              <span key={`${ch}-${i}`} className="rv-word" aria-hidden>
                <span className={cn(i >= 6 && "text-scc")} style={{ "--d": `${i * 0.035}s` } as CSSProperties}>
                  {ch === " " ? "\u00a0" : ch}
                </span>
              </span>
            ))}
          </div>
        </InView>

        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="mono-label text-[10px] text-paper/45">Copyright © 2026 Steel Commander Corp · All rights reserved.</p>
          <a href={`${SCC}/privacy-policy/`} className="mono-label text-[10px] text-paper/60 hover:text-paper">
            Privacy Policy
          </a>
          <button
            type="button"
            onClick={toTop}
            className="mono-label flex items-center gap-2 border border-paper/30 px-3 py-1.5 text-[10px] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

/** Heron-style vertical side tab (financing) + mobile call/quote bar */
export function FloatingCtas() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <a
        href={LINKS.financing}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center border border-r-0 border-ink bg-paper transition-transform duration-500 md:flex",
          show ? "translate-x-0" : "translate-x-full",
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center bg-scc font-display text-[18px] font-extrabold text-paper">$</span>
        <span className="mono-label px-2 py-3 text-[10px] text-ink [writing-mode:vertical-rl] group-hover:text-scc">
          Financing? · 60s pre-qual
        </span>
      </a>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink bg-paper transition-transform duration-500 md:hidden",
          show ? "translate-y-0" : "translate-y-full",
        )}
      >
        <a href={LINKS.phone} className="flex h-14 items-center justify-center gap-2 border-r border-ink font-tech text-[16px] font-bold uppercase tracking-[0.04em] text-ink">
          ☎ Call
        </a>
        <a href={LINKS.quote} className="flex h-14 items-center justify-center gap-2 bg-scc font-tech text-[16px] font-bold uppercase tracking-[0.04em] text-paper">
          Free Quote →
        </a>
      </div>
    </>
  );
}
