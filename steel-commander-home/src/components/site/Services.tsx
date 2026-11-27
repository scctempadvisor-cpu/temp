"use client";

import type { CSSProperties } from "react";
import { r2 } from "@/components/drawings/core";
import { CtaLink } from "@/components/ui/button";
import { LINKS } from "@/lib/buildings";
import { Idx, Label, Section } from "./kit";
import { InView, PlayMark, RevealHeading, VideoDialog } from "./motion";

function TimerDial() {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden>
      <circle cx="70" cy="70" r="64" fill="none" stroke="var(--rule)" strokeWidth="1" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const l = i % 5 === 0 ? 8 : 4;
        return (
          <line
            key={i}
            x1={r2(70 + Math.cos(a) * 64)}
            y1={r2(70 + Math.sin(a) * 64)}
            x2={r2(70 + Math.cos(a) * (64 - l))}
            y2={r2(70 + Math.sin(a) * (64 - l))}
            stroke="var(--graphite)"
            strokeWidth={i % 5 === 0 ? 1 : 0.5}
          />
        );
      })}
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--scc)"
        strokeWidth="6"
        strokeDasharray={c}
        transform="rotate(-90 70 70)"
        className="[stroke-dashoffset:var(--c)] [transition:stroke-dashoffset_2.4s_cubic-bezier(.2,.75,.1,1)_.3s] [.in_&]:[stroke-dashoffset:0]"
        style={{ "--c": `${c.toFixed(1)}px` } as CSSProperties}
      />
      <text x="70" y="76" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--ink)" style={{ fontFamily: "var(--font-montserrat)" }}>
        60s
      </text>
      <text x="70" y="92" textAnchor="middle" fontSize="7" fill="var(--graphite)" style={{ fontFamily: "var(--font-plex-mono)", letterSpacing: "1px" }}>
        PRE-QUALIFY
      </text>
    </svg>
  );
}

