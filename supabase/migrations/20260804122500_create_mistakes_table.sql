/*
# Create mistakes table for WuhanEnglishCoach

## Purpose
Stores individual wrong-answer mistakes that users save from exam analysis.
Each mistake is scoped to a user by their phone number (the app's login identity).

## New Tables
- `mistakes`
  - `id` (uuid, primary key, auto-generated)
  - `user_phone` (text, not null) — the phone number of the user who owns this mistake
  - `question` (text, not null) — the full question text
  - `user_answer` (text, nullable) — the answer the user chose
  - `correct_answer` (text, nullable) — the correct answer
  - `grammar` (text, nullable) — grammar point tag (e.g. "一般过去时")
  - `created_at` (timestamptz, default now()) — when the mistake was saved

## Security
- Row Level Security ENABLED on `mistakes`.
- This app uses phone-based localStorage tokens (no Supabase Auth), so the
  frontend always operates with the anon key. Policies allow `anon` AND
  `authenticated` to perform CRUD on all rows — the data is scoped by
  `user_phone` in application queries, matching the MVP's "no complex auth"
  requirement.
- Four separate per-verb policies (SELECT/INSERT/UPDATE/DELETE).

## Notes
- Idempotent: safe to re-run (IF NOT EXISTS + DROP POLICY IF EXISTS).
- An index on `user_phone` is added for efficient per-user lookups.
*/

CREATE TABLE IF NOT EXISTS mistakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone text NOT NULL,
  question text NOT NULL,
  user_answer text,
  correct_answer text,
  grammar text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_phone ON mistakes(user_phone);

ALTER TABLE mistakes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_mistakes" ON mistakes;
CREATE POLICY "anon_select_mistakes" ON mistakes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mistakes" ON mistakes;
CREATE POLICY "anon_insert_mistakes" ON mistakes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mistakes" ON mistakes;
CREATE POLICY "anon_update_mistakes" ON mistakes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_mistakes" ON mistakes;
CREATE POLICY "anon_delete_mistakes" ON mistakes FOR DELETE
  TO anon, authenticated USING (true);
