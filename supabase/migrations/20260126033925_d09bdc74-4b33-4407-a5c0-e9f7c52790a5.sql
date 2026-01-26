-- Add rollover scans and free trial tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rollover_scans integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS has_used_free_trial boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS last_scan_reset_at timestamp with time zone DEFAULT now();

-- Update increment_scan_count to validate auth context
CREATE OR REPLACE FUNCTION public.increment_scan_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that the user_id matches the authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create scan for another user';
  END IF;
  
  -- Consume rollover scans first, then regular scans
  UPDATE profiles 
  SET 
    rollover_scans = CASE 
      WHEN rollover_scans > 0 THEN rollover_scans - 1 
      ELSE rollover_scans 
    END,
    scans_used_this_month = CASE 
      WHEN rollover_scans > 0 THEN scans_used_this_month 
      ELSE scans_used_this_month + 1 
    END
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Update monthly reset to include rollover logic
CREATE OR REPLACE FUNCTION public.reset_monthly_scan_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job_secret text;
BEGIN
  -- SECURITY: This function should only be called by pg_cron or service role
  -- Check if caller has appropriate privileges
  IF NOT (current_setting('role') = 'service_role' OR current_setting('role') = 'postgres') THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  -- Calculate rollover (unused scans up to max of monthly limit)
  UPDATE public.profiles 
  SET 
    rollover_scans = LEAST(
      rollover_scans + (monthly_scan_limit - scans_used_this_month),
      monthly_scan_limit * 2  -- Max rollover = 2x monthly limit
    ),
    scans_used_this_month = 0,
    last_scan_reset_at = now();
END;
$$;

-- Update can_create_scan to check rollover scans too
CREATE OR REPLACE FUNCTION public.can_create_scan(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT scans_used_this_month, monthly_scan_limit, rollover_scans
  INTO profile_record
  FROM profiles
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Can create if: has rollover scans OR hasn't hit monthly limit
  RETURN (profile_record.rollover_scans > 0) OR 
         (profile_record.scans_used_this_month < profile_record.monthly_scan_limit);
END;
$$;

-- Set tester account to 100 scans
UPDATE public.profiles 
SET monthly_scan_limit = 100 
WHERE email = 'tester@redflag.ai';