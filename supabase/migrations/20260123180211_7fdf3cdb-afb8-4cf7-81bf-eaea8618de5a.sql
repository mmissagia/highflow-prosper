-- Create strategies table
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Nova Estratégia',
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- Create public policies (no auth required for now - can be restricted later)
CREATE POLICY "Anyone can view strategies" 
ON public.strategies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create strategies" 
ON public.strategies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update strategies" 
ON public.strategies 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete strategies" 
ON public.strategies 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();