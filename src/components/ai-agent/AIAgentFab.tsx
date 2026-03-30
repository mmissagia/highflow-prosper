import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIAgentFabProps {
  onClick: () => void;
  alertCount?: number;
}

export function AIAgentFab({ onClick, alertCount = 0 }: AIAgentFabProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full shadow-xl bg-gradient-to-br from-[hsl(221,83%,53%)] to-[hsl(270,65%,55%)] hover:from-[hsl(221,83%,48%)] hover:to-[hsl(270,65%,50%)] text-white border-0 p-0"
    >
      <Brain className="w-6 h-6" />
      {alertCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-background">
          {alertCount}
        </span>
      )}
    </Button>
  );
}
