import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Clock, DollarSign, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const metricsData = [
  { label: "Leads novos", value: "12", icon: Users, color: "text-primary bg-primary/10" },
  { label: "Calls agendadas", value: "5", icon: Phone, color: "text-secondary bg-secondary/10" },
  { label: "Follow-ups", value: "8", icon: Clock, color: "text-accent bg-accent/10" },
  { label: "Receita potencial", value: "R$ 47k", icon: DollarSign, color: "text-success bg-success/10" },
];

const highlights = [
  { emoji: "🔥", text: "Maria Santos respondeu o follow-up — prioridade alta", color: "text-destructive" },
  { emoji: "📞", text: "3 calls agendadas para hoje, 1 sem confirmação", color: "text-accent" },
  { emoji: "📈", text: "Taxa de conversão subiu 12% vs semana passada", color: "text-success" },
  { emoji: "🎯", text: "Lead Carlos Mendes atingiu score 92 — pronto para closer", color: "text-primary" },
];

export function AIBriefingTab() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <p className="text-lg font-semibold text-foreground">Bom dia, Produtor! 👋</p>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">{today}</p>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Resumo do dia
        </p>
        <div className="grid grid-cols-2 gap-2">
          {metricsData.map((m) => (
            <Card key={m.label} className="border-border/50">
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Destaques</p>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <span className="text-base">{h.emoji}</span>
              <p className="text-sm text-foreground leading-snug">{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended action */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Ação recomendada</p>
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />IA
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Ligar para Maria Santos agora</p>
            <p className="text-xs text-muted-foreground mb-3">
              Ela abriu o e-mail de follow-up 3x nas últimas 2h e respondeu com interesse. Momento ideal para conversão.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="text-xs h-8">
                Executar <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8">Ver detalhes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
