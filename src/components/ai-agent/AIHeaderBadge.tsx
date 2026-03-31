import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIHeaderBadgeProps {
  alertCount: number;
  onClick: () => void;
}

export function AIHeaderBadge({ alertCount, onClick }: AIHeaderBadgeProps) {
  if (alertCount <= 0) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      onClick={onClick}
      title="HighFlow AI — Alertas"
    >
      <Brain className="w-4.5 h-4.5 text-primary" />
      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] rounded-full flex items-center justify-center font-bold animate-pulse">
        {alertCount}
      </span>
    </Button>
  );
}
