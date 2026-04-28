import { cn } from "@/lib/utils";
import { PulsaGlyph } from "./PulsaGlyph";

interface AIInlineHintProps {
  children: React.ReactNode;
  className?: string;
}

export function AIInlineHint({ children, className }: AIInlineHintProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 border-t border-ai/20 pt-2 mt-2",
        className,
      )}
    >
      <PulsaGlyph size="sm" className="mt-0.5 shrink-0" />
      <p className="text-[11px] italic text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}