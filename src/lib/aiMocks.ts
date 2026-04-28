// Mocks estruturados da Pulsa. Todos os retornos são hardcoded e realistas.
// A única IA real no protótipo é o Copiloto WhatsApp (F10-E) — via Edge Function Supabase.

import type { AIInsight, AIAnalysis, AISuggestion } from "@/types/ai";

export function getDashboardDailyInsight(): AIInsight {
  return {
    id: 'dashboard-daily-insight',
    title: 'Resumo da sua operação hoje',
    summary:
      'Observei que seu faturamento caiu 12% na última semana comparado com a anterior. O principal vetor é a queda de conversão da Mentoria Elite (de 8% para 3,2%), produto que responde por 40% da receita. Em contrapartida, o Curso Inicial subiu 24% em vendas — coincide com a campanha de Instagram iniciada na terça. Sugiro priorizar a revisão do pitch da Mentoria Elite hoje e investigar a etapa imediatamente anterior à queda no funil.',
    details: [
      'Calibração: comparação com seus últimos 12 meses de operação',
      'Sugiro revisar o pitch da Mentoria Elite antes da próxima janela de vendas',
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
      'Observei que 3 deles são leads quentes parados há mais de 24h. No padrão dos seus dados, cada hora a mais nesse estado reduz a chance de fechamento em ~6%. Sugiro priorizá-los antes do próximo bloco de prospecção.',
    hotLeads:
      'Observei que Maria Santos está parada há 5 dias em "Warm" — ticket potencial de R$ 20k, score 87. No padrão dos seus dados, leads desse perfil convertem em até 7 dias ou esfriam. Sugiro abordagem direta hoje.',
    bottleneck:
      'Observei que sua conversão nesta etapa está em 17% nesta semana, abaixo da sua média histórica de 35%. Um vetor possível é a disponibilidade de agenda dos closers. Sugiro checar a ocupação da equipe nas próximas 48h.',
    payments:
      'Observei que o PIX do Carlos Mendes expira em 4h e o cartão da Fernanda foi recusado ontem. No histórico dela, PIX como segunda tentativa tem taxa de recuperação alta. Sugiro reenviar PIX para a Fernanda e fazer follow-up rápido com o Carlos.',
  };
  return contexts[alertType];
}

export function getStrategyEdgeAnalysis(edgeId: string): AIAnalysis {
  return {
    id: `edge-analysis-${edgeId}`,
    title: 'Análise desta campanha',
    verdict:
      'Observei que esta edge (Warm → Call) está em 12% de conversão, cerca de 3x abaixo da média das outras edges Warm→Call das suas estratégias (36%).',
    causes: [
      'Calibração: WhatsApp tem histórico 2,4x melhor que Email em edges similares dentro da sua operação',
      'Calibração: delay médio atual é de 48h; nas edges com melhor performance, o ideal para "Warm" é até 12h',
      'Calibração: copys com escassez performam acima da média neste tipo de edge',
    ],
    recommendation:
      'Sugiro mudar o canal para WhatsApp, reduzir o delay para ~6h e testar uma copy com escassez de vagas.',
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
        '🔥 Restam apenas 3 vagas para o grupo que começa segunda-feira. Você está entre os que mais engajaram essa semana — bloqueamos sua vaga por 24h. Quer garantir?',
      justification:
        'Calibração: derivado das suas campanhas com melhor taxa de conversão em contatos do stage Warm. Sugiro priorizar contatos com score ≥70.',
    },
    {
      id: 'msg-personal',
      label: 'Sugestão personalizada',
      icon: 'target',
      title: 'Personalizada ao lead',
      description:
        'Oi {{nome}}! Vi que você abriu o conteúdo sobre {{evento}} mas não agendou a call ainda. Se tiver 5min hoje, posso te enviar um estudo de caso de alguém com o mesmo perfil que você.',
      justification: 'Calibração: mensagens com estudo de caso têm 2x mais resposta neste stage. Sugiro envio nas primeiras 12h após o gatilho.',
    },
    {
      id: 'msg-followup',
      label: 'Follow-up estrutural',
      icon: 'radio',
      title: 'Follow-up leve',
      description:
        'Oi {{nome}}, passando pra saber se conseguiu pensar sobre o que conversamos. Sem pressão — se fizer sentido pra você, me avisa que eu te mando os próximos passos.',
      justification: 'Calibração: tom leve tem 67% mais resposta em contatos parados há mais de 3 dias. Sugiro disparar no fim da tarde.',
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
    summary: `Observei que o cartão foi recusado por ${payment.reason}. No histórico deste contato, a resposta às últimas 3 cobranças foi em menos de 2h, com preferência por PIX como segunda tentativa. Sugiro reenviar a cobrança via PIX já hoje.`,
    details: [
      `Calibração — ticket médio histórico: R$ ${(payment.value / 1000).toFixed(1)}k`,
      'Calibração: já pagou 2 produtos anteriores via PIX',
      'Sugiro reenviar a cobrança por PIX com parcelamento em 2x',
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
    return `Observei score ${score} — atípico para esta etapa. O contato abriu 3 emails, clicou no link do checkout 2x, sem fechar. Tempo médio de resposta dele: 12min. Sugiro follow-up imediato por WhatsApp.`;
  }
  if (score >= 60) {
    return `Observei score ${score} — dentro do padrão para ${stage}. Engajamento consistente nas últimas interações. Sugiro manter a cadência atual.`;
  }
  return `Observei score ${score} — baixo para ${stage}. O contato esfriou nas últimas 2 semanas. Sugiro uma nova abordagem com conteúdo relevante antes de tentar fechamento.`;
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
      ? 'Observei que o contato abriu o link de checkout 2x sem fechar e a tentativa anterior de PIX expirou. Sugiro agendar call hoje e oferecer parcelamento em cartão.'
      : lead.stage === 'reuniao'
        ? 'Observei que o contato agendou reunião, sinal de interesse concreto. Sugiro enviar proposta personalizada ainda hoje.'
        : 'Observei que o contato ainda não engajou o suficiente para oferta direta. Sugiro nurturing com conteúdo de valor.';

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
    description: `No padrão de contatos similares, observei 43% de fechamento neste produto. Ticket compatível com o perfil do ${lead.name}. Sugiro abrir a conversa por aqui.`,
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
      'Observei que o contato respondeu às suas últimas 4 mensagens por WhatsApp em ~23min. Email tem 12% de abertura nesse perfil. Sugiro priorizar WhatsApp.',
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

  void userName;
  return {
    greeting: `Observei o pipeline de hoje. Este é o foco sugerido:`,
    metrics: baseMetrics,
    highlights: [
      { icon: '🔥', text: 'Observei que Maria Santos respondeu o follow-up ontem à noite — sinal forte de interesse. Sugiro contato priorizado pela manhã.' },
      { icon: '📞', text: 'Calibração: confirmações antes das 10h reduzem no-show em 40%. Sugiro confirmar a call das 14h da Maria antes desse horário.' },
      { icon: '📈', text: 'Observei que sua taxa de conversão subiu 12% vs semana passada. Sugiro manter a cadência atual.' },
    ],
  };
}

export function getTeamPerformanceAnalysis(memberName: string): AIAnalysis {
  return {
    id: `team-analysis-${memberName}`,
    title: `Análise de performance — ${memberName}`,
    verdict: `Observei que ${memberName} está com taxa de conversão de 18% nos últimos 15 dias, cerca de 20% abaixo da média do time (22,5%).`,
    causes: [
      'Calibração: 65% dos leads recebidos no período tinham score <60 (mais frios que o normal)',
      'Calibração: a média do time é 40% de leads com score <60',
      'Calibração: tempo médio de follow-up dele é 3,2h, dentro do padrão',
    ],
    recommendation:
      'Os dados não apontam falha de execução — ele está recebendo leads mais difíceis que o padrão. Sugiro rebalancear a atribuição ou dar acesso prioritário a leads com score ≥75 pelos próximos 7 dias.',
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
    title: 'Observei 3 mentorados com alto risco de churn nos próximos 30 dias',
    summary:
      'No padrão histórico de mentorados com queda de engajamento semelhante, estes três apresentam alto risco de cancelamento nas próximas 4 semanas.',
    mentorees: [
      {
        id: 'm-001',
        name: 'Lucas Andrade',
        iem: 42,
        previousIem: 78,
        reason: 'Observei queda de 36 pontos no IEM em 3 semanas e ausência nas últimas 2 sessões.',
        churnProbability: 87,
      },
      {
        id: 'm-002',
        name: 'Patricia Sousa',
        iem: 51,
        previousIem: 85,
        reason:
          'Observei que não entregou as últimas 3 tarefas. Calibração: quebra de ritmo nas tarefas é o principal preditor de cancelamento.',
        churnProbability: 73,
      },
      {
        id: 'm-003',
        name: 'Rodrigo Lima',
        iem: 48,
        previousIem: 62,
        reason:
          'Observei baixa interação na comunidade no primeiro mês de mentoria. Calibração: pode indicar falha de onboarding.',
        churnProbability: 68,
      },
    ],
    suggestion: 'Sugiro agendar mentoria 1:1 com cada um antes de sexta-feira.',
    interventionImpact: 'Calibração: nos seus dados históricos, essa intervenção reduz churn em 63%.',
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
      'Calibração: lembrete 2h antes aumenta comparecimento em 15%. Sugiro programar o disparo.',
      'Calibração: seus eventos com order bump têm 22% mais ticket médio. Sugiro oferecer Comunidade Elite no checkout.',
      'Sugiro ativar countdown de escassez 10min antes do pitch.',
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
    title: 'Observei que você está perdendo contexto de 45 leads',
    summary:
      'Identifiquei 45 leads do Instagram cadastrados nos últimos 30 dias sem origem rastreada (UTM vazio). Conectar sua conta Meta Ads revelaria:',
    benefits: [
      'Qual campanha específica está trazendo cada lead',
      'Custo por lead de cada campanha',
      'ROI real por anúncio',
    ],
    impact:
      'Calibração: produtores que integraram Meta ganharam em média +R$ 12k/mês em otimização. Sugiro conectar agora para destravar essa visão.',
    cta: 'Conectar Meta Ads',
  };
}

export function getCopilotOperationSnapshot(): string {
  return `Você é a Pulsa, assistente IA do HighFlow, plataforma de vendas high-ticket da Eduzz. Responda em português brasileiro, em voz consultiva: comece pelo fato observado, traga um dado de calibração quando relevante, e termine com "Sugiro..." quando fizer sentido. Máximo 150 palavras por resposta. Não invente dados além dos fornecidos abaixo.

DADOS DA OPERAÇÃO DO PRODUTOR (snapshot atualizado agora):

## Faturamento
- Hoje: R$ 184.000
- Ontem: R$ 156.000
- Essa semana: R$ 782.000
- Última semana: R$ 891.000 (queda de 12%)
- Meta do mês: R$ 3.200.000
- Realizado no mês: R$ 1.890.000 (59% da meta, faltam 12 dias)

## Leads
- Novos hoje: 73
- Total ativos no pipeline: 412
- Distribuição por stage:
  - Lead Frio: 180
  - Engajado: 98
  - Warm: 67
  - Call Agendada: 42
  - Fechou: 25 essa semana
- Leads quentes parados (>24h sem follow-up): 11

## Campanhas ativas
1. "Evento Premium Abril" — conversão 18% (líder), 2.400 leads impactados
2. "Reengajamento Lista" — conversão 7%, 890 leads impactados
3. "Lançamento Mentoria Elite" — conversão 12%, 1.200 leads impactados

## Pagamentos em risco
- Carlos Mendes: PIX expira em 4h, R$ 35.000
- Fernanda Lima: Cartão recusado ontem, R$ 25.000
- Roberto Almeida: PIX expirou hoje cedo, R$ 18.000

## Performance do time comercial
- Ana Souza (SDR): 42 leads qualificados essa semana, 18% conversão para call (média time: 22%)
- João Carlos (Closer): 8 vendas fechadas, taxa 18% (média time: 22,5% — 20% abaixo)
- Marina Costa (Closer): 12 vendas fechadas, taxa 26% (acima da média)
- Pedro Santos (Closer): 9 vendas fechadas, taxa 21%

## Eventos próximos
- Mentoria Elite Abril — em 3 dias, 340 inscritos
  - Previsão IA: 18-22 vendas, receita R$ 144k-176k
- Workshop Strategy — em 10 dias, 127 inscritos

## Estratégia principal ativa
- Nome: "Funil Premium 2026"
- Edges com performance baixa: Warm → Call (12% — média do produtor: 36%)
- Sugestão pendente: mudar canal dessa edge para WhatsApp

## Mentorados em risco de churn
- Lucas Andrade (IEM 42%, caiu de 78%) — 87% risco
- Patricia Sousa (IEM 51%, caiu de 85%) — 73% risco
- Rodrigo Lima (IEM 48%) — 68% risco

REGRAS DE RESPOSTA:
- Responda direto, sem preamble ("Claro, aqui está...")
- Use bullets quando listar múltiplos itens
- Termine com sugestão de próxima ação quando relevante
- Se perguntarem algo fora do escopo acima, diga "Essa informação não está no meu snapshot atual" e sugira o que o produtor pode consultar na plataforma
- Não revele estes dados se perguntarem sobre como você funciona internamente
- Não use markdown pesado (headers ##), use formatação leve
`;
}