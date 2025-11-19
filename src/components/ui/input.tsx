import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // Base
          "h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base md:text-sm",
          "min-w-0 outline-none shadow-xs transition-[color,box-shadow]",

          // Placeholder & file styling
          "placeholder:text-muted-foreground file:text-foreground",
          "file:bg-transparent file:border-0 file:h-7 file:text-sm file:font-medium",

          // Disabled
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",

          // Selection (text highlight)
          "selection:bg-pink-500/40 selection:text-pink-900",

          // Focus ring (romantic theme)
          "focus-visible:border-pink-400 focus-visible:ring-[3px] focus-visible:ring-pink-400/50",

          // Validation
          "aria-invalid:border-red-500 aria-invalid:ring-red-400/40",

          // Dark mode
          "dark:bg-input/30 dark:border-input",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
