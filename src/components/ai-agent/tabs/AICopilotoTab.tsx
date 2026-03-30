import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, TrendingUp, Users, BarChart3, Calendar, ArrowRight, MessageSquare, Lightbulb, Megaphone, DollarSign, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

interface Suggestion {
  icon: React.ElementType;
  title: string;
  description: string;
  basis: string;
  action: string;
}

const suggestionsByRoute: Record<string, { label: string; suggestions: Suggestion[] }> = {
  "/": {
    label: "Dashboard",
    suggestions: [
      {
        icon: TrendingUp,
        title: "Gargalo no funil: Warm → Call Agendada",
        description: "Conversão de 34% neste estágio vs média de 52%. O script de agendamento pode estar desatualizado ou os SDRs precisam de treinamento.",
        basis: "Dados do funil dos últimos 30 dias",
        action: "Revisar script",
      },
      {
        icon: DollarSign,
        title: "Receita potencial no pipeline: R$ 487k",
        description: "Se fechar os 4 leads em Follow-up, a receita atinge R$ 535k. Priorize Ana Costa (R$ 45k) e Roberto Lima (R$ 38k).",
        basis: "Pipeline ativo + histórico de conversão",
        action: "Ver oportunidades",
      },
    ],
  },
  "/crm/pipeline": {
    label: "Pipeline",
    suggestions: [
      {
        icon: Target,
        title: "Mover João Silva para Call Agendada",
        description: "Ele abriu 3 e-mails consecutivos e acessou a página de preços 2x hoje. Sinais fortes de interesse ativo.",
        basis: "Tracking de e-mail + analytics do site",
        action: "Mover no pipeline",
      },
      {
        icon: AlertTriangle,
        title: "5 leads frios há 14+ dias sem interação",
        description: "Leads parados no estágio 'Lead Frio' sem nenhuma atividade. Considere remover ou iniciar campanha de reativação.",
        basis: "Tempo médio no estágio + atividades registradas",
        action: "Ver leads inativos",
      },
    ],
  },
  "/crm/leads": {
    label: "Leads",
    suggestions: [
      {
        icon: BarChart3,
        title: "Leads de Evento convertem 2.3x mais",
        description: "Origem 'Evento' tem taxa de conversão de 23% vs 10% de 'Meta Ads'. Considere aumentar investimento em eventos presenciais.",
        basis: "Conversão por origem nos últimos 90 dias",
        action: "Ver por origem",
      },
      {
        icon: TrendingUp,
        title: "Score médio caiu 7 pontos na semana",
        description: "O score médio dos leads ativos caiu de 68 para 61. Possível causa: lote novo de leads frios de campanha recente.",
        basis: "Evolução de lead scoring semanal",
        action: "Analisar scores",
      },
    ],
  },
  "/comercial/equipe": {
    label: "Equipe Comercial",
    suggestions: [
      {
        icon: Users,
        title: "Ana Ribeiro com sobrecarga — 23 leads ativos",
        description: "Média da equipe é 15 leads por closer. Sobrecarga pode reduzir qualidade do atendimento e taxa de conversão.",
        basis: "Distribuição atual de leads por closer",
        action: "Redistribuir leads",
      },
      {
        icon: AlertTriangle,
        title: "Lucas Martins sem fechamento há 15 dias",
        description: "Último fechamento em 15/03. Teve 8 calls no período mas 0 conversões. Pode precisar de coaching.",
        basis: "Histórico de atividades e conversões",
        action: "Ver atividades",
      },
    ],
  },
  "/eventos": {
    label: "Eventos",
    suggestions: [
      {
        icon: Megaphone,
        title: "Mentoria Elite com 18% de conversão pós-evento",
        description: "Top performer entre seus eventos. Formato e conteúdo podem servir de modelo para os próximos.",
        basis: "Taxa de conversão lead→venda por evento",
        action: "Ver detalhes",
      },
      {
        icon: Calendar,
        title: "2 eventos sem closer designado",
        description: "Os eventos 'Workshop Digital' e 'Masterclass HT' não têm closer designado para acompanhamento pós-evento.",
        basis: "Configuração de eventos ativos",
        action: "Designar closers",
      },
    ],
  },
  "/comunicacao/campanhas": {
    label: "Campanhas",
    suggestions: [
      {
        icon: Megaphone,
        title: "Campanha 'Convite VIP' com baixa abertura",
        description: "Taxa de abertura de 12% vs média de 28%. Assunto do e-mail pode estar genérico. Teste A/B sugerido.",
        basis: "Métricas de e-mail dos últimos 7 dias",
        action: "Criar teste A/B",
      },
      {
        icon: TrendingUp,
        title: "Melhor horário: terças 9h-10h",
        description: "Seus leads abrem 47% mais e-mails neste horário. Reagende envios pendentes para maximizar engajamento.",
        basis: "Análise de horários de abertura (60 dias)",
        action: "Reagendar envios",
      },
    ],
  },
};

const fallbackSuggestions: Suggestion[] = [
  {
    icon: MessageSquare,
    title: "Como posso te ajudar nesta seção?",
    description: "Posso analisar dados, sugerir próximas ações ou responder dúvidas sobre sua operação. Pergunte qualquer coisa no chat abaixo.",
    basis: "Contexto geral da plataforma",
    action: "Abrir chat",
  },
  {
    icon: Lightbulb,
    title: "Explore as sugestões do Dashboard",
    description: "Navegue até o Dashboard para ver insights personalizados sobre seu funil, receita e performance geral.",
    basis: "Dados consolidados do projeto",
    action: "Ir ao Dashboard",
  },
];

function resolveContext(pathname: string): { label: string; suggestions: Suggestion[] } {
  // exact match
  if (suggestionsByRoute[pathname]) return suggestionsByRoute[pathname];

  // prefix match (e.g. /crm/lead/123 → /crm/leads)
  const prefixes = Object.keys(suggestionsByRoute).sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix) && prefix !== "/") return suggestionsByRoute[prefix];
  }

  // derive label from pathname
  const segment = pathname.split("/").filter(Boolean).pop() || "Página";
  const label = segment.charAt(0).toUpperCase() + segment.slice(1);
  return { label, suggestions: fallbackSuggestions };
}

export function AICopilotoTab() {
  const { pathname } = useLocation();
  const { label, suggestions } = useMemo(() => resolveContext(pathname), [pathname]);

  return (
    <div className="space-y-3">
      {/* Context header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Copiloto contextual
        </p>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
        <span className="text-sm">📍</span>
        <span className="text-xs font-medium text-foreground">Contexto: {label}</span>
      </div>

      {/* Suggestions */}
      {suggestions.map((s, i) => (
        <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <s.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />IA
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{s.description}</p>
                <p className="text-[10px] text-muted-foreground/70 italic mb-3">Baseado em: {s.basis}</p>
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
