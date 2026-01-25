-- Create trigger to increment scans_used_this_month on scan creation
CREATE OR REPLACE FUNCTION public.increment_scan_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET scans_used_this_month = scans_used_this_month + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_scan_created
AFTER INSERT ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.increment_scan_count();

-- Create function to check if user can create a scan (for RLS policy)
CREATE OR REPLACE FUNCTION public.can_create_scan(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT scans_used_this_month < monthly_scan_limit 
     FROM public.profiles 
     WHERE user_id = user_uuid),
    false
  )
$$;

-- Create function to reset monthly scan counts (can be called by a scheduled job)
CREATE OR REPLACE FUNCTION public.reset_monthly_scan_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles SET scans_used_this_month = 0;
END;
$$;