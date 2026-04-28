import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PulsaGlyph } from "./PulsaGlyph";

interface AIBadgeProps {
  variant?: "default" | "accent" | "destructive";
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<AIBadgeProps["variant"]>, string> = {
  default: "bg-ai/10 text-ai",
  accent: "bg-ai/10 text-ai",
  destructive: "bg-destructive/10 text-destructive",
};

export function AIBadge({ variant = "default", children, className }: AIBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full",
        variantStyles[variant],
        className,
      )}
    >
      <PulsaGlyph size="sm" />
      {children ?? "Pulsa"}
    </span>
  );
}