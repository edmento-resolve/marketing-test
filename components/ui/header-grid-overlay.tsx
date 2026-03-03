"use client";

import { cn } from "@/lib/utils";

interface HeaderGridOverlayProps {
  className?: string;
  lineColor?: string;
}

export default function HeaderGridOverlay({
  className,
  lineColor = "#f0ede6",
}: HeaderGridOverlayProps) {
  return (
    <div
      className={cn("absolute inset-0 z-0 opacity-60", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${lineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
          repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
        `,
        WebkitMaskImage: `
          repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
        `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}

