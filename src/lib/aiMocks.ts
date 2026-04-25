// Mocks estruturados de IA. Todos os retornos são hardcoded e realistas.
// A única IA real no protótipo é o Copiloto WhatsApp (F10-E) — via Edge Function Supabase.

import type { AIInsight } from "@/types/ai";

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