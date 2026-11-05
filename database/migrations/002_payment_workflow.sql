-- Safe additive migration for an EXISTING database. Back up first.
BEGIN;
ALTER TABLE payment ADD COLUMN IF NOT EXISTS payment_method VARCHAR(40);
ALTER TABLE payment ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100);
COMMIT;
