-- Create the intake_submissions table in Neon Postgres
-- Run this SQL in your Neon SQL Editor or Vercel Postgres dashboard

CREATE TABLE IF NOT EXISTS intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  work_link TEXT NOT NULL,
  clarity_focus TEXT NOT NULL,
  why_now TEXT NOT NULL,
  audit_type TEXT DEFAULT 'Game Audit',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_intake_submissions_created_at ON intake_submissions(created_at DESC);
