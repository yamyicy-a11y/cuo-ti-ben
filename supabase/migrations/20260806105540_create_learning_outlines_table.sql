/*
# Create learning_outlines table

1. New Tables
- `learning_outlines`
  - `id` (uuid, primary key)
  - `outline_data` (jsonb, stores the outline knowledge point cards)
  - `created_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `learning_outlines`.
- Allow anon + authenticated CRUD because the app has no sign-in screen (single-tenant, shared data).

3. Notes
- This table stores AI-generated learning outlines derived from mistake analysis.
- Only the latest row is read by the /outline page.
- outline_data is a JSON array of knowledge point objects, each with at minimum an `id` and `title` field for card rendering and navigation to /courseware/[id].
*/

CREATE TABLE IF NOT EXISTS learning_outlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outline_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE learning_outlines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_learning_outlines" ON learning_outlines;
CREATE POLICY "anon_select_learning_outlines" ON learning_outlines FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_learning_outlines" ON learning_outlines;
CREATE POLICY "anon_insert_learning_outlines" ON learning_outlines FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_learning_outlines" ON learning_outlines;
CREATE POLICY "anon_update_learning_outlines" ON learning_outlines FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_learning_outlines" ON learning_outlines;
CREATE POLICY "anon_delete_learning_outlines" ON learning_outlines FOR DELETE
  TO anon, authenticated USING (true);
