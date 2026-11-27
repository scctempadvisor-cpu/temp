import { CtaLink } from "@/components/ui/button";
import { LINKS } from "@/lib/buildings";
import { FAQS } from "@/lib/site";
import { Label, Section } from "./kit";
import { RevealHeading } from "./motion";

/** Server-rendered FAQ: native <details> so every answer is in the HTML for crawlers. */
export function Faq() {
  return (
    <Section id="faq" className="theme-ink bg-grid" label="Frequently asked questions about steel building kits">
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-rule lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="px-4 py-14 sm:px-6 lg:sticky lg:top-[68px] lg:py-20">
            <Label>FAQ</Label>
            <div id="faq-heading">
              <RevealHeading
                text="Steel building *questions,* answered"
                className="h-display mt-6 text-[clamp(38px,4.6vw,76px)] text-ink"
              />
            </div>
            <p className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-graphite" data-speakable>
              Straight answers about pre-engineered steel building kits, frame systems, engineering, financing and
              installation. Still have a question? A steel building expert is a phone call away.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href={LINKS.quote}>Get a Free Quote</CtaLink>
              <CtaLink href={LINKS.phone} variant="outline" arrow={false}>
                {LINKS.phoneLabel}
              </CtaLink>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {FAQS.map((f, i) => (
            <details key={f.q} className="faq-item group border-b border-rule last:border-b-0" open={i === 0}>
              <summary className="flex cursor-pointer items-start gap-4 px-4 py-5 transition-colors duration-300 hover:bg-paper-2 sm:px-6 sm:py-6">
                <span className="mono mt-1.5 w-8 shrink-0 text-[11px] text-pencil">Q.{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flex-1 font-display text-[clamp(20px,1.9vw,28px)] font-bold uppercase leading-[1.02] tracking-[0.005em] text-ink">
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="faq-plus relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-ink/60 text-ink transition-all duration-500"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current" />
                </span>
              </summary>
              <div className="px-4 pb-7 sm:px-6 sm:pl-[72px]">
                <p className="max-w-[640px] text-[15.5px] leading-relaxed text-graphite">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
