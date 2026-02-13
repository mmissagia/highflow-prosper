
-- Tabela de conexões com plataformas externas
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL, -- EDUZZ, HOTMART, KIWIFY, ACTIVECAMPAIGN, MANYCHAT, META
  status TEXT NOT NULL DEFAULT 'disconnected', -- connected, disconnected, token_expired
  api_key_encrypted TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections"
ON public.connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections"
ON public.connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
ON public.connections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
ON public.connections FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de fontes de leads
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- CRM_SEGMENT, EXTERNAL_PRODUCT
  provider TEXT, -- EDUZZ, HOTMART, etc (null para CRM_SEGMENT)
  reference_id TEXT, -- ID do produto na plataforma externa
  reference_name TEXT, -- Nome do produto
  cached_count INTEGER DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  connection_id UUID REFERENCES public.connections(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead sources"
ON public.lead_sources FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lead sources"
ON public.lead_sources FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead sources"
ON public.lead_sources FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead sources"
ON public.lead_sources FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_lead_sources_updated_at
BEFORE UPDATE ON public.lead_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
