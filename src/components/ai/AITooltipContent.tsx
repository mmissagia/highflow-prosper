import { cn } from "@/lib/utils";
import { PulsaGlyph } from "./PulsaGlyph";

interface AITooltipContentProps {
  score?: number | string;
  label?: string;
  reasons: string[];
  suggestion?: string;
  className?: string;
}

export function AITooltipContent({
  score,
  label = "Pulsa",
  reasons,
  suggestion,
  className,
}: AITooltipContentProps) {
  return (
    <div className={cn("max-w-xs space-y-2 p-1", className)}>
      <div className="flex items-center gap-1.5">
        <PulsaGlyph size="sm" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ai">
          {label}
          {score !== undefined && ` · ${score}`}
        </span>
      </div>

      {reasons.length > 0 && (
        <ul className="space-y-1">
          {reasons.map((reason, i) => (
            <li key={i} className="flex gap-1.5 text-xs text-foreground">
              <span className="text-ai">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}

      {suggestion && (
        <p className="text-[11px] italic text-muted-foreground border-t border-ai/20 pt-1.5">
          {suggestion}
        </p>
      )}
    </div>
  );
}