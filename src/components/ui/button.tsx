import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline underline-offset-4 hover:no-underline",
        /* The booking button. Must never be missed. */
        cta: "bg-cta text-cta-foreground font-bold shadow-cta hover:bg-cta-hover hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-cta senior:border-2 senior:border-foreground",
        emergency: "bg-emergency text-emergency-foreground font-bold hover:bg-emergency/90",
        onDark:
          "bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 focus-visible:ring-primary-foreground focus-visible:ring-offset-primary",
      },
      size: {
        default: "min-h-11 px-5 py-2",
        sm: "min-h-9 rounded-md px-3 text-sm",
        lg: "min-h-12 px-6 text-lg",
        xl: "min-h-14 rounded-xl px-6 text-lg [&_svg]:size-6 senior:min-h-16",
        hero: "min-h-16 w-full rounded-2xl px-6 text-lg sm:text-xl tracking-wide [&_svg]:size-7 senior:min-h-20",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
