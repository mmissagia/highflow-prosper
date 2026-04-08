
-- 1. Fix campaigns: scope access through strategies ownership
DROP POLICY IF EXISTS "Authenticated users can manage campaigns" ON public.campaigns;

CREATE POLICY "Users can manage their own campaigns"
  ON public.campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.strategies
      WHERE strategies.id = campaigns.strategy_id
      AND strategies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.strategies
      WHERE strategies.id = campaigns.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

-- 2. Fix lead_stage_overrides: add user_id and scope policies
ALTER TABLE public.lead_stage_overrides
  ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

DROP POLICY IF EXISTS "Authenticated users can manage lead stages" ON public.lead_stage_overrides;

CREATE POLICY "Users can manage their own lead stage overrides"
  ON public.lead_stage_overrides
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
