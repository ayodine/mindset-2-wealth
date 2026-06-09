-- ============================================================
-- Supabase Table: workshop_submissions
-- Run this ENTIRE script in Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste & Run
-- ============================================================

DROP TABLE IF EXISTS workshop_submissions CASCADE;

CREATE TABLE workshop_submissions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  full_name           TEXT NOT NULL,
  organization_name   TEXT NOT NULL,
  job_title           TEXT NOT NULL,
  email               TEXT NOT NULL,
  website_link        TEXT,
  location            TEXT NOT NULL,
  expected_attendees  TEXT NOT NULL,
  session_type        TEXT NOT NULL,
  topics              TEXT[] NOT NULL, -- Stored as text array (or text representation)
  format              TEXT NOT NULL,
  event_date_time     TEXT,
  has_budget          TEXT NOT NULL,
  audience_struggles  TEXT,
  success_outcome     TEXT,
  referral_source     TEXT NOT NULL,

  -- Lead Management Fields (Default to New)
  status              TEXT DEFAULT 'New' NOT NULL,
  notes               TEXT DEFAULT '' NOT NULL
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE workshop_submissions ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON workshop_submissions TO anon;
GRANT ALL ON workshop_submissions TO authenticated;

-- Policy: Allow anonymous and authenticated inserts (public form)
CREATE POLICY "allow_anon_insert_workshop"
  ON workshop_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all submissions
CREATE POLICY "allow_authenticated_select_workshop"
  ON workshop_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update submissions (status, notes)
CREATE POLICY "allow_authenticated_update_workshop"
  ON workshop_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete submissions
CREATE POLICY "allow_authenticated_delete_workshop"
  ON workshop_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Index on created_at for sorting submissions
CREATE INDEX idx_workshop_submissions_created_at ON workshop_submissions (created_at DESC);
