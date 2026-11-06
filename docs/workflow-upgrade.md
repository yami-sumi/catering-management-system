# Integrated workflow upgrade (Activity 2 → Activity 3)

## Safe installation on an existing database
1. Back up `catering_management_db` before changing it.
2. Run **only** `database/migrations/002_payment_workflow.sql` on the existing database, after migration 001 has already been applied.
3. Do **not** run `database/schema.sql`, seed resets, or `setup-db.js --reset` on your populated database.
4. Keep your existing `backend/.env` on your computer. Do not put it in the ZIP or Git.
5. Restart the Node backend and hard-refresh the browser.

## Workflow
- Customer registration → customer row; duplicate emails are checked case-insensitively at the API level (not a concurrency-safe database constraint).
- Customer booking → Pending reservation; admin Reservations auto-refreshes every 5 seconds.
- Staff confirms → customer sees Confirmed and can submit a payment reference and amount.
- Payment details → Pending payment; staff Payments auto-refreshes and staff independently verifies receipt before setting Paid. The customer can see recorded paid amounts and payment statuses.
- Customer cancellation request → Pending cancellation without changing reservation status. Staff may mark Processed (then reservation becomes Cancelled), or Rejected. No automatic refund transfer occurs.
- Staff manages employees, assignments and inventory. Inventory is NOT deducted automatically, because there is no recipe-to-inventory mapping.

## Limitations and security
- **Classroom/local demo only.** Staff APIs and dashboard require an admin session (`requireAdmin`), but this is not a production security review. Do not expose port 5000 to the public Internet.
- Payment submission is a *claim* of payment, not payment processing; verify bank/wallet transactions independently. No gateway, receipt upload, automatic transfer or automatic refunds.
- Admin can still manually edit or delete records; stricter state transitions, audit logs, and payment reconciliation are future work.
- Payment balance checks are enforced for customer submissions, not all staff API writes. Concurrent submissions and staff changes need database-level locking/constraints for production.
- Existing duplicate email records require manual reconciliation before adding a case-insensitive unique index.
- Status changes do not automatically notify by email or SMS; customers can refresh their portal.
