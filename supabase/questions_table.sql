-- ============================================================
-- Supabase Table: form_questions
-- Run this ENTIRE script in Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste & Run
-- ============================================================

DROP TABLE IF EXISTS form_questions CASCADE;

CREATE TABLE form_questions (
  id          TEXT PRIMARY KEY, -- 'roadmap' or 'workshop'
  questions   JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE form_questions ENABLE ROW LEVEL SECURITY;

-- Grant table-level permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON form_questions TO anon, authenticated;
GRANT ALL ON form_questions TO authenticated;

-- Policy: Allow all users to read questions configuration (public form loading)
CREATE POLICY "allow_anon_read_questions"
  ON form_questions
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users (admin) to read/write questions configuration
CREATE POLICY "allow_authenticated_all_questions"
  ON form_questions
  TO authenticated
  USING (true)
  WITH CHECK (true);
