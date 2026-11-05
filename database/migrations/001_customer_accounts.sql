-- Safe additive migration for existing databases. Does NOT reset tables or data.
-- Run once using psql -U postgres -d grp00_cateringdb -f database/migrations/001_customer_accounts.sql
ALTER TABLE customer ADD COLUMN IF NOT EXISTS password_hash TEXT;
-- Existing admin-entered customers do not have a password and cannot log in
-- until they register using a different email or a future account-claim workflow.
