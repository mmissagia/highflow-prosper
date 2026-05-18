DROP POLICY IF EXISTS "Authenticated users can view all users_access" ON public.users_access;

CREATE POLICY "Users can view their own users_access"
ON public.users_access
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);