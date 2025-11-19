"use client";

import { cn } from "@/lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] outline-none",
          "transition-all duration-150",
          "focus-visible:ring-[3px] focus-visible:ring-pink-400/40"
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* Pretty ScrollBar */}
      <ScrollBar />

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        "p-[2px] rounded-full",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          "flex-1 rounded-full relative",
          "bg-pink-300 dark:bg-pink-400",
          "opacity-60 hover:opacity-90 transition-opacity",
          "shadow-sm hover:shadow-pink-300/50"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
