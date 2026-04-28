import { cn } from "@/lib/utils";

interface PulsaGlyphProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-hidden"?: boolean;
}

const sizeMap = { sm: 12, md: 24, lg: 96 } as const;
const strokeMap = { sm: 0.9, md: 1.4, lg: 3 } as const;

export function PulsaGlyph({
  size = "md",
  className,
  "aria-hidden": ariaHidden = true,
}: PulsaGlyphProps) {
  const dimension = sizeMap[size];
  const strokeWidth = strokeMap[size];
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      aria-hidden={ariaHidden}
    >
      <circle
        cx="12"
        cy="12"
        r="6.5"
        stroke="hsl(var(--ai))"
        strokeWidth={strokeWidth}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="13.5" cy="10.5" r="3.5" fill="hsl(var(--ai))" />
    </svg>
  );
}