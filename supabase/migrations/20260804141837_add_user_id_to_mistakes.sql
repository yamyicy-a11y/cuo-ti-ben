/*
# Add user_id column to mistakes table

## Purpose
The mistakes table currently scopes rows by `user_phone` (text). The application
now needs to scope by `user_id` (uuid referencing users.id) so that inserts and
queries join properly to the users table.

## Changes
- Add column `user_id` (uuid, nullable) to `mistakes`.
- Add foreign key constraint: `mistakes.user_id` → `users.id` ON DELETE CASCADE.
- Add index on `user_id` for efficient per-user lookups.
- Backfill existing rows (if any) by looking up the users table on `user_phone`.
  This is safe and idempotent — only updates rows where user_id is still null.

## Security
- No RLS policy changes. Existing anon+authenticated CRUD policies remain in
  effect and cover the new column automatically (no column-level restrictions).

## Notes
- The `user_phone` column is kept (not dropped) to avoid data loss.
- Idempotent: safe to re-run.
*/

ALTER TABLE mistakes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_mistakes_user_id ON mistakes(user_id);

UPDATE mistakes
SET user_id = users.id
FROM users
WHERE mistakes.user_phone = users.phone
  AND mistakes.user_id IS NULL;
