"use client";

import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { FloorPlan } from "@/components/drawings/FloorPlan";
import { CtaLink } from "@/components/ui/button";
import { BUILDINGS, LINKS } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { Check, Idx, Label, Section } from "./kit";
import { InView, InkImage, Plotted, RevealHeading } from "./motion";

const BENEFITS: [string, number][] = [
  ["Great appearance", 0],
  ["Design and size flexibility", 0],
  ["Efficient design capabilities", 1],
  ["Economical start-up cost", 3],
  ["Fast construction", 3],
  ["Green building materials", 2],
  ["Permanence with non-combustible materials", 1],
  ["Load requirements designed to fit your needs", 0],
  ["A finished look, with all structural steel shop-coated with gray oxide primer", 2],
];

type Sticker = { code: string; text: string; tone: "ink" | "red"; x: string; y: string };

const STAGES: {
  verb: string;
  title: string;
  body: string;
  visual: "designer" | "plan" | "roof" | "site";
  stickers: Sticker[];
}[] = [
  {
    verb: "Plan",
    title: "Talk to a steel building expert",
    body: "Tell us what you're building. An expert helps you size it, choose a frame system and spec doors, windows and lean-tos. Prefer to tinker? Design it yourself in our 3D building designer.",
    visual: "designer",
    stickers: [
      { code: "3D", text: "Design your building", tone: "ink", x: "4%", y: "8%" },
      { code: "$0", text: "Free quote", tone: "red", x: "64%", y: "70%" },
    ],
  },
  {
    verb: "Engineer",
    title: "Engineered for your property",
    body: "Steel Commander Corp creates a detailed engineering plan that's custom to your property and adheres to your state's specifications. Every state has its own building codes, and we handle them.",
    visual: "plan",
    stickers: [
      { code: "PE", text: "Stamped drawings", tone: "red", x: "58%", y: "6%" },
      { code: "CODE", text: "State specific", tone: "ink", x: "6%", y: "74%" },
    ],
  },
  {
    verb: "Fabricate",
    title: "Heavy-duty steel, finished right",
    body: "Kits can be fortified with heavy-duty C-channels and red iron I-beams. All structural steel is shop-coated with gray oxide primer for a clean, finished look.",
    visual: "roof",
    stickers: [
      { code: "I-BEAM", text: "Red iron frames", tone: "ink", x: "5%", y: "10%" },
      { code: "PRIMER", text: "Gray oxide shop coat", tone: "red", x: "56%", y: "76%" },
    ],
  },
  {
    verb: "Deliver",
    title: "Shipped factory direct",
    body: "Your American-made kit ships factory direct, ready for your crew. Need installers? Find vetted builders in your area through our partnership with the MBCEA.",
    visual: "site",
    stickers: [
      { code: "USA", text: "American-made", tone: "red", x: "6%", y: "8%" },
      { code: "MBCEA", text: "Builder network", tone: "ink", x: "60%", y: "72%" },
    ],
  },
];

function StickerBox({ s, i }: { s: Sticker; i: number }) {
  return (
    <div
      className="fu absolute z-10 flex"
      style={{ left: s.x, top: s.y, "--d": `${0.5 + i * 0.18}s` } as CSSProperties}
    >
      <span className={cn("mono-label px-2 py-1.5 text-[10px] text-paper", s.tone === "red" ? "bg-scc" : "bg-ink")}>
        {s.code}
      </span>
      <span className="border border-l-0 border-ink/80 bg-paper px-2 py-1.5 font-display text-[14px] font-bold uppercase leading-none tracking-[0.02em] text-ink">
        {s.text}
      </span>
    </div>
  );
}

function Visual({ kind }: { kind: (typeof STAGES)[number]["visual"] }) {
  if (kind === "plan") {
    const ws = BUILDINGS.find((b) => b.id === "workshop") ?? BUILDINGS[0];
    return (
      <div className="relative aspect-[4/3] w-full border border-ink/70 bg-paper bg-grid-fine p-3">
        <Plotted className="h-full w-full" opts={{ total: 1.8, dur: 0.8 }}>
          <FloorPlan spec={ws.plan} basePx={620} className="h-full w-full" />
        </Plotted>
      </div>
    );
  }
  const src =
    kind === "designer" ? "/scc/designer.png" : kind === "roof" ? "/scc/roof-install.jpg" : "/scc/ag-assembly.jpg";
  return (
    <div className="relative w-full border border-ink/70 bg-paper-2">
      <InkImage
        src={src}
        alt={kind === "designer" ? "Steel Commander 3D building designer" : "Steel building construction"}
        w={400}
        h={300}
        seed={kind.length}
        print={kind !== "designer"}
        pos={kind === "site" ? "xMidYMax" : "xMidYMid"}
      />
    </div>
  );
}

