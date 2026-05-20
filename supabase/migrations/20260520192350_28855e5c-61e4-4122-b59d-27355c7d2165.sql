CREATE TABLE public.payment_links (
  id TEXT PRIMARY KEY,
  producer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_name TEXT NOT NULL,
  lead_email TEXT,
  lead_phone TEXT,
  description TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL,
  payment_lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  closer_name TEXT,
  closer_initials TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','expired','cancelled')),
  expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  paid_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read by id"
  ON public.payment_links FOR SELECT
  USING (true);

CREATE POLICY "Producer insert own"
  ON public.payment_links FOR INSERT
  WITH CHECK (auth.uid() = producer_id);

CREATE POLICY "Producer update own"
  ON public.payment_links FOR UPDATE
  USING (auth.uid() = producer_id);

CREATE POLICY "Public mark paid"
  ON public.payment_links FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status IN ('pending','paid'));

CREATE INDEX idx_payment_links_producer ON public.payment_links(producer_id);
CREATE INDEX idx_payment_links_status ON public.payment_links(status);