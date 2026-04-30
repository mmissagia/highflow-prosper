import { PulsaAvatar } from "@/components/ai/PulsaAvatar";
import { PulsaGlyph } from "@/components/ai/PulsaGlyph";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadDetailSidebarProps {
  lead: {
    id: string | number;
    name: string;
    stage: string;
    score: number;
    timeInStage?: string;
  };
  className?: string;
}

function generateContextualSuggestion(lead: LeadDetailSidebarProps["lead"]) {
  const days = parseInt(lead.timeInStage?.match(/\d+/)?.[0] || "0");

  if (lead.score >= 80 && /warm/i.test(lead.stage) && days >= 3) {
    return {
      observation: `${lead.name} está parado há ${days} dias em Warm — score ${lead.score}, ticket potencial alto.`,
      calibration: `Leads desse perfil convertem em até 7 dias ou esfriam. Janela está fechando.`,
      action: "Sugiro abordagem direta hoje, não via mensagem template — call ou áudio personalizado.",
    };
  }

  if (lead.score >= 80) {
    return {
      observation: `${lead.name} tem score ${lead.score} — está dentro do top 20% dos seus leads.`,
      calibration: `Leads com esse score convertem em ~24% dos casos quando bem trabalhados.`,
      action: "Sugiro priorizar este lead nas próximas 48h.",
    };
  }

  if (lead.score < 50) {
    return {
      observation: `${lead.name} tem score ${lead.score} — abaixo da sua média de 65.`,
      calibration: `Leads desse perfil convertem em ~3% dos casos. Custo de oportunidade alto se virar follow-up longo.`,
      action: "Sugiro qualificar antes de investir tempo — pergunta direta sobre orçamento e timing.",
    };
  }

  return {
    observation: `${lead.name} está em ${lead.stage} há ${days || "alguns"} dias.`,
    calibration: `Padrão dentro do esperado para essa etapa.`,
    action: "Continue o cadenciamento normal.",
  };
}

export function LeadDetailSidebar({ lead, className }: LeadDetailSidebarProps) {
  const suggestion = generateContextualSuggestion(lead);

  return (
    <aside className={cn("w-full space-y-4 p-4", className)}>
      {/* Header Pulsa */}
      <div className="flex items-center gap-2">
        <PulsaAvatar variant="thinking" size="default" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">Pulsa</p>
          <p className="text-xs text-muted-foreground leading-tight">Análise contextual</p>
        </div>
      </div>

      {/* Observação */}
      <div className="rounded-lg border border-ai/20 bg-ai/10 p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <PulsaGlyph size="sm" />
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ai">Observação</p>
        </div>
        <p className="text-xs text-foreground leading-relaxed">{suggestion.observation}</p>
      </div>

      {/* Calibração */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Calibração
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.calibration}</p>
      </div>

      {/* Sugestão */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Sugestão da Pulsa
        </p>
        <p className="text-xs italic text-foreground leading-relaxed">{suggestion.action}</p>
      </div>

      {/* Ações rápidas */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Ações rápidas
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Ligar
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Agendar
          </Button>
        </div>
      </div>
    </aside>
  );
}