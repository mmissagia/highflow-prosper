-- 1. Add user_id column to strategies table
ALTER TABLE public.strategies 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can create strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can update strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can delete strategies" ON public.strategies;

-- 3. Create secure RLS policies - users can only access their own strategies
CREATE POLICY "Users can view their own strategies" 
ON public.strategies 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own strategies" 
ON public.strategies 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies" 
ON public.strategies 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies" 
ON public.strategies 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);