import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Mail, BarChart3, Lightbulb, ArrowRight } from "lucide-react";

const suggestions = [
  {
    icon: Target,
    category: "Conversão",
    title: "Otimize o pitch para leads de tráfego pago",
    description: "Leads de Meta Ads convertem 2.3x mais quando o pitch menciona ROI nos primeiros 30s. Ajuste sugerido disponível.",
    action: "Ver sugestão de pitch",
  },
  {
    icon: Mail,
    category: "Comunicação",
    title: "Melhor horário para envio de e-mails",
    description: "Seus leads abrem 47% mais e-mails às terças entre 9h-10h. Reagende a campanha 'Convite VIP' para este horário.",
    action: "Reagendar campanha",
  },
  {
    icon: BarChart3,
    category: "Performance",
    title: "Redistribuir leads entre closers",
    description: "Ana tem 18 leads ativos vs Pedro com 7. Transferir 4 leads de Ana para Pedro pode equilibrar a carga e melhorar o tempo de resposta.",
    action: "Ver redistribuição",
  },
  {
    icon: Lightbulb,
    category: "Estratégia",
    title: "Criar urgência com oferta limitada",
    description: "12 leads estão no estágio 'Proposta' há mais de 7 dias. Uma oferta com deadline de 48h historicamente converte 34% destes casos.",
    action: "Criar oferta",
  },
];

export function AICopilotoTab() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Sugestões do copiloto
      </p>

      {suggestions.map((s, i) => (
        <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <s.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{s.category}</Badge>
                  <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />IA
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.description}</p>
                <Button size="sm" variant="outline" className="text-xs h-7">
                  {s.action} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
