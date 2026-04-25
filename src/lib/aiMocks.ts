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

export function getLeadScoreTooltip(score: number, stage: string): string {
  if (score >= 85) {
    return `Score ${score} — atípico para esta etapa. Lead abriu 3 emails, clicou no link do checkout 2x, sem fechar. Tempo de resposta médio dele: 12min. Sugestão: follow-up imediato por WhatsApp.`;
  }
  if (score >= 60) {
    return `Score ${score} — dentro do padrão para ${stage}. Engajamento consistente nas últimas interações. Sugestão: manter cadência atual.`;
  }
  return `Score ${score} — baixo para ${stage}. Lead esfriou nas últimas 2 semanas. Sugestão: nova abordagem com conteúdo relevante antes de tentar fechamento.`;
}

export function getEnrichedLeadSuggestions(lead: {
  stage: string;
  score: number;
  dealValue: number;
  name: string;
}): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  const actionDesc =
    lead.score >= 70
      ? 'Agendar call — lead abriu link de checkout 2x mas não fechou. Tentativa anterior de PIX falhou por expiração. Recomendado oferecer parcelamento em cartão.'
      : lead.stage === 'reuniao'
        ? 'Enviar proposta personalizada — lead agendou reunião, demonstrando interesse concreto. Enviar proposta ainda hoje.'
        : 'Nurturing com conteúdo de valor — lead ainda não engajou o suficiente para oferta direta.';

  suggestions.push({
    id: 'next-action',
    label: 'Próxima ação',
    icon: 'zap',
    title: lead.score >= 70 ? 'Agendar call imediatamente' : 'Continuar nurturing',
    description: actionDesc,
  });

  const pitchTitle =
    lead.dealValue >= 20000
      ? 'Mastermind Anual'
      : lead.dealValue >= 10000
        ? 'Mentoria Elite'
        : 'Mentoria em Grupo';

  suggestions.push({
    id: 'best-pitch',
    label: 'Melhor pitch',
    icon: 'target',
    title: pitchTitle,
    description: `Padrão de leads similares mostra 43% de fechamento neste produto. Ticket compatível com perfil do ${lead.name}.`,
    justification: `Ticket médio estimado do lead: R$ ${(lead.dealValue / 1000).toFixed(0)}k`,
  });

  const channel =
    lead.score >= 70 ? 'WhatsApp' : lead.score >= 40 ? 'Email + WhatsApp' : 'Email nurturing';

  suggestions.push({
    id: 'best-channel',
    label: 'Melhor canal',
    icon: 'radio',
    title: channel,
    description:
      'Lead respondeu às suas últimas 4 mensagens por WhatsApp com tempo médio de 23min. Email tem taxa de abertura de 12% nesse perfil.',
  });

  return suggestions;
}

export function getDailyBriefing(
  userName: string,
  _role: 'sdr' | 'closer' | 'manager',
): {
  greeting: string;
  metrics: string[];
  highlights: { icon: string; text: string }[];
} {
  const baseMetrics = [
    '12 leads novos atribuídos (3 priority 1)',
    '5 calls agendadas — 1 sem confirmação (Maria Santos, 14h)',
    '8 follow-ups pendentes (2 atrasados)',
    'Receita potencial em jogo: R$ 47k',
  ];

  return {
    greeting: `Bom dia, ${userName}. Aqui está seu foco para hoje:`,
    metrics: baseMetrics,
    highlights: [
      { icon: '🔥', text: 'Maria Santos respondeu o follow-up ontem à noite — prioridade alta, ela está quente.' },
      { icon: '📞', text: 'Confirme a call das 14h da Maria antes das 10h — padrão mostra que confirmações antes das 10h reduzem no-show em 40%.' },
      { icon: '📈', text: 'Sua taxa de conversão subiu 12% vs semana passada — continue no ritmo.' },
    ],
  };
}

