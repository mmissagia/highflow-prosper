import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

export type ConnectedProduct = Tables<'connected_products'>;

export type ConnectedProductType = 'course' | 'mentorship' | 'event' | 'ebook' | 'community';
export type ConnectedProductPlatform = 'nutror' | 'alpaclass' | 'weve' | 'blinket' | 'eduzz_core';

export interface ConnectedProductsFilters {
  type?: ConnectedProductType;
  platform?: ConnectedProductPlatform;
}

export interface ConnectedProductsAggregates {
  totalProducts: number;
  totalEnrolled: number;
  avgEngagement: number;
  totalRevenue: number;
}

export function useConnectedProducts(filters: ConnectedProductsFilters = {}) {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['connected_products', user?.id, filters.type ?? null, filters.platform ?? null],
    enabled: !!user?.id,
    queryFn: async () => {
      let q = supabase
        .from('connected_products')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (filters.type) q = q.eq('type', filters.type);
      if (filters.platform) q = q.eq('platform', filters.platform);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ConnectedProduct[];
    },
  });

  const data = query.data ?? [];

  const aggregates: ConnectedProductsAggregates = {
    totalProducts: data.length,
    totalEnrolled: data.reduce((sum, p) => sum + (p.total_enrolled ?? 0), 0),
    avgEngagement: data.length
      ? data.reduce((sum, p) => sum + Number(p.avg_engagement ?? 0), 0) / data.length
      : 0,
    totalRevenue: data.reduce((sum, p) => sum + Number(p.revenue_total ?? 0), 0),
  };

  return {
    data,
    aggregates,
    isLoading: query.isLoading,
    error: query.error,
  };
}