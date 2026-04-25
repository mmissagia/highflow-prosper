import { Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  variant?: "default" | "accent" | "destructive";
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<AIBadgeProps["variant"]>, string> = {
  default: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent-foreground",
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
      <Sparkles className="h-3 w-3" />
      {children ?? "HighFlow IA"}
    </span>
  );
}