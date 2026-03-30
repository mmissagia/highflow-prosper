import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  action: string;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Lead Maria Santos sem contato há 5 dias",
    description: "Score caiu de 92 para 74. Risco de perda iminente — última interação foi abertura de e-mail sem resposta.",
    time: "Há 2h",
    action: "Abrir Lead",
  },
  {
    id: "2",
    severity: "critical",
    title: "Call com Pedro Costa em 30 min sem confirmação",
    description: "O closer designado ainda não confirmou presença. Lead de alto valor (R$ 25k).",
    time: "Há 28min",
    action: "Enviar Lembrete",
  },
  {
    id: "3",
    severity: "warning",
    title: "3 leads em Follow-up sem movimentação",
    description: "Leads parados há mais de 7 dias no estágio Follow-up. Conversão média cai 40% após 10 dias neste estágio.",
    time: "Hoje 09:30",
    action: "Ver Pipeline",
  },
  {
    id: "4",
    severity: "warning",
    title: "Evento Mastermind Summit com 45% de vagas",
    description: "Faltam 10 dias e apenas 45% das vagas estão preenchidas. Ritmo atual não alcançará a meta de lotação.",
    time: "Hoje 08:15",
    action: "Ver Evento",
  },
  {
    id: "5",
    severity: "warning",
    title: "Closer Rafael Costa abaixo da média",
    description: "Taxa de fechamento 8% abaixo da média da equipe nas últimas 2 semanas. Pode precisar de coaching.",
    time: "Há 4h",
    action: "Ver Produtividade",
  },
  {
    id: "6",
    severity: "info",
    title: "15 novos leads via Meta Ads em 24h",
    description: "Volume 40% acima da média diária. Campanha 'Lançamento Mentoria' gerando pico de entrada.",
    time: "Há 1h",
    action: "Ver Leads",
  },
  {
    id: "7",
    severity: "info",
    title: "Campanha com 2.3x ROAS — escalar budget?",
    description: "A campanha 'Lançamento Mentoria' atingiu 2.3x ROAS. Performance acima do benchmark de 1.8x.",
    time: "Há 3h",
    action: "Ver Campanha",
  },
  {
    id: "8",
    severity: "info",
    title: "Workshop Closer em 3 dias — 12/20 inscritos",
    description: "Faltam 8 inscritos para a meta. Sugestão: enviar lembrete para leads qualificados não-inscritos.",
    time: "Há 5h",
    action: "Ver Evento",
  },
];

const severityConfig = {
  critical: {
    emoji: "🔴",
    label: "Crítico",
    border: "border-destructive/40",
    bg: "bg-destructive/5",
    badgeCn: "bg-destructive/10 text-destructive border-destructive/20",
  },
  warning: {
    emoji: "🟡",
    label: "Atenção",
    border: "border-accent/40",
    bg: "bg-accent/5",
    badgeCn: "bg-accent/10 text-accent border-accent/20",
  },
  info: {
    emoji: "🔵",
    label: "Informativo",
    border: "border-primary/30",
    bg: "bg-primary/5",
    badgeCn: "bg-primary/10 text-primary border-primary/20",
  },
};

export function AIAlertasTab() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [dismissing, setDismissing] = useState<string | null>(null);

  const handleDismiss = (id: string) => {
    setDismissing(id);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      setDismissing(null);
    }, 300);
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const infoCount = alerts.filter((a) => a.severity === "info").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Modo Sentinela
        </p>
        <div className="flex gap-1.5">
          {criticalCount > 0 && (
            <Badge className="text-[10px] bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
              🔴 {criticalCount}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="text-[10px] bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
              🟡 {warningCount}
            </Badge>
          )}
          {infoCount > 0 && (
            <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              🔵 {infoCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">✅ Nenhum alerta pendente. Tudo sob controle!</p>
          </CardContent>
        </Card>
      ) : (
        alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <Card
              key={alert.id}
              className={cn(
                "border transition-all duration-300",
                config.border,
                config.bg,
                dismissing === alert.id && "opacity-0 scale-95 -translate-x-4"
              )}
            >
              <CardContent className="p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5">{config.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">{alert.title}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="text-xs h-7 px-3">{alert.action}</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2.5 text-muted-foreground hover:text-foreground"
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Ignorar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
