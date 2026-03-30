import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, TrendingDown, UserX, Calendar, Sparkles } from "lucide-react";

const alerts = [
  {
    severity: "high" as const,
    icon: UserX,
    title: "Lead esfriando: João Oliveira",
    description: "Sem interação há 5 dias. Score caiu de 78 para 62. Risco de perda.",
    action: "Agendar follow-up",
    time: "Há 2h",
  },
  {
    severity: "high" as const,
    icon: TrendingDown,
    title: "Queda na taxa de comparecimento",
    description: "Calls desta semana tiveram 58% de no-show (vs 23% normal). Revisar confirmações.",
    action: "Ver detalhes",
    time: "Há 3h",
  },
  {
    severity: "medium" as const,
    icon: Calendar,
    title: "Evento sem follow-up configurado",
    description: "O webinário 'Masterclass HT' de amanhã não tem sequência de follow-up ativa.",
    action: "Configurar automação",
    time: "Há 5h",
  },
  {
    severity: "medium" as const,
    icon: Clock,
    title: "3 propostas vencem em 48h",
    description: "Ana Costa, Roberto Lima e Fernanda Reis têm propostas expirando. Total: R$ 89k.",
    action: "Ver propostas",
    time: "Há 6h",
  },
  {
    severity: "low" as const,
    icon: AlertTriangle,
    title: "Closer sem atividade hoje",
    description: "Pedro Almeida não registrou nenhuma atividade hoje. Meta mensal em 67%.",
    action: "Notificar",
    time: "Há 8h",
  },
];

const severityStyles = {
  high: "border-destructive/30 bg-destructive/5",
  medium: "border-accent/30 bg-accent/5",
  low: "border-muted-foreground/20 bg-muted/30",
};

const severityBadge = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-muted text-muted-foreground border-border",
};

export function AIAlertasTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Alertas inteligentes
        </p>
        <Badge variant="outline" className="text-[10px]">{alerts.length} pendentes</Badge>
      </div>

      {alerts.map((alert, i) => (
        <Card key={i} className={`${severityStyles[alert.severity]} border`}>
          <CardContent className="p-3">
            <div className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-md ${severityBadge[alert.severity]}`}>
                <alert.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{alert.description}</p>
                <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">{alert.action}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
