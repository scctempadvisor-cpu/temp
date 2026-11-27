import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "+" registration mark used at grid intersections */
export function Cross({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 block h-[11px] w-[11px] before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-ink after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-ink",
        className,
      )}
    />
  );
}

/** Accessible names for landmark sections (screen readers + crawlers) */
const SECTION_LABELS: Record<string, string> = {
  intro: "About Steel Commander Corp steel building kits",
  problems: "The problem with traditional building materials",
  why: "Why choose Steel Commander Corp",
  products: "Steel building frame systems: C-channel and rigid frame",
  "plan-room": "Sample steel building plans",
  uses: "Steel building use cases",
  services: "Design, financing and installation services",
  welcome: "Welcome video and customer testimonial",
  certifications: "Certifications and memberships",
};

/** Section wrapper: hairline top rule + crosses at the container edges */
export function Section({
  id,
  children,
  className,
  inner,
  crosses = true,
  label,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  inner?: string;
  crosses?: boolean;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label ?? (id ? SECTION_LABELS[id] : undefined)}
      className={cn("relative border-t border-rule", className)}
    >
      <div className={cn("relative mx-auto max-w-[1440px] border-x border-rule", inner)}>
        {crosses && (
          <>
            <Cross className="-left-[6px] -top-[6px]" />
            <Cross className="-right-[6px] -top-[6px]" />
          </>
        )}
        {children}
      </div>
    </section>
  );
}

export function Label({
  children,
  className,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "red" | "paper";
}) {
  return (
    <div
      className={cn(
        "mono-label flex items-center gap-2",
        tone === "red" && "text-scc",
        tone === "paper" && "text-paper/70",
        tone === "ink" && "text-graphite",
        className,
      )}
    >
      <span className={cn("h-[7px] w-[7px]", tone === "paper" ? "bg-scc" : "bg-scc")} />
      {children}
    </div>
  );
}

export function Idx({ n, className }: { n: number | string; className?: string }) {
  return (
    <span className={cn("mono text-[12px] text-pencil", className)}>
      [{typeof n === "number" ? String(n).padStart(2, "0") : n}]
    </span>
  );
}

/** Brand wordmark rebuilt in type so it reads on paper */
export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src="/scc/shield.png" alt="" className="h-10 w-10 shrink-0 object-contain" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-brand text-[15px] font-extrabold uppercase tracking-[-0.01em]",
            dark ? "text-paper" : "text-ink",
          )}
        >
          Steel Commander
        </span>
        <span className="mt-[5px] flex items-center gap-1.5">
          <span className="h-[2px] w-5 bg-scc" />
          <span
            className={cn(
              "font-brand text-[9.5px] font-medium uppercase tracking-[0.55em]",
              dark ? "text-paper/60" : "text-graphite",
            )}
          >
            Corp
          </span>
          <span className="h-[2px] flex-1 bg-scc" />
        </span>
      </span>
    </span>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("h-3.5 w-3.5", className)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={cn("h-3 w-6", className)} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}
