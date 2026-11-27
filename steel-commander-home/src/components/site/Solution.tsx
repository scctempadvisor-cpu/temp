"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./kit";
import { CountUp, InView, RevealHeading } from "./motion";

const STATS = [
  { code: "S-01", pre: "up to", to: 50, unit: "%", label: ["Reduced", "cost"], gauge: 0.5 },
  { code: "S-02", pre: "up to", to: 5, unit: "X", label: ["Less", "maintenance"], gauge: 1, blocks: 5 },
  { code: "S-03", pre: "", to: 25, unit: "%", label: ["Insurance", "savings"], gauge: 0.25 },
  { code: "S-04", pre: "", to: 98, unit: "%", label: ["Steel materials", "are recycled"], gauge: 0.98 },
];

function PaperCross({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 block h-[11px] w-[11px] before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-paper/70 after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-paper/70",
        className,
      )}
    />
  );
}

export function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,var(--paper)_1px,transparent_1px),linear-gradient(to_bottom,var(--paper)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="relative mx-auto max-w-[1440px] border-x border-paper/15">
        <PaperCross className="-left-[6px] -top-[6px]" />
        <PaperCross className="-right-[6px] -top-[6px]" />
        <div className="grid gap-8 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-20 lg:pt-24">
          <div className="lg:col-span-7">
            <Label tone="paper">The solution</Label>
            <RevealHeading
              text="The solution is *steel*"
              className="h-display mt-6 text-[clamp(48px,8vw,136px)] text-paper"
            />
          </div>
          <InView className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="fu text-[17px] leading-relaxed text-paper/70">
              Steel buildings are an investment that will last a lifetime. Superior strength, a spacious clear-span
              interior, and real savings that keep adding up long after the ribbon cutting.
            </p>
          </InView>
        </div>

        <InView className="grid grid-cols-2 border-t border-paper/15 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.code}
              className="fu group relative flex flex-col border-b border-r border-paper/15 px-4 pb-8 pt-5 sm:px-6 lg:border-b-0 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
              style={{ "--d": `${i * 0.1}s` } as CSSProperties}
            >
              <div className="mono-label flex items-center justify-between text-[10px] text-paper/45">
                <span>[{s.code}]</span>
                <span>{s.pre || "\u00a0"}</span>
              </div>
              <div className="mt-8 flex items-start font-display font-extrabold leading-[0.82] tracking-[-0.05em]">
                <CountUp to={s.to} className="text-[clamp(64px,8.4vw,140px)]" />
                <span className="mt-2 text-[clamp(28px,3.4vw,56px)] text-scc">{s.unit}</span>
              </div>
              <h3 className="mt-5 font-tech text-[clamp(18px,1.6vw,24px)] font-semibold uppercase leading-[1.05] tracking-[0.03em]">
                {s.label[0]}
                <br />
                <span className="text-paper/55">{s.label[1]}</span>
              </h3>

              {/* gauge */}
              <div className="mt-auto pt-8">
                {s.blocks ? (
                  <div className="flex gap-1.5">
                    {Array.from({ length: s.blocks }, (_, j) => (
                      <span
                        key={j}
                        className="h-3 flex-1 origin-left scale-x-0 bg-scc transition-transform duration-500 [.in_&]:scale-x-100"
                        style={{ transitionDelay: `${0.5 + j * 0.14}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative h-3 border border-paper/30">
                    <span
                      className="absolute inset-y-0 left-0 origin-left scale-x-0 bg-scc transition-transform [transition-duration:1.6s] [transition-timing-function:cubic-bezier(.2,.75,.1,1)] [.in_&]:scale-x-100"
                      style={{ width: `${s.gauge * 100}%`, transitionDelay: ".45s" }}
                    />
                    <span className="absolute inset-0 [background-image:repeating-linear-gradient(to_right,rgba(242,242,235,.35)_0_1px,transparent_1px_10%)]" />
                  </div>
                )}
                <div className="mono-label mt-2 flex justify-between text-[9.5px] text-paper/40">
                  <span>0</span>
                  <span>{s.blocks ? "5X" : "100%"}</span>
                </div>
              </div>
            </div>
          ))}
        </InView>
      </div>
    </section>
  );
}
