export interface LeadSuggestions {
  nextAction: string;
  bestPitch: string;
  bestChannel: string;
}

export function getLeadSuggestions(lead: {
  stage: string;
  score: number;
  dealValue: number;
}): LeadSuggestions {
  let nextAction = '';
  if (lead.stage === 'qualificado') {
    nextAction = 'Agendar reunião de diagnóstico nos próximos 2 dias';
  } else if (lead.stage === 'reuniao') {
    nextAction = 'Enviar proposta personalizada após reunião';
  } else if (lead.stage === 'proposta') {
    nextAction = 'Follow-up de fechamento — lead sem resposta há mais de 3 dias';
  } else if (lead.stage === 'fechado') {
    nextAction = 'Iniciar onboarding e apresentar próximos passos';
  } else {
    nextAction = 'Reativar contato com nova abordagem de conteúdo';
  }

  let bestPitch = '';
  if (lead.dealValue >= 20000) {
    bestPitch = 'Mastermind Anual — alinhado ao ticket do lead';
  } else if (lead.dealValue >= 12000) {
    bestPitch = 'Mentoria Elite 12 meses';
  } else if (lead.dealValue >= 6000) {
    bestPitch = 'Imersão Presencial — boa entrada para HT';
  } else {
    bestPitch = 'Mentoria em Grupo — menor barreira de entrada';
  }

  let bestChannel = '';
  if (lead.score >= 70) {
    bestChannel = 'Ligação direta — lead quente, alta propensão de fechamento';
  } else if (lead.score >= 40) {
    bestChannel = 'WhatsApp — manter aquecimento antes da ligação';
  } else {
    bestChannel = 'E-mail — nurturing de conteúdo para reengajar';
  }

  return { nextAction, bestPitch, bestChannel };
}
