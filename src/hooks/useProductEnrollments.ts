import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

export type ProductEnrollment = Tables<'product_enrollments'>;

export interface ProductEnrollmentsParams {
  leadId?: string;
  productId?: string;
}

export function useProductEnrollments(params: ProductEnrollmentsParams = {}) {
  const { user } = useAuth();
  const { leadId, productId } = params;

  const query = useQuery({
    queryKey: ['product_enrollments', user?.id, leadId ?? null, productId ?? null],
    enabled: !!user?.id && (!!leadId || !!productId),
    queryFn: async () => {
      let q = supabase
        .from('product_enrollments')
        .select('*')
        .eq('user_id', user!.id)
        .order('enrolled_at', { ascending: false });

      if (leadId) q = q.eq('lead_id', leadId);
      if (productId) q = q.eq('connected_product_id', productId);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ProductEnrollment[];
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}