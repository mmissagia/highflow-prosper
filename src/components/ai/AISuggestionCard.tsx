import { Zap, Target, Radio, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AISuggestion } from "@/types/ai";

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  className?: string;
}

const iconMap: Record<AISuggestion["icon"], { Icon: LucideIcon; color: string }> = {
  zap: { Icon: Zap, color: "text-primary" },
  target: { Icon: Target, color: "text-orange-500" },
  radio: { Icon: Radio, color: "text-blue-500" },
  sparkles: { Icon: Sparkles, color: "text-purple-500" },
  trendingUp: { Icon: TrendingUp, color: "text-green-500" },
};

export function AISuggestionCard({ suggestion, className }: AISuggestionCardProps) {
  const { Icon, color } = iconMap[suggestion.icon];

  return (
    <div className={cn("border border-border rounded-lg p-3 space-y-1", className)}>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3 w-3", color)} />
        <span className="text-[10px] uppercase font-semibold tracking-wide text-muted-foreground">
          {suggestion.label}
        </span>
      </div>
      <p className="text-xs font-medium text-foreground">{suggestion.title}</p>
      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
      {suggestion.justification && (
        <p className="text-[10px] italic text-muted-foreground">{suggestion.justification}</p>
      )}
    </div>
  );
}