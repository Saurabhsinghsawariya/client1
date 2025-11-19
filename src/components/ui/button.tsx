import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Romantic Shadcn Button
 * Softer UI, rounded-xl, gentle transitions.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 \
   disabled:pointer-events-none disabled:opacity-50 select-none outline-none focus-visible:ring-[3px] \
   rounded-xl active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm " +
          "focus-visible:ring-destructive/40",

        outline:
          "border border-pink-200 bg-white/70 hover:bg-pink-50 text-pink-600 shadow-sm",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",

        ghost:
          "hover:bg-pink-50 text-pink-600 hover:text-pink-700 shadow-none",

        link: "text-pink-600 underline-offset-4 hover:underline",

        // 🌸 NEW LOVE VARIANT (Gradient)
        love:
          "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 shadow-md",
      },

      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
