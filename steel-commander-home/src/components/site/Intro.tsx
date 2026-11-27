"use client";

import { CtaLink } from "@/components/ui/button";
import { CLIENTS, LINKS } from "@/lib/buildings";
import { Cross, Idx, Label, Section } from "./kit";
import { InView, PlayMark, RevealHeading, ScrubWords, VideoDialog } from "./motion";

const BODY =
  "Steel Commander Corp helps you plan a custom *pre-engineered* steel building kit for *commercial,* *residential,* *agricultural,* and *storage* projects. From barndominiums and garages to hangars, workshops, and farm buildings, our experts are ready to help.";

export function Intro() {
  return (
    <Section id="intro">
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-rule px-4 py-14 sm:px-6 lg:col-span-7 lg:border-b-0 lg:border-r lg:py-20 lg:pr-12">
          <div className="flex items-center justify-between">
            <Label>Introduction</Label>
            <Idx n={1} />
          </div>
          <RevealHeading
            text="Need a steel building? Start with a *custom* kit built around your project."
            className="h-display mt-8 text-[clamp(34px,4.4vw,68px)] text-ink"
          />
          <ScrubWords
            text={BODY}
            className="mt-10 max-w-[720px] font-display text-[clamp(20px,1.8vw,28px)] font-medium leading-[1.35] tracking-[-0.01em] text-ink"
          />
          <InView className="mt-10 flex flex-wrap gap-3">
            <span className="fu">
              <CtaLink href={LINKS.reviews} variant="ink">
                Read Customer Reviews
              </CtaLink>
            </span>
            <span className="fu" style={{ "--d": ".08s" } as React.CSSProperties}>
              <CtaLink href={LINKS.quote} variant="outline">
                Get a Free Quote
              </CtaLink>
            </span>
          </InView>
        </div>

        <div className="relative flex flex-col px-4 py-10 sm:px-6 lg:col-span-5 lg:py-20">
          <div className="mono-label mb-3 flex items-center justify-between text-[10px] text-pencil">
            <span>Fig. 01 · Steel Commander Corp</span>
            <span>02:14</span>
          </div>
          <VideoDialog videoId="W4vCFjBK5uk" title="Steel Commander Corp · Steel building kits">
            <button
              type="button"
              className="group relative block w-full overflow-hidden border border-ink/80 bg-paper-2 text-left"
              aria-label="Play the Steel Commander Corp video"
            >
              <img
                src="/scc/featured.jpg"
                alt=""
                className="print-photo aspect-[4/3] w-full object-cover transition-transform [transition-duration:1.2s] ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(29,29,27,.35))]" />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayMark />
              </span>
              <span className="mono-label absolute bottom-0 left-0 bg-ink px-2.5 py-1.5 text-[10px] text-paper">
                ▶ Watch: how a kit comes together
              </span>
              <span className="mono-label absolute right-0 top-0 bg-scc px-2 py-1 text-[10px] text-paper">Video</span>
            </button>
          </VideoDialog>
          <dl className="mt-6 grid grid-cols-2 border-l border-t border-rule">
            {[
              ["Made", "American-made"],
              ["Shipping", "Factory direct"],
              ["Engineering", "Stamped per state"],
              ["Systems", "C-Channel · I-Beam"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-r border-rule px-3 py-3">
                <dt className="mono-label text-[10px] text-pencil">{k}</dt>
                <dd className="mt-1 font-tech text-[17px] font-semibold uppercase tracking-[0.03em] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* customers */}
      <div className="border-t border-rule">
        <div className="flex flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6">
          <Label>Our customers</Label>
          <p className="max-w-[520px] text-[14px] leading-relaxed text-graphite">
            Steel Commander kits are working hard for brands and communities across the country, from tour stops to
            dealerships to tribal operations.
          </p>
        </div>
        <InView className="relative grid grid-cols-2 border-t border-rule sm:grid-cols-4">
          {CLIENTS.map((c, i) => (
            <div
              key={c.name}
              className="fu group relative flex aspect-[16/9] items-center justify-center border-b border-r border-rule bg-paper p-6 transition-colors duration-500 hover:bg-white/60 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
              style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
            >
              <span className="mono absolute left-3 top-2.5 text-[10px] text-pencil">[{String(i + 1).padStart(2, "0")}]</span>
              <img
                src={c.src}
                alt={c.name}
                loading="lazy"
                className="max-h-[70%] w-auto max-w-[78%] object-contain mix-blend-multiply grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <span className="mono-label absolute bottom-2.5 right-3 text-[9.5px] text-pencil opacity-0 transition-opacity group-hover:opacity-100">
                {c.name}
              </span>
            </div>
          ))}
          <Cross className="-left-[6px] -top-[6px]" />
          <Cross className="-right-[6px] -top-[6px]" />
          <Cross className="left-1/2 -top-[6px] -ml-[5px]" />
        </InView>
      </div>
    </Section>
  );
}
