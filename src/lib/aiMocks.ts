// Mocks estruturados de IA. Todos os retornos são hardcoded e realistas.
// A única IA real no protótipo é o Copiloto WhatsApp (F10-E) — via Edge Function Supabase.

import type { AIInsight, AIAnalysis, AISuggestion } from "@/types/ai";

export function getDashboardDailyInsight(): AIInsight {
  return {
    id: 'dashboard-daily-insight',
    title: 'Resumo da sua operação hoje',
    summary:
      'Seu faturamento caiu 12% na última semana comparado com a anterior. O principal motivo foi a queda de conversão no produto Mentoria Elite (de 8% para 3,2%), que respondia por 40% da sua receita. Em contrapartida, o Curso Inicial teve alta de 24% em vendas — possivelmente puxado pela campanha de Instagram iniciada na terça.',
    details: [
      'Foco sugerido para hoje: revisar o pitch da Mentoria Elite e investigar o funil antes da queda',
      'Confiança do modelo: 82% (baseado em seus últimos 12 meses de dados)',
    ],
    urgency: 'info',
    confidence: 82,
    requiredTier: 'connect',
  };
}

export function getDashboardAlertContext(
  alertType: 'actions' | 'hotLeads' | 'bottleneck' | 'payments',
): string {
  const contexts = {
    actions:
      '3 deles são leads quentes parados há mais de 24h. Priorize-os — cada hora a mais reduz chance de fechamento em ~6%.',
    hotLeads:
      'Maria Santos está parada há 5 dias em "Warm". Lead de R$ 20k com score 87. Padrão: leads como ela convertem em até 7 dias ou esfriam.',
    bottleneck:
      'Atípico. Sua conversão média nessa etapa é 35%. Esta semana está em 17%. Pode ser problema de disponibilidade de agenda dos closers.',
    payments:
      'PIX do Carlos Mendes expira em 4h. Cartão da Fernanda foi recusado ontem — histórico dela mostra que responde bem a PIX como segunda tentativa.',
  };
  return contexts[alertType];
}

export function getStrategyEdgeAnalysis(edgeId: string): AIAnalysis {
  return {
    id: `edge-analysis-${edgeId}`,
    title: 'Análise desta campanha',
    verdict:
      'Essa edge (Warm → Call) tem taxa de conversão de 12%, que é 3x menor que a média das outras edges Warm→Call das suas estratégias (36%).',
    causes: [
      'Canal atual é Email — WhatsApp tem histórico 2,4x melhor em edges similares',
      'Delay médio entre entrada no stage e envio da mensagem é 48h — ideal para "Warm" é até 12h',
      'Copy não menciona urgência — padrões bem-sucedidos em edges assim usam escassez',
    ],
    recommendation:
      'Mudar canal para WhatsApp, reduzir delay para 6h e testar copy com escassez de vagas.',
    confidence: 78,
  };
}

export function getMessageSuggestions(): AISuggestion[] {
  return [
    {
      id: 'msg-urgency',
      label: 'Sugestão com urgência',
      icon: 'zap',
      title: 'Últimas horas',
      description:
        '🔥 Restam apenas 3 vagas para o grupo que começa segunda-feira. Você é um dos leads que mais engajaram essa semana — bloqueamos sua vaga por 24h. Quer garantir?',
      justification:
        'Baseado em campanhas suas com melhor taxa de conversão em leads do stage Warm',
    },
    {
      id: 'msg-personal',
      label: 'Sugestão personalizada',
      icon: 'target',
      title: 'Personalizada ao lead',
      description:
        'Oi {{nome}}! Vi que você abriu o conteúdo sobre {{evento}} mas não agendou a call ainda. Se tiver 5min hoje, posso te enviar um estudo de caso de alguém com o mesmo perfil que você.',
      justification: 'Padrão: mensagens com estudo de caso têm 2x mais resposta neste stage',
    },
    {
      id: 'msg-followup',
      label: 'Follow-up estrutural',
      icon: 'radio',
      title: 'Follow-up leve',
      description:
        'Oi {{nome}}, passando pra saber se conseguiu pensar sobre o que conversamos. Sem pressão — se fizer sentido pra você, me avisa que eu te mando os próximos passos.',
      justification: 'Tom leve tem 67% mais resposta em leads parados há >3 dias',
    },
  ];
}

export function getPaymentRecoveryInsight(payment: {
  leadName: string;
  reason: string;
  value: number;
}): AIInsight {
  return {
    id: `payment-recovery-${payment.leadName}`,
    title: `Sugestão para recuperar cobrança — ${payment.leadName}`,
    summary: `Cartão foi recusado por ${payment.reason}. Histórico deste lead mostra resposta rápida (<2h) às últimas 3 cobranças, com preferência por PIX como segunda tentativa.`,
    details: [
      `Ticket médio histórico: R$ ${(payment.value / 1000).toFixed(1)}k`,
      'Já pagou 2 produtos anteriores via PIX',
      'Ação sugerida: reenviar cobrança por PIX com parcelamento em 2x',
    ],
    urgency: 'suggestion',
    action: {
      label: 'Enviar cobrança por PIX',
      disabled: true,
    },
    confidence: 73,
    confidenceLabel: 'Probabilidade estimada de recuperação',
    requiredTier: 'growth',
  };
}

export function getOrderBumpRecommendation(
  leadProfile: 'mindset' | 'technical' | 'general',
): { recommended: string; avoid?: string; probability: number } {
  const profiles = {
    mindset: {
      recommended: 'Comunidade Elite (R$ 297/mês)',
      avoid: 'Suporte Contínuo',
      probability: 67,
    },
    technical: {
      recommended: 'Suporte Contínuo (R$ 197/mês)',
      avoid: 'Grupo VIP',
      probability: 71,
    },
    general: { recommended: 'Comunidade Elite (R$ 297/mês)', probability: 58 },
  };
  return profiles[leadProfile];
}