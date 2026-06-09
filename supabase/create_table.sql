-- ============================================================
-- Supabase Table: form_submissions
-- Run this ENTIRE script in Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste & Run
-- ============================================================

-- Clean slate: drop existing table and all its policies
DROP TABLE IF EXISTS form_submissions CASCADE;

-- Create the table
CREATE TABLE form_submissions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Q1: What country are you based in? (dropdown)
  country                       TEXT,

  -- Q2: What is your primary financial goal for the next 12 months? (multiple_choice)
  primary_financial_goal        TEXT,

  -- Q3: What’s your current financial situation? (multiple_choice)
  current_financial_situation   TEXT,

  -- Q4: Which of the following do you relate to as a challenge keeping you from a wealth mindset? (multiple_choice)
  wealth_mindset_challenge      TEXT,

  -- Q5: What does “wealth” mean to you right now? (multiple_choice)
  wealth_meaning                TEXT,

  -- Q6: What is your wealth goal over the next 1-3 years? (long_text)
  wealth_goal_1_3_years         TEXT,

  -- Q7: How much do you currently save or invest monthly? (multiple_choice)
  monthly_save_invest           TEXT,

  -- Q8: Are you willing to follow a strict process over 5 sessions? (multiple_choice)
  willing_to_follow_5_sessions  TEXT,

  -- Q9: Are you ready to make a USD4,675 investment? (multiple_choice)
  investment_ready_usd4675      TEXT,

  -- Q10: Contact Details (contact_group)
  first_name            TEXT,
  last_name             TEXT,
  email                 TEXT,
  phone                 TEXT,

  -- Lead Management Fields (Default to New)
  status                TEXT DEFAULT 'New' NOT NULL,
  notes                 TEXT DEFAULT '' NOT NULL
);

-- ============================================================
-- Row Level Security (RLS)
-- Supabase API ALWAYS enforces RLS, so we must enable it
-- and create explicit policies for the anon role.
-- ============================================================

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Grant table-level permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- The anon role only needs INSERT permissions for the public lead-generation form
GRANT INSERT ON form_submissions TO anon;
GRANT ALL ON form_submissions TO authenticated;

-- Policy: Allow anonymous inserts (public form)
CREATE POLICY "allow_anon_insert"
  ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all submissions
CREATE POLICY "allow_authenticated_select"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update submissions (status, notes)
CREATE POLICY "allow_authenticated_update"
  ON form_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete submissions
CREATE POLICY "allow_authenticated_delete"
  ON form_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Index on created_at for sorting submissions
CREATE INDEX idx_form_submissions_created_at ON form_submissions (created_at DESC);