export function getTeamPerformanceAnalysis(memberName: string): AIAnalysis {
  return {
    id: `team-analysis-${memberName}`,
    title: `Análise de performance — ${memberName}`,
    verdict: `${memberName} está com taxa de conversão de 18% nos últimos 15 dias, 20% abaixo da média do time (22,5%).`,
    causes: [
      '65% dos leads que recebeu nesse período tinham score <60 (leads mais frios)',
      'Média do time: 40% de leads com score <60',
      'Tempo médio de follow-up dele: 3,2h (dentro do padrão)',
    ],
    recommendation:
      'A queda não parece ser por execução dele — ele está recebendo leads mais difíceis que o padrão. Rebalancear atribuição de leads ou dar acesso prioritário a leads com score ≥75 pelos próximos 7 dias.',
    confidence: 81,
  };
}

export interface MentorshipChurnRisk {
  id: string;
  name: string;
  iem: number;
  previousIem: number;
  reason: string;
  churnProbability: number;
}

export function getMentorshipChurnInsight(): {
  title: string;
  summary: string;
  mentorees: MentorshipChurnRisk[];
  suggestion: string;
  interventionImpact: string;
} {
  return {
    title: '3 mentorados com alto risco de churn nos próximos 30 dias',
    summary:
      'Baseado em padrões históricos de mentorados com queda de engajamento semelhante, estes três apresentam alto risco de cancelamento nas próximas 4 semanas.',
    mentorees: [
      {
        id: 'm-001',
        name: 'Lucas Andrade',
        iem: 42,
        previousIem: 78,
        reason: 'IEM caiu 36 pontos em 3 semanas. Faltou nas últimas 2 sessões.',
        churnProbability: 87,
      },
      {
        id: 'm-002',
        name: 'Patricia Sousa',
        iem: 51,
        previousIem: 85,
        reason:
          'Não entregou as últimas 3 tarefas. Quebra de ritmo nas tarefas é o principal preditor de cancelamento.',
        churnProbability: 73,
      },
      {
        id: 'm-003',
        name: 'Rodrigo Lima',
        iem: 48,
        previousIem: 62,
        reason:
          'Baixa interação na comunidade. Primeiro mês de mentoria — onboarding pode ter falhado.',
        churnProbability: 68,
      },
    ],
    suggestion: 'Agendar mentoria 1:1 com cada um antes de sexta-feira.',
    interventionImpact: 'Dados históricos mostram que essa intervenção reduz churn em 63%.',
  };
}

export function getEventConversionForecast(
  eventName: string,
  _inscritos: number,
): {
  title: string;
  forecastRange: { min: number; max: number };
  revenueRange: { min: number; max: number };
  confidence: number;
  recommendations: string[];
} {
  return {
    title: `Previsão para este evento (${eventName})`,
    forecastRange: { min: 18, max: 22 },
    revenueRange: { min: 144000, max: 176000 },
    confidence: 78,
    recommendations: [
      'Enviar lembrete 2h antes do evento — padrão aumenta comparecimento em 15%',
      'Oferecer order bump de Comunidade Elite no checkout — seus eventos com order bump têm 22% mais ticket médio',
      'Ativar countdown de escassez 10min antes do pitch',
    ],
  };
}

export function getIntegrationSuggestion(): {
  title: string;
  summary: string;
  benefits: string[];
  impact: string;
  cta: string;
} {
  return {
    title: 'Você está perdendo contexto de 45 leads',
    summary:
      'Detectamos 45 leads do Instagram cadastrados nos últimos 30 dias sem origem rastreada (UTM vazio). Conectar sua conta Meta Ads revelaria:',
    benefits: [
      'Qual campanha específica está trazendo cada lead',
      'Custo por lead de cada campanha',
      'ROI real por anúncio',
    ],
    impact:
      'Você poderia redistribuir budget e ganhar +R$ 12k/mês em otimização (baseado no padrão de outros produtores que integraram Meta).',
    cta: 'Conectar Meta Ads',
  };
}