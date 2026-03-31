-- First update any orphaned rows (NULL user_id) to prevent migration failure
-- Then add NOT NULL constraint to strategies.user_id
DELETE FROM public.strategies WHERE user_id IS NULL;
ALTER TABLE public.strategies ALTER COLUMN user_id SET NOT NULL;