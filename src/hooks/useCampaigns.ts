import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Campaign {
  id: string;
  strategy_id: string;
  edge_source: string;
  edge_target: string;
  name: string;
  type: 'automatizada' | 'manual';
  channel: 'whatsapp' | 'email' | 'sms' | 'ligacao' | 'evento' | 'outro';
  status: 'ativo' | 'inativo' | 'rascunho';
  created_at: string;
}

export function useCampaignsByEdge(
  strategyId: string | null,
  edgeSource: string,
  edgeTarget: string
) {
  return useQuery({
    queryKey: ['campaigns', strategyId, edgeSource, edgeTarget],
    enabled: !!strategyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('strategy_id', strategyId!)
        .eq('edge_source', edgeSource)
        .eq('edge_target', edgeTarget)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCampaignCountByEdge(
  strategyId: string | null,
  edgeSource: string,
  edgeTarget: string
) {
  const { data } = useCampaignsByEdge(strategyId, edgeSource, edgeTarget);
  const total = data?.length ?? 0;
  const active = data?.filter((c) => c.status === 'ativo').length ?? 0;
  return { total, active };
}
