
-- Fix: Change all RLS policies from {public} to {authenticated} for all sensitive tables

-- connections table
DROP POLICY IF EXISTS "Users can create their own connections" ON public.connections;
DROP POLICY IF EXISTS "Users can delete their own connections" ON public.connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON public.connections;
DROP POLICY IF EXISTS "Users can view their own connections" ON public.connections;

CREATE POLICY "Users can create their own connections" ON public.connections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own connections" ON public.connections FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own connections" ON public.connections FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own connections" ON public.connections FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- commission_records table
DROP POLICY IF EXISTS "Users can create their own commission records" ON public.commission_records;
DROP POLICY IF EXISTS "Users can delete their own commission records" ON public.commission_records;
DROP POLICY IF EXISTS "Users can update their own commission records" ON public.commission_records;
DROP POLICY IF EXISTS "Users can view their own commission records" ON public.commission_records;

CREATE POLICY "Users can create their own commission records" ON public.commission_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own commission records" ON public.commission_records FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own commission records" ON public.commission_records FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own commission records" ON public.commission_records FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- sales_users table
DROP POLICY IF EXISTS "Users can create their own sales users" ON public.sales_users;
DROP POLICY IF EXISTS "Users can delete their own sales users" ON public.sales_users;
DROP POLICY IF EXISTS "Users can update their own sales users" ON public.sales_users;
DROP POLICY IF EXISTS "Users can view their own sales users" ON public.sales_users;

CREATE POLICY "Users can create their own sales users" ON public.sales_users FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales users" ON public.sales_users FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales users" ON public.sales_users FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own sales users" ON public.sales_users FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- lead_sources table
DROP POLICY IF EXISTS "Users can create their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can delete their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can update their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;

CREATE POLICY "Users can create their own lead sources" ON public.lead_sources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lead sources" ON public.lead_sources FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own lead sources" ON public.lead_sources FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own lead sources" ON public.lead_sources FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- sales_activities table
DROP POLICY IF EXISTS "Users can create their own sales activities" ON public.sales_activities;
DROP POLICY IF EXISTS "Users can delete their own sales activities" ON public.sales_activities;
DROP POLICY IF EXISTS "Users can update their own sales activities" ON public.sales_activities;
DROP POLICY IF EXISTS "Users can view their own sales activities" ON public.sales_activities;

CREATE POLICY "Users can create their own sales activities" ON public.sales_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales activities" ON public.sales_activities FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales activities" ON public.sales_activities FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own sales activities" ON public.sales_activities FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- deals table
DROP POLICY IF EXISTS "Users can create their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can delete their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can view their own deals" ON public.deals;

CREATE POLICY "Users can create their own deals" ON public.deals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own deals" ON public.deals FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own deals" ON public.deals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own deals" ON public.deals FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- lead_assignments table
DROP POLICY IF EXISTS "Users can create their own lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Users can delete their own lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Users can update their own lead assignments" ON public.lead_assignments;
DROP POLICY IF EXISTS "Users can view their own lead assignments" ON public.lead_assignments;

CREATE POLICY "Users can create their own lead assignments" ON public.lead_assignments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lead assignments" ON public.lead_assignments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own lead assignments" ON public.lead_assignments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own lead assignments" ON public.lead_assignments FOR SELECT TO authenticated USING (auth.uid() = user_id);
