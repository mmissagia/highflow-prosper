import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { AIBadge } from "@/components/ai";
import { getDailyBriefing } from "@/lib/aiMocks";

export function AIBriefingTab() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const briefing = getDailyBriefing("Produtor", "manager");

  return (
    <div className="space-y-4">
      {/* Greeting card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <AIBadge>Briefing do dia</AIBadge>
            <p className="text-[10px] text-muted-foreground capitalize">{today}</p>
          </div>
          <p className="text-sm font-medium text-foreground">{briefing.greeting}</p>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Métricas do seu dia:</p>
        <ul className="space-y-1">
          {briefing.metrics.map((m, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-muted-foreground/60">•</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Destaques:</p>
        <div className="space-y-2">
          {briefing.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <span className="text-base flex-shrink-0">{h.icon}</span>
              <p className="text-sm text-foreground leading-snug">{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh */}
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={() => toast.success("Briefing atualizado")}
      >
        <RefreshCw className="h-3 w-3 mr-1.5" />
        Atualizar briefing
      </Button>
    </div>
  );
}
