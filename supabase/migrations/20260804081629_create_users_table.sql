/*
# Create users table for WuhanEnglishCoach

## Purpose
Stores per-user profile data for the English learning analysis app:
the user's phone number, learning stage (初中/高中), grade, and textbook version.

## New Tables
- `users`
  - `id` (uuid, primary key, auto-generated)
  - `phone` (text, unique, not null) — the user's mobile number, used as the login identity
  - `stage` (text, nullable) — learning stage: '初中' or '高中'
  - `grade` (text, nullable) — specific grade: '初一','初二','初三','高一','高二','高三'
  - `textbook_version` (text, default '人教版') — textbook edition: '人教版','外研版','牛津版'
  - `created_at` (timestamptz, default now()) — record creation time

## Security
- Row Level Security ENABLED on `users`.
- This app uses a simple localStorage token (no Supabase Auth), so the frontend
  always talks to the database with the anon key. Policies therefore allow
  `anon` AND `authenticated` to perform CRUD on all rows — the data is treated
  as a single-tenant store keyed by phone number, which matches the product's
  "no complex auth" requirement for this MVP.
- Four separate per-verb policies (SELECT/INSERT/UPDATE/DELETE) are created.

## Notes
- `phone` has a UNIQUE constraint so the same phone maps to exactly one profile,
  enabling upsert-by-phone on login.
- Idempotent: safe to re-run (IF NOT EXISTS + DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  stage text,
  grade text,
  textbook_version text DEFAULT '人教版',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON users;
CREATE POLICY "anon_insert_users" ON users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON users;
CREATE POLICY "anon_update_users" ON users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON users;
CREATE POLICY "anon_delete_users" ON users FOR DELETE
  TO anon, authenticated USING (true);
