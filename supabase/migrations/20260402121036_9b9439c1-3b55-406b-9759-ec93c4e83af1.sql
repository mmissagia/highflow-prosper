
CREATE TABLE public.users_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'Convidado',
  invited_at timestamptz NOT NULL DEFAULT now(),
  last_access timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own users_access" ON public.users_access FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own users_access" ON public.users_access FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own users_access" ON public.users_access FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own users_access" ON public.users_access FOR DELETE TO authenticated USING (auth.uid() = user_id);
