import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UnifiedLead } from "@/types/lead";

// Mock leads — espelha a estrutura inline em src/pages/crm/Pipeline.tsx
// (initialLeads). Mantido aqui em duplicata porque o array original não é
// exportado e a Tarefa 1 proíbe alterar Pipeline.tsx.
const MOCK_LEADS: Array<{
  id: number;
  name: string;
  stage: string;
  origin: string;
  score: number;
  dealValue: number;
  responsible: string;
  lastContact: string;
  pitch: string | null;
  phone: string;
  email: string;
}> = [
  {
    id: 1, name: "Rafael Mendonça", stage: "engajado", origin: "Instagram", score: 85,
    dealValue: 18000, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite 12 meses", phone: "11991234567", email: "rafael@email.com",
  },
  {
    id: 2, name: "Fernanda Alves", stage: "call-agendada", origin: "Indicação", score: 62,
    dealValue: 12000, responsible: "Ana Souza",
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Imersão Presencial", phone: "21987654321", email: "fernanda@email.com",
  },
  {
    id: 3, name: "Thiago Correia", stage: "warm", origin: "Facebook", score: 38,
    dealValue: 8500, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: null, phone: "31976543210", email: "thiago@email.com",
  },
  {
    id: 4, name: "Juliana Martins", stage: "lead-frio", origin: "LinkedIn", score: 91,
    dealValue: 24000, responsible: "Ana Souza",
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mastermind Anual", phone: "41965432109", email: "juliana@email.com",
  },
  {
    id: 5, name: "Bruno Figueiredo", stage: "fechou", origin: "Instagram", score: 77,
    dealValue: 15000, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite 12 meses", phone: "51954321098", email: "bruno@email.com",
  },
  {
    id: 6, name: "Lucia Ferreira", stage: "follow-up", origin: "Meta Ads", score: 88,
    dealValue: 20000, responsible: "Rafael Costa",
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite", phone: "11998887766", email: "lucia@email.com",
  },
];

const mappedMocks: UnifiedLead[] = MOCK_LEADS.map((l) => ({
  id: String(l.id),
  source: "mock",
  name: l.name,
  email: l.email ?? null,
  phone: l.phone ?? null,
  stage: l.stage,
  closer_user_id: null,
  sdr_user_id: null,
  origin: l.origin,
  created_via: null,
  pipeline_value: l.dealValue ?? null,
  pitch: l.pitch ?? null,
  score: l.score ?? null,
  iem: null,
  responsible: l.responsible ?? null,
  last_contact: l.lastContact ?? null,
  created_at: null,
}));

interface UseUnifiedLeadsResult {
  leads: UnifiedLead[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export default function useUnifiedLeads(): UseUnifiedLeadsResult {
  const [manualLeads, setManualLeads] = useState<UnifiedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManual = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error: selectError } = await supabase
        .from("manual_leads")
        .select("*");
      if (selectError) throw selectError;
      const mapped: UnifiedLead[] = (data ?? []).map((row) => ({
        id: row.id,
        source: "manual",
        name: row.name,
        email: row.email ?? null,
        phone: row.phone ?? null,
        stage: row.stage,
        closer_user_id: row.closer_user_id ?? null,
        sdr_user_id: row.sdr_user_id ?? null,
        origin: row.origin,
        created_via: row.created_via ?? null,
        pipeline_value:
          row.pipeline_value === null || row.pipeline_value === undefined
            ? null
            : Number(row.pipeline_value),
        pitch: row.pitch ?? null,
        score: null,
        iem: null,
        responsible: null,
        last_contact: null,
        created_at: row.created_at ?? null,
      }));
      setManualLeads(mapped);
      setError(null);
    } catch (err) {
      setManualLeads([]);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchManual();
  }, [fetchManual]);

  return {
    leads: [...mappedMocks, ...manualLeads],
    isLoading,
    error,
    refetch: fetchManual,
  };
}