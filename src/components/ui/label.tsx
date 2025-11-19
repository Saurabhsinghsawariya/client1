"use client";

import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium select-none",
        "transition-colors duration-150",
        "text-gray-700 dark:text-gray-300",
        "peer-focus-visible:text-pink-600 peer-focus-visible:font-semibold",
        "hover:text-pink-500 hover:cursor-pointer",

        // Disabled / invalid states
        "group-data-[disabled=true]:text-gray-400 group-data-[disabled=true]:pointer-events-none",
        "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",

        className
      )}
      {...props}
    />
  );
}

export { Label };
