CREATE TABLE public.manual_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  closer_user_id UUID NOT NULL REFERENCES public.sales_users(id) ON DELETE RESTRICT,
  sdr_user_id UUID REFERENCES public.sales_users(id) ON DELETE SET NULL,
  origin TEXT NOT NULL DEFAULT 'Venda Direta',
  created_via TEXT NOT NULL DEFAULT 'checkout_ht',
  stage TEXT NOT NULL DEFAULT 'fechou',
  pipeline_value NUMERIC,
  pitch TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT manual_leads_contact_check CHECK (email IS NOT NULL OR phone IS NOT NULL),
  CONSTRAINT manual_leads_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT manual_leads_stage_check CHECK (stage IN (
    'lead-frio','engajado','warm','agendou','call-agendada',
    'call-realizada','follow-up','fechou','onboarding'
  ))
);

CREATE UNIQUE INDEX manual_leads_user_email_unique
  ON public.manual_leads (user_id, lower(email))
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX manual_leads_user_phone_unique
  ON public.manual_leads (user_id, regexp_replace(phone, '\D', '', 'g'))
  WHERE phone IS NOT NULL;

CREATE INDEX manual_leads_user_id_idx ON public.manual_leads (user_id);
CREATE INDEX manual_leads_closer_idx ON public.manual_leads (closer_user_id);

ALTER TABLE public.manual_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own manual leads"
ON public.manual_leads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own manual leads"
ON public.manual_leads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own manual leads"
ON public.manual_leads FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_manual_leads_updated_at
BEFORE UPDATE ON public.manual_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();