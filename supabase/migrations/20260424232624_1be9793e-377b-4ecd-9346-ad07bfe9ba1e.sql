-- TABLE 1: connected_products
CREATE TABLE public.connected_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('course', 'mentorship', 'event', 'ebook', 'community')),
  platform TEXT NOT NULL CHECK (platform IN ('nutror', 'alpaclass', 'weve', 'blinket', 'eduzz_core')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  sync_enabled BOOLEAN NOT NULL DEFAULT true,
  total_enrolled INTEGER DEFAULT 0,
  completion_rate DECIMAL DEFAULT 0,
  avg_engagement DECIMAL DEFAULT 0,
  revenue_total DECIMAL DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.connected_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connected products"
ON public.connected_products FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connected products"
ON public.connected_products FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connected products"
ON public.connected_products FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connected products"
ON public.connected_products FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_connected_products_updated_at
BEFORE UPDATE ON public.connected_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_connected_products_user_id ON public.connected_products(user_id);
CREATE INDEX idx_connected_products_type ON public.connected_products(type);
CREATE INDEX idx_connected_products_platform ON public.connected_products(platform);

-- TABLE 2: product_enrollments
CREATE TABLE public.product_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id TEXT NOT NULL,
  connected_product_id UUID NOT NULL REFERENCES public.connected_products(id) ON DELETE CASCADE,
  external_enrollment_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  progress DECIMAL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  engagement_score DECIMAL DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own product enrollments"
ON public.product_enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own product enrollments"
ON public.product_enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product enrollments"
ON public.product_enrollments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product enrollments"
ON public.product_enrollments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_product_enrollments_updated_at
BEFORE UPDATE ON public.product_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_product_enrollments_user_id ON public.product_enrollments(user_id);
CREATE INDEX idx_product_enrollments_lead_id ON public.product_enrollments(lead_id);
CREATE INDEX idx_product_enrollments_product_id ON public.product_enrollments(connected_product_id);