export const STAGE_LABELS: Record<string, string> = {
  "lead-frio": "Lead Frio",
  "engajado": "Engajado",
  "warm": "Warm",
  "agendou": "Agendou",
  "call-agendada": "Call Agendada",
  "call-realizada": "Call Realizada",
  "follow-up": "Follow-up",
  "fechou": "Fechou",
  "onboarding": "Onboarding",
};

export const STAGE_COLORS: Record<string, string> = {
  "lead-frio": "bg-slate-400",
  "engajado": "bg-blue-400",
  "warm": "bg-yellow-400",
  "agendou": "bg-orange-400",
  "call-agendada": "bg-purple-500",
  "call-realizada": "bg-indigo-400",
  "follow-up": "bg-pink-400",
  "fechou": "bg-green-500",
  "onboarding": "bg-emerald-400",
};

export const CRITICAL_STAGE_IDS = new Set(["call-agendada", "fechou"]);

export function formatStageLabel(stage: string): string {
  return STAGE_LABELS[stage] ?? stage;
}