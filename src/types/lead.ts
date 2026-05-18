export type LeadSource = "mock" | "manual";

export interface UnifiedLead {
  id: string;
  source: LeadSource;
  name: string;
  email: string | null;
  phone: string | null;
  stage: string;
  closer_user_id: string | null;
  sdr_user_id: string | null;
  origin: string;
  created_via: string | null;
  pipeline_value: number | null;
  pitch: string | null;
  score: number | null;
  iem: number | null;
  responsible: string | null;
  last_contact: string | null;
  created_at: string | null;
}