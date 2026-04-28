import { cn } from "@/lib/utils";
import { PulsaGlyph } from "./PulsaGlyph";

interface PulsaAvatarProps {
  variant?: "static" | "thinking" | "speaking";
  size?: "compact" | "default" | "cerimonial";
  className?: string;
}

const containerSizeMap = {
  compact: "h-6 w-6",
  default: "h-8 w-8",
  cerimonial: "h-12 w-12",
} as const;

export function PulsaAvatar({
  variant = "static",
  size = "default",
  className,
}: PulsaAvatarProps) {
  const glyphSize = size === "compact" ? "sm" : "md";
  const animationClass =
    variant === "thinking"
      ? "pulsa-glyph-thinking"
      : variant === "speaking"
        ? "pulsa-glyph-speaking"
        : "";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-ai/10",
        containerSizeMap[size],
        className,
      )}
    >
      <PulsaGlyph size={glyphSize} className={animationClass} />
    </div>
  );
}