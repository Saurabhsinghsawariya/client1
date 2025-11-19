"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-20 w-full rounded-xl border border-amber-200/60 bg-white/60 dark:bg-neutral-800/40 ",
        "px-4 py-3 text-base md:text-sm resize-none shadow-sm",
        "placeholder:text-amber-300 dark:placeholder:text-neutral-500",
        "transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-pink-400/50 focus-visible:border-pink-400",
        "focus:bg-white dark:focus:bg-neutral-900",
        "disabled:cursor-not-allowed disabled:opacity-50 outline-none",
        "aria-invalid:border-red-500 aria-invalid:ring-red-300",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
