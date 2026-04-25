import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AIBadge } from "./AIBadge";
import type { AIInsight, AIUrgency } from "@/types/ai";

interface AIInsightCardProps {
  insight: AIInsight;
  className?: string;
}

const urgencyStyles: Record<AIUrgency, { container: string; badge: "default" | "accent" | "destructive" }> = {
  info: { container: "border-l-primary bg-primary/5", badge: "default" },
  suggestion: { container: "border-l-accent bg-accent/5", badge: "accent" },
  alert: { container: "border-l-destructive bg-destructive/5", badge: "destructive" },
};

export function AIInsightCard({ insight, className }: AIInsightCardProps) {
  const styles = urgencyStyles[insight.urgency];

  return (
    <div
      className={cn(
        "border border-border border-l-4 rounded-lg p-4 space-y-3",
        styles.container,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AIBadge variant={styles.badge} />
        <h3 className="text-sm font-medium text-foreground">{insight.title}</h3>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{insight.summary}</p>

      {insight.details && insight.details.length > 0 && (
        <ul className="space-y-1">
          {insight.details.map((detail, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-muted-foreground/60">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      {(insight.confidence !== undefined || insight.action) && (
        <div className="flex items-center justify-between pt-1">
          {insight.confidence !== undefined ? (
            <span className="text-[10px] text-muted-foreground">
              {insight.confidenceLabel ?? `Confiança: ${insight.confidence}%`}
            </span>
          ) : (
            <span />
          )}
          {insight.action && (
            <Button
              variant="outline"
              size="sm"
              onClick={insight.action.onClick}
              disabled={insight.action.disabled}
            >
              {insight.action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}