function StageCard({
  i,
  stage,
  onActive,
}: {
  i: number;
  stage: (typeof STAGES)[number];
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(i), {
      rootMargin: "-45% 0px -45% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [i, onActive]);
  return (
    <div ref={ref} className="border-b border-rule px-4 py-12 last:border-b-0 sm:px-8 lg:py-20">
      <InView>
        <div className="flex items-baseline justify-between">
          <span className="fu font-display text-[clamp(40px,5vw,76px)] font-extrabold uppercase leading-none tracking-[0em] text-ink">
            {stage.verb}
          </span>
          <Idx n={i + 1} className="fu" />
        </div>
        <div className="relative mt-8">
          <Visual kind={stage.visual} />
          {stage.stickers.map((s, j) => (
            <StickerBox key={s.code} s={s} i={j} />
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-5">
          <h3 className="fu font-tech text-[22px] font-bold uppercase leading-[1.05] tracking-[0.02em] text-ink sm:col-span-2">
            {stage.title}
          </h3>
          <p className="fu text-[15.5px] leading-relaxed text-graphite sm:col-span-3" style={{ "--d": ".08s" } as CSSProperties}>
            {stage.body}
          </p>
        </div>
      </InView>
    </div>
  );
}

function ServiceCard({ icon, title, body, idx }: { icon: ReactNode; title: string; body: string; idx: number }) {
  return (
    <div className="fu group relative flex flex-col border-rule p-6 sm:p-8" style={{ "--d": `${idx * 0.1}s` } as CSSProperties}>
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center border border-ink text-scc transition-colors group-hover:bg-ink">
          {icon}
        </span>
        <Idx n={`S-0${idx + 1}`} />
      </div>
      <h3 className="mt-6 font-display text-[24px] font-bold uppercase leading-none tracking-[0.005em] text-ink">{title}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-graphite">{body}</p>
      <div className="mt-6">
        <CtaLink href={LINKS.quote} size="sm">
          Get a Free Quote
        </CtaLink>
      </div>
    </div>
  );
}

export function Why() {
  const [active, setActive] = useState(-1);
  const [reached, setReached] = useState(-1);
  const crossRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLSpanElement>(null);
  const vRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLSpanElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);
  const colRef = useRef<HTMLDivElement>(null);

  const onActive = useCallback((i: number) => {
    setActive(i);
    setReached((r) => Math.max(r, i));
  }, []);

  // drafting crosshair that follows the pointer across the stage column
  useEffect(() => {
    const col = colRef.current;
    const cross = crossRef.current;
    if (!col || !cross) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let primed = false;
    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      const x = cx.toFixed(1);
      const y = cy.toFixed(1);
      if (hRef.current) hRef.current.style.transform = `translate3d(0,${y}px,0)`;
      if (vRef.current) vRef.current.style.transform = `translate3d(${x}px,0,0)`;
      if (reticleRef.current) reticleRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (xRef.current) xRef.current.textContent = String(Math.round(cx)).padStart(4, "0");
      if (yRef.current) yRef.current.textContent = String(Math.round(cy)).padStart(4, "0");
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = col.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!primed) {
        cx = tx;
        cy = ty;
        primed = true;
      }
      cross.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      cross.style.opacity = "0";
      primed = false;
    };
    col.addEventListener("pointermove", move);
    col.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      col.removeEventListener("pointermove", move);
      col.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <Section id="why">
      <div className="grid lg:grid-cols-12">
        {/* sticky column */}
        <div className="border-b border-rule lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="px-4 py-14 sm:px-6 lg:sticky lg:top-[68px] lg:py-16">
            <Label>Why us</Label>
            <RevealHeading
              text="Why choose Steel Commander *Corp?*"
              className="h-display mt-6 text-[clamp(36px,4.2vw,66px)] text-ink"
            />
            <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-graphite">
              Steel Commander Corp offers a variety of <strong className="font-semibold text-ink">steel building kit</strong>{" "}
              solutions for whatever end-use you have in mind. We work fast and affordably without compromising on
              your steel building&apos;s quality.
            </p>

            <ul className="mt-8 border-t border-rule">
              {BENEFITS.map(([b, s]) => {
                const on = s <= reached;
                return (
                  <li
                    key={b}
                    className={cn(
                      "flex items-start gap-3 border-b border-rule py-2 text-[14px] leading-snug transition-colors duration-500",
                      on ? "text-ink" : "text-pencil",
                      s === active && "text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors duration-500",
                        on ? "border-scc bg-scc text-paper" : "border-pencil/60",
                      )}
                    >
                      {on && <Check className="h-2.5 w-2.5" />}
                    </span>
                    <span>{b}</span>
                    <span className="mono ml-auto shrink-0 text-[10px] text-pencil">0{s + 1}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center gap-4">
              {STAGES.map((st, i) => (
                <span
                  key={st.verb}
                  className={cn(
                    "mono-label text-[10px] transition-colors",
                    i === active ? "text-scc" : i <= reached ? "text-ink" : "text-pencil",
                  )}
                >
                  {String(i + 1).padStart(2, "0")} {st.verb}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* stages */}
        <div ref={colRef} className="relative lg:col-span-7 lg:cursor-crosshair">
          <div
            ref={crossRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 hidden overflow-hidden opacity-0 transition-opacity duration-300 lg:block"
          >
            {/* horizontal hair */}
            <span ref={hRef} className="absolute inset-x-0 top-0 block h-px border-t border-dashed border-scc/80">
              <span className="mono-label absolute right-2 top-1 bg-scc px-1.5 py-0.5 text-[9px] text-paper">
                Y:<span ref={yRef}>0000</span>
              </span>
            </span>
            {/* vertical hair */}
            <span ref={vRef} className="absolute inset-y-0 left-0 block w-px border-l border-dashed border-scc/80">
              <span className="mono-label absolute left-1 top-2 bg-ink px-1.5 py-0.5 text-[9px] text-paper">
                X:<span ref={xRef}>0000</span>
              </span>
            </span>
            {/* reticle */}
            <span ref={reticleRef} className="absolute left-0 top-0 block">
              <span className="absolute -left-[14px] -top-[14px] h-7 w-7 rounded-full border border-scc" />
              <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 bg-scc" />
              <span className="absolute -left-[22px] top-0 h-px w-[6px] bg-scc" />
              <span className="absolute left-[16px] top-0 h-px w-[6px] bg-scc" />
              <span className="absolute -top-[22px] left-0 h-[6px] w-px bg-scc" />
              <span className="absolute left-0 top-[16px] h-[6px] w-px bg-scc" />
            </span>
          </div>
          {STAGES.map((s, i) => (
            <StageCard key={s.verb} i={i} stage={s} onActive={onActive} />
          ))}
        </div>
      </div>

      {/* service promises */}
      <InView className="grid border-t border-rule md:grid-cols-2 md:[&>*:first-child]:border-r">
        <ServiceCard
          idx={0}
          title="Unparalleled customer service"
          body="When you do business with us, you get an exceptional steel building product and unparalleled customer service. Many kits can be fortified with heavy-duty C-channels and red iron I-beams."
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13h3v6H4zM17 13h3v6h-3zM20 19a4 4 0 0 1-4 3h-3" />
            </svg>
          }
        />
        <ServiceCard
          idx={1}
          title="The steel building experts"
          body="There's a lot to look out for when purchasing a steel building kit. That's why it pays to call a steel building expert and ask the important questions before you buy."
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M9 11h6" />
            </svg>
          }
        />
      </InView>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-4 sm:px-6">
        <p className="text-[14px] text-graphite">
          Check out our{" "}
          <a href={LINKS.faq} className="font-semibold text-ink underline decoration-scc decoration-2 underline-offset-4 hover:text-scc">
            FAQs section
          </a>{" "}
          and give us a holler at your convenience.
        </p>
        <a href={LINKS.phone} className="mono-label text-[11px] text-ink hover:text-scc">
          ☎ {LINKS.phoneLabel}
        </a>
      </div>
    </Section>
  );
}
