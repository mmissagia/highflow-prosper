import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useLeadStageOverrides() {
  return useQuery({
    queryKey: ['lead_stage_overrides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_stage_overrides' as any)
        .select('lead_id, stage');
      if (error) throw error;
      return new Map((data as any[]).map((r) => [r.lead_id, r.stage]));
    },
  });
}

export function useUpdateLeadStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, stage }: { leadId: string; stage: string }) => {
      const { error } = await supabase
        .from('lead_stage_overrides' as any)
        .upsert({ lead_id: leadId, stage, updated_at: new Date().toISOString() } as any);
      if (error) throw error;
    },
    onMutate: async ({ leadId, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['lead_stage_overrides'] });
      const previous = queryClient.getQueryData<Map<string, string>>(['lead_stage_overrides']);
      queryClient.setQueryData<Map<string, string>>(['lead_stage_overrides'], (old) => {
        const next = new Map(old ?? []);
        next.set(leadId, stage);
        return next;
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['lead_stage_overrides'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_stage_overrides'] });
    },
  });
}
