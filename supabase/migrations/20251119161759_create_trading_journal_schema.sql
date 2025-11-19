/*
  # Trading Journal Database Schema

  ## Overview
  Creates the complete database schema for a trading journal application including
  users, accounts, trades, settings, and related data.

  ## Tables Created
  
  ### 1. `profiles`
  User profile information
  - `id` (uuid, references auth.users) - User ID
  - `email` (text) - User email
  - `display_name` (text) - User display name
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `accounts`
  Trading accounts for each user
  - `id` (uuid) - Account ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `name` (text) - Account name
  - `initial_balance` (numeric) - Starting balance
  - `current_balance` (numeric) - Current balance
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `trades`
  Individual trade records
  - `id` (uuid) - Trade ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `account_id` (uuid, references accounts) - Associated account
  - `date` (timestamptz) - Trade date
  - `asset` (text) - Asset/symbol traded
  - `strategy` (text) - Strategy used
  - `direction` (text) - Buy/Sell
  - `entry_time` (text) - Entry time
  - `exit_time` (text) - Exit time
  - `entry_price` (numeric) - Entry price
  - `sl` (numeric) - Stop loss
  - `rr` (numeric) - Risk/reward ratio
  - `exit_price` (numeric) - Exit price
  - `result` (text) - Win/Loss/BE/Missed
  - `confidence` (integer) - Confidence level 1-10
  - `mistakes` (text[]) - Array of mistake tags
  - `rules_followed` (text[]) - Array of rules followed
  - `model_followed` (jsonb) - Trading model adherence data
  - `notes` (text) - Trade notes
  - `screenshot_url` (text) - Screenshot URL
  - `account_size` (numeric) - Account size at trade time
  - `risk_percentage` (numeric) - Risk percentage
  - `pnl` (numeric) - Profit/loss amount
  - `ticket` (text) - Trade ticket/ID
  - `pre_trade_emotion` (text) - Emotion before trade
  - `post_trade_emotion` (text) - Emotion after trade
  - `market_context` (text) - Market context
  - `entry_reason` (text) - Reason for entry
  - `trade_feelings` (text) - Feelings during trade
  - `loss_analysis` (text) - Analysis if loss
  - `session` (text) - Trading session (London/New York/Asian)
  - `key_level` (text) - Key price level
  - `entry_time_frame` (text) - Entry timeframe
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `user_settings`
  User preferences and configuration
  - `id` (uuid) - Settings ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `currency` (text) - Preferred currency (usd/inr)
  - `streamer_mode` (boolean) - Streamer mode enabled
  - `daily_target` (numeric) - Daily profit target
  - `weekly_target` (numeric) - Weekly profit target
  - `monthly_target` (numeric) - Monthly profit target
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `strategies`
  User-defined trading strategies
  - `id` (uuid) - Strategy ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `name` (text) - Strategy name
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. `assets`
  User-defined trading assets
  - `id` (uuid) - Asset ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `name` (text) - Asset name
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. `mistake_tags`
  User-defined mistake tags
  - `id` (uuid) - Tag ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `name` (text) - Tag name
  - `created_at` (timestamptz) - Creation timestamp

  ### 8. `trading_rules`
  User-defined trading rules
  - `id` (uuid) - Rule ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `name` (text) - Rule name
  - `created_at` (timestamptz) - Creation timestamp

  ### 9. `trading_model`
  User's trading model configuration
  - `id` (uuid) - Model ID
  - `user_id` (uuid, references profiles) - Owner user ID
  - `week` (text[]) - Weekly analysis checklist
  - `day` (text[]) - Daily analysis checklist
  - `trigger` (text[]) - Trigger checklist
  - `ltf` (text[]) - Lower timeframe checklist
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Policies ensure proper authentication and ownership checks
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  initial_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  asset text NOT NULL,
  strategy text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('Buy', 'Sell')),
  entry_time text,
  exit_time text,
  entry_price numeric NOT NULL DEFAULT 0,
  sl numeric NOT NULL DEFAULT 0,
  rr numeric DEFAULT 0,
  exit_price numeric NOT NULL DEFAULT 0,
  result text NOT NULL CHECK (result IN ('Win', 'Loss', 'BE', 'Missed')),
  confidence integer DEFAULT 5 CHECK (confidence >= 1 AND confidence <= 10),
  mistakes text[] DEFAULT '{}',
  rules_followed text[] DEFAULT '{}',
  model_followed jsonb DEFAULT '{"week": [], "day": [], "trigger": [], "ltf": []}'::jsonb,
  notes text,
  screenshot_url text DEFAULT '',
  account_size numeric DEFAULT 0,
  risk_percentage numeric DEFAULT 0,
  pnl numeric DEFAULT 0,
  ticket text,
  pre_trade_emotion text,
  post_trade_emotion text,
  market_context text,
  entry_reason text,
  trade_feelings text,
  loss_analysis text,
  session text CHECK (session IS NULL OR session IN ('London', 'New York', 'Asian')),
  key_level text,
  entry_time_frame text CHECK (entry_time_frame IS NULL OR entry_time_frame IN ('1m', '3m', '5m', '15m', '1h', '4h', 'Daily')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades"
  ON trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades"
  ON trades FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text DEFAULT 'usd' CHECK (currency IN ('usd', 'inr')),
  streamer_mode boolean DEFAULT false,
  daily_target numeric DEFAULT 0,
  weekly_target numeric DEFAULT 0,
  monthly_target numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategies"
  ON strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategies"
  ON strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategies"
  ON strategies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create mistake_tags table
CREATE TABLE IF NOT EXISTS mistake_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE mistake_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mistake tags"
  ON mistake_tags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mistake tags"
  ON mistake_tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mistake tags"
  ON mistake_tags FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trading_rules table
CREATE TABLE IF NOT EXISTS trading_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE trading_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trading rules"
  ON trading_rules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading rules"
  ON trading_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trading rules"
  ON trading_rules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trading_model table
CREATE TABLE IF NOT EXISTS trading_model (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week text[] DEFAULT '{}',
  day text[] DEFAULT '{}',
  trigger text[] DEFAULT '{}',
  ltf text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trading_model ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trading model"
  ON trading_model FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading model"
  ON trading_model FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading model"
  ON trading_model FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_account_id ON trades(account_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_mistake_tags_user_id ON mistake_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_rules_user_id ON trading_rules(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_model_updated_at BEFORE UPDATE ON trading_model
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
