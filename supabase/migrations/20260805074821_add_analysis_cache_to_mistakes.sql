ALTER TABLE mistakes
  ADD COLUMN IF NOT EXISTS analysis_cache jsonb;
