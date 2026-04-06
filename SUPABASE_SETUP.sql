-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  account_number VARCHAR(20) UNIQUE,
  recovery_phrase TEXT,
  country VARCHAR(100),
  state VARCHAR(100),
  address TEXT,
  savings_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the savings table
CREATE TABLE IF NOT EXISTS public.savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE REFERENCES public.profiles(email) ON DELETE CASCADE,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) REFERENCES public.profiles(email) ON DELETE CASCADE,
  type VARCHAR(50),
  amount DECIMAL(15, 2),
  description TEXT,
  status VARCHAR(50),
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the bank_cards table
CREATE TABLE IF NOT EXISTS public.bank_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) REFERENCES public.profiles(email) ON DELETE CASCADE,
  card_number VARCHAR(20),
  cardholder_name VARCHAR(255),
  expiry_date VARCHAR(5),
  issuer VARCHAR(100),
  last_four VARCHAR(4),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the bank_accounts table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) REFERENCES public.profiles(email) ON DELETE CASCADE,
  account_name VARCHAR(255),
  account_number VARCHAR(50),
  bank_name VARCHAR(255),
  account_type VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  target_amount DECIMAL(15, 2),
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  deadline DATE,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_savings_email ON public.savings(email);
CREATE INDEX IF NOT EXISTS idx_transactions_user_email ON public.transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_bank_cards_user_email ON public.bank_cards(user_email);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_email ON public.bank_accounts(user_email);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (users can read/update their own)
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id OR email = auth.jwt()->>'email');

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id OR email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR email = auth.jwt()->>'email');

-- RLS Policies for savings
CREATE POLICY "Users can view their own savings"
  ON public.savings
  FOR SELECT
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Users can update their own savings"
  ON public.savings
  FOR UPDATE
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own savings"
  ON public.savings
  FOR INSERT
  WITH CHECK (email = auth.jwt()->>'email');

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions
  FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (user_email = auth.jwt()->>'email');

-- RLS Policies for bank_cards
CREATE POLICY "Users can view their own cards"
  ON public.bank_cards
  FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own cards"
  ON public.bank_cards
  FOR INSERT
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can delete their own cards"
  ON public.bank_cards
  FOR DELETE
  USING (user_email = auth.jwt()->>'email');

-- RLS Policies for bank_accounts
CREATE POLICY "Users can view their own accounts"
  ON public.bank_accounts
  FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own accounts"
  ON public.bank_accounts
  FOR INSERT
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "Users can delete their own accounts"
  ON public.bank_accounts
  FOR DELETE
  USING (user_email = auth.jwt()->>'email');

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals"
  ON public.goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.goals
  FOR DELETE
  USING (auth.uid() = user_id);
