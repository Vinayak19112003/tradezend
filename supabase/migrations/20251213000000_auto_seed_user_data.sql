/*
  # Auto-seed User Data
  
  ## Overview
  1. Ensures a `profiles` row is created when a new user signs up (Trigger on `auth.users`).
  2. Seeds default data (Strategies, Assets, Mistake Tags, Trading Model) when a new profile is created (Trigger on `public.profiles`).

  ## Defaults
  Taken from `src/lib/constants.ts`.
*/

-- 1. Function to handle new user signup (inserts into profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Function to seed default data for a new profile
CREATE OR REPLACE FUNCTION public.seed_default_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Default Strategies
  INSERT INTO public.strategies (user_id, name) VALUES
  (NEW.id, '9 AM CRT'),
  (NEW.id, '9.30 15M MODEL'),
  (NEW.id, 'ASIAN MODEL');

  -- Default Assets
  INSERT INTO public.assets (user_id, name) VALUES
  (NEW.id, 'EURUSD'),
  (NEW.id, 'GBPUSD'),
  (NEW.id, 'USDJPY'),
  (NEW.id, 'SPX500'),
  (NEW.id, 'NAS100'),
  (NEW.id, 'BTCUSD');

  -- Default Mistake Tags
  INSERT INTO public.mistake_tags (user_id, name) VALUES
  (NEW.id, 'No SMT'),
  (NEW.id, 'No CISD'),
  (NEW.id, 'Early Entry'),
  (NEW.id, 'Late Entry'),
  (NEW.id, 'Early Exit'),
  (NEW.id, 'Late Exit'),
  (NEW.id, 'Overtrading'),
  (NEW.id, 'Revenge Trading'),
  (NEW.id, 'FOMO');

  -- Default Trading Model
  INSERT INTO public.trading_model (user_id, week, day, trigger, ltf) VALUES
  (NEW.id,
   ARRAY['Check Cot & Seasonals', 'Check News', 'Outline Possible Weekly Profile'],
   ARRAY['Is PA favorable?', 'Determine DOL', 'Determine most likely daily OLHC'],
   ARRAY['Establish Narrative', 'Establish a POI on H1', 'Combine with session profiles'],
   ARRAY['Wait for Killzone', 'Use LTF confirmation / Retracement entry']
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for seeding data
DROP TRIGGER IF EXISTS on_profile_created_seed_data ON public.profiles;
CREATE TRIGGER on_profile_created_seed_data
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.seed_default_user_data();
