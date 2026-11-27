import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-stretch whitespace-nowrap font-tech font-semibold uppercase tracking-[0.06em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scc focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-scc text-paper shadow-[0_3px_0_0_var(--scc-dark)] hover:bg-scc-dark",
        ink: "bg-ink text-paper hover:bg-graphite",
        outline:
          "border border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:text-scc",
        link: "text-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 text-[15px]",
        sm: "h-9 text-[13px]",
        lg: "h-[52px] text-[17px]",
        icon: "h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/** Heron-style split button: rolling label | dashed divider | arrow cell */
function CtaInner({
  children,
  arrow = true,
}: {
  children: React.ReactNode;
  arrow?: boolean;
}) {
  return (
    <>
      <span className="flex items-center px-5">
        <span className="roll">
          <span>{children}</span>
          <span aria-hidden>{children}</span>
        </span>
      </span>
      {arrow && (
        <span className="relative flex w-11 items-center justify-center border-l border-dashed [border-left-color:color-mix(in_srgb,currentColor_45%,transparent)]">
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </span>
      )}
    </>
  );
}

type CtaLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & { arrow?: boolean };

function CtaLink({
  className,
  variant,
  size,
  arrow = true,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <CtaInner arrow={arrow}>{children}</CtaInner>
    </a>
  );
}

export { Button, CtaLink, CtaInner, buttonVariants };
