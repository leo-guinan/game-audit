-- Create table for pre-processed demo analysis results
-- Run this SQL in your Neon SQL Editor or Vercel Postgres dashboard

CREATE TABLE IF NOT EXISTS demo_analysis_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  generic_summary TEXT,
  alignment_score INTEGER NOT NULL,
  alignment_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  game_aligned_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(episode_id, game_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_demo_analysis_cache_episode_game ON demo_analysis_cache(episode_id, game_id);
CREATE INDEX IF NOT EXISTS idx_demo_analysis_cache_episode ON demo_analysis_cache(episode_id);
CREATE INDEX IF NOT EXISTS idx_demo_analysis_cache_created_at ON demo_analysis_cache(created_at DESC);

-- Create a table for generic summaries (shared across all games for an episode)
CREATE TABLE IF NOT EXISTS demo_generic_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id TEXT NOT NULL UNIQUE,
  generic_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_demo_generic_summaries_episode ON demo_generic_summaries(episode_id);