function BuilderPins() {
  const pins = [
    [22, 38],
    [48, 24],
    [70, 52],
    [36, 66],
    [84, 30],
    [60, 78],
  ];
  return (
    <div className="relative h-full w-full bg-grid">
      <img src="/scc/cert-mbcea.png" alt="MBCEA" className="absolute bottom-3 right-3 h-9 w-auto mix-blend-multiply" />
      {pins.map(([x, y], i) => (
        <span
          key={`${x}${y}`}
          className="fu absolute"
          style={{ left: `${x}%`, top: `${y}%`, "--d": `${0.3 + i * 0.12}s` } as CSSProperties}
        >
          <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-scc/30 animate-ping-soft" />
          <svg viewBox="0 0 12 16" className="relative -ml-1.5 -mt-4 h-4 w-3" fill="var(--scc)">
            <path d="M6 0a6 6 0 0 1 6 6c0 4.5-6 10-6 10S0 10.5 0 6a6 6 0 0 1 6-6z" />
            <circle cx="6" cy="6" r="2.2" fill="var(--paper)" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function Services() {
  const cards = [
    {
      k: "Simple · intuitive · easy",
      title: "Design your SCC steel building",
      body: "Configure size, roof pitch, lean-tos, doors and colors in our online 3D building designer, then send it straight to an expert for pricing.",
      cta: "Start Building Now!",
      href: LINKS.design,
      ext: true,
      visual: <img src="/scc/designer.png" alt="Steel Commander 3D building designer" className="h-full w-full object-contain p-3" />,
    },
    {
      k: "Fund it as soon as tomorrow",
      title: "Need help with financing?",
      body: "We make your metal building purchase as stress-free as possible. Whatever your financial situation, we want to help you afford the building of your dreams.",
      note: "*60 seconds pre-qualification. Does not affect credit score.",
      cta: "Get Started!",
      href: LINKS.financing,
      ext: true,
      visual: (
        <div className="flex h-full items-center justify-center p-4">
          <div className="h-full max-h-[160px] w-auto">
            <TimerDial />
          </div>
        </div>
      ),
    },
    {
      k: "MBCEA partnership",
      title: "Need help with installation?",
      body: "View builders in your area through our partnership with the Metal Building Contractors & Erectors Association (MBCEA).",
      cta: "View Builders",
      href: LINKS.builders,
      ext: true,
      visual: <BuilderPins />,
    },
  ];

  return (
    <Section id="services" className="theme-ink">
      <div className="flex flex-wrap items-end justify-between gap-6 px-4 pb-10 pt-16 sm:px-6 lg:pt-24">
        <div>
          <Label>Services</Label>
          <RevealHeading text="Design it. Finance it. *Build* it." className="h-display mt-6 text-[clamp(36px,5vw,80px)] text-ink" />
        </div>
        <span className="mono-label text-[11px] text-pencil">[ 03 ways we help ]</span>
      </div>
      <InView className="grid border-t border-rule md:grid-cols-3">
        {cards.map((c, i) => (
          <article
            key={c.title}
            className="fu group flex flex-col border-b border-rule md:border-b-0 md:border-r md:last:border-r-0"
            style={{ "--d": `${i * 0.1}s` } as CSSProperties}
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <span className="mono-label text-[10.5px] text-scc">{c.k}</span>
              <Idx n={i + 1} />
            </div>
            <div className="theme-paper relative h-[210px] overflow-hidden border-b border-[#3b3b37] bg-paper-2 transition-colors duration-500 group-hover:bg-paper">
              {c.visual}
            </div>
            <div className="flex flex-1 flex-col px-5 py-7">
              <h3 className="font-display text-[30px] font-bold uppercase leading-[0.94] tracking-[0.005em] text-ink">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-graphite">{c.body}</p>
              {c.note && <p className="mt-3 text-[12.5px] italic text-pencil">{c.note}</p>}
              <div className="mt-auto pt-7">
                <CtaLink href={c.href} target={c.ext ? "_blank" : undefined} rel={c.ext ? "noreferrer" : undefined} variant={i === 1 ? "default" : "ink"}>
                  {c.cta}
                </CtaLink>
              </div>
            </div>
          </article>
        ))}
      </InView>
    </Section>
  );
}

export function Welcome() {
  return (
    <Section id="welcome">
      <div className="grid lg:grid-cols-12">
        <div className="relative border-b border-rule px-4 py-14 sm:px-6 lg:col-span-7 lg:border-b-0 lg:border-r lg:py-20">
          <Label>Welcome</Label>
          <RevealHeading
            text="Welcome to the steel buildings of your *dreams*"
            className="h-display mt-6 text-[clamp(32px,4vw,64px)] text-ink"
          />
          <p className="mt-6 max-w-[620px] text-[16.5px] leading-relaxed text-graphite">
            When you need the most exceptional steel buildings for commercial or home use, Steel Commander Corp is the
            superior choice to help you from beginning to end with the design and delivery of your steel building kits.
            Call us today and speak with a steel building expert to see how we can help.
          </p>
          <VideoDialog videoId="mgVZSIEGFus" title="Welcome to the steel buildings of your dreams">
            <button
              type="button"
              className="group relative mt-10 block w-full overflow-hidden border border-ink/80 text-left"
              aria-label="Play the welcome video"
            >
              <img
                src="/scc/gambrel.jpg"
                alt=""
                className="print-photo aspect-[16/8] w-full object-cover transition-transform [transition-duration:1.2s] ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayMark />
              </span>
              <span className="mono-label absolute left-0 top-0 bg-ink px-2.5 py-1.5 text-[10px] text-paper">Fig. 02 · Gambrel exterior</span>
            </button>
          </VideoDialog>
        </div>

        <InView className="flex flex-col justify-between px-4 py-14 sm:px-6 lg:col-span-5 lg:py-20">
          <div>
            <div className="flex items-center justify-between">
              <Label>Testimonial</Label>
              <span className="flex gap-1 text-scc" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2 3.5 14.6l.9-5L.8 6.1l5-.7z" />
                  </svg>
                ))}
              </span>
            </div>
            <svg viewBox="0 0 40 30" className="fu mt-10 h-10 w-12 text-scc" fill="currentColor" aria-hidden>
              <path d="M0 30V17C0 7 5 1.5 15 0l1.5 3.5C11 5 8.5 8 8 13h7v17zm23 0V17c0-10 5-15.5 15-17l1.5 3.5C34 5 31.5 8 31 13h7v17z" />
            </svg>
            <blockquote className="fu mt-6 font-display text-[clamp(20px,1.8vw,27px)] font-medium leading-[1.35] tracking-[-0.01em] text-ink" style={{ "--d": ".1s" } as CSSProperties}>
              I bought this building from Steel Commander Corp and they&apos;re the best there is. They designed it for
              me and it&apos;s 50&nbsp;×&nbsp;40. They&apos;re super nice, super friendly. I had free delivery included in the
              price. Can&apos;t ask for anything better than this. Thank you guys so much.
            </blockquote>
          </div>
          <div className="fu mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-rule pt-5" style={{ "--d": ".2s" } as CSSProperties}>
            <div>
              <p className="font-tech text-[20px] font-bold uppercase tracking-[0.03em] text-ink">Semsudin Dervisevic</p>
              <p className="mono-label text-[10px] text-pencil">50' × 40' steel building · Verified customer</p>
            </div>
            <CtaLink href={LINKS.reviews} size="sm" variant="outline">
              Read Customer Reviews
            </CtaLink>
          </div>
        </InView>
      </div>
    </Section>
  );
}

const CERTS = [
  { name: "Metal Building Contractors & Erectors Association", src: "/scc/cert-mbcea.png" },
  { name: "USGBC", src: "/scc/cert-usgbc.png" },
  { name: "Energy Star", src: "/scc/cert-energy-star.png" },
  { name: "Certified CSA A660", src: "/scc/cert-csa.png" },
  { name: "CWB", src: "/scc/cert-cwb.png" },
  { name: "AWS", src: "/scc/cert-aws.png" },
];

export function Certs() {
  return (
    <Section id="certifications" crosses={false}>
      <div className="grid grid-cols-3 sm:grid-cols-6">
        {CERTS.map((c, i) => (
          <div
            key={c.name}
            title={c.name}
            className="group relative flex h-24 items-center justify-center border-r border-rule px-4 last:border-r-0 max-sm:[&:nth-child(3)]:border-r-0 max-sm:[&:nth-child(-n+3)]:border-b"
          >
            <span className="mono absolute left-2 top-1.5 text-[9px] text-pencil">C-{i + 1}</span>
            <img
              src={c.src}
              alt={c.name}
              loading="lazy"
              className="max-h-10 w-auto max-w-[80%] object-contain opacity-70 mix-blend-multiply grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
