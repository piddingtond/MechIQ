-- MechIQ DB helper functions
-- Run in Supabase SQL editor

-- Atomic increment for query_usage (insert-or-increment)
-- Returns the new count after increment
CREATE OR REPLACE FUNCTION increment_query_count(p_user_id UUID, p_date DATE)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO query_usage (user_id, date, count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET count = query_usage.count + 1
  RETURNING count INTO v_count;

  RETURN v_count;
END;
$$;

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION increment_query_count(UUID, DATE) TO authenticated;

-- Auto-create a profiles row when a user signs up via Supabase auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, garage_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'garage_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
