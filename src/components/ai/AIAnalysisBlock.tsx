import { cn } from "@/lib/utils";
import { AIBadge } from "./AIBadge";
import type { AIAnalysis } from "@/types/ai";

interface AIAnalysisBlockProps {
  analysis: AIAnalysis;
  className?: string;
}

export function AIAnalysisBlock({ analysis, className }: AIAnalysisBlockProps) {
  return (
    <div
      className={cn(
        "bg-ai/5 border border-ai/20 rounded-lg p-4 space-y-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AIBadge variant="accent" />
        <h3 className="text-sm font-medium text-foreground">{analysis.title}</h3>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{analysis.verdict}</p>

      {analysis.causes && analysis.causes.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground">Possíveis causas</p>
          <ul className="space-y-1">
            {analysis.causes.map((cause, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-muted-foreground/60">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-ai/20 pt-3">
        <p className="text-sm font-medium text-foreground">{analysis.recommendation}</p>
      </div>

      {analysis.confidence !== undefined && (
        <p className="text-[10px] text-muted-foreground">Confiança: {analysis.confidence}%</p>
      )}
    </div>
  );
}