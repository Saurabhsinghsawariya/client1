"use client";

import { useEffect, useState } from "react";

interface HeartConfig {
  top: string;
  left: string;
  size: string;
  duration: string;
  icon: string;
}

export default function FloatingHearts({ count = 12 }) {
  const [hearts, setHearts] = useState<HeartConfig[] | null>(null);

  useEffect(() => {
    // Generate ONLY on client → avoids hydration mismatch
    const list: HeartConfig[] = Array.from({ length: count }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${12 + Math.random() * 22}px`,
      duration: `${3 + Math.random() * 4}s`,
      icon: Math.random() > 0.5 ? "💖" : "✨",
    }));

    setHearts(list);
  }, [count]);

  // Avoid rendering until the client generates random values
  if (!hearts) return null;

  return (
    <>
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute text-pink-400 opacity-60 animate-float-soft pointer-events-none select-none"
          style={{
            top: h.top,
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
          }}
        >
          {h.icon}
        </span>
      ))}
    </>
  );
}
