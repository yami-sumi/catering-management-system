# Reviewer Guide — Catering Business Management System

## Purpose
This guide helps another group install, inspect, and evaluate the project locally. It documents the current source structure; it is **not** evidence that all tests have passed.

## Requirements
- Node.js and npm
- PostgreSQL, with a database and credentials the reviewer controls
- A browser
- Git (if cloning)

## Project map
- `frontend/`: customer portal, staff dashboard, admin login, styles, browser scripts
- `backend/index.js`: Express server, sessions, routes, and static pages
- `backend/routes/`: CRUD, customer portal, and admin authentication endpoints
- `backend/create-admin.js`: initial administrator account setup
- `database/schema.sql`: baseline application tables
- `database/migrations/`: additive changes for existing databases
- `docs/`: design, verification, testing, and limitations

## Safe installation on a new, disposable database
1. Clone or extract the project. Do not use an existing populated database for experiments.
2. Create a **new** PostgreSQL database. Configure `backend/.env` from `backend/.env.example` using local credentials. Set different long, random `SESSION_SECRET` and `CUSTOMER_SESSION_SECRET` values. Never commit `.env`.
3. Review `database/schema.sql` and migrations before running them. The schema includes business tables and `admin`; the session table is created by the server at runtime.
4. From `backend/`, run `npm ci`. All required backend dependencies, including `bcrypt`, are declared in the backend manifest and lockfile.
5. Initialize the disposable database following the README. Do not run reset commands against existing data. Apply additive migrations only when needed, after inspecting the schema.
6. From `backend/`, run `npm run db:test` and `npm start`.
7. Create an administrator using `backend/create-admin.js` after inspecting its prompts and configuration. Use demo-only credentials; share them with reviewers through a private channel, never in GitHub.

## Pages to review
- `http://localhost:5000/admin-login.html` — administrator sign-in
- `http://localhost:5000/` — staff dashboard; requires administrator session
- `http://localhost:5000/customer.html` — customer portal
- `http://localhost:5000/api/db-test` — database connectivity check; note that this route is not an authentication test

## Suggested evaluation walkthrough
1. Confirm the server starts and the database test returns the expected database name.
2. Visit the staff dashboard while logged out; verify redirect to the admin login.
3. Sign in as admin, inspect customer, package, reservation, payment, employee, inventory, assignment, and cancellation views; sign out and check access again.
4. Register/sign in as a demo customer; create a reservation and verify its initial state.
5. As staff, confirm the reservation. As customer, submit payment details; as staff, independently verify and mark the transaction `Paid`.
6. For a reservation with a known estimated cost, verify that **only `Paid` transactions** count toward the total. Check Unpaid, Partially Paid, Paid, and Overpaid summaries using test records.
7. Check that the customer payment-submission button disappears when the remaining balance is zero. This is a UI behavior, **not** a substitute for server-side payment enforcement.
8. Test a cancellation request and staff review using disposable records.
9. Record actual outcomes, screenshots, and test date in `docs/testing-report.md`; do not label untested steps Passed.

## Payment rules and limits
- Payment transaction statuses: `Pending`, `Paid`, `Refunded`, `Failed`.
- Reservation-level payment status is calculated from estimated cost and the sum of `Paid` transactions.
- A `Failed` or `Pending` payment does not reduce verified outstanding balance.
- The frontend hides payment submission for fully paid bookings, but the staff payment API may still allow corrections or excess payments. This is not a production payment gateway and does not transfer money or automatically issue refunds.

## Documentation caveats
- Staff APIs are protected by `requireAdmin`; session authentication is for local/classroom use, not production security assurance.
- Customer payment-detail submission records a claim of payment for staff verification, not a real transfer.
- `docs/database-documentation.md` describes the 10 baseline business tables. Admin and session storage are additional operational tables; verify their presence in the database actually being tested.
- Existing testing reports describe previous test runs, not a fresh end-to-end verification of the current code.
- PostgreSQL roles in `docs/roles-and-privileges.md` are proposed design roles, not necessarily created DB roles.

## Before submitting to another group
- Confirm `npm ci` succeeds using the committed backend package manifests.
- Confirm no `.env`, secret, database dump, or real customer information is committed.
- Provide demo data/setup steps and private demo credentials.
- Attach dated screenshots or a completed test checklist only for tests actually performed.
- State clearly that the system is for local/classroom demonstration, not public deployment.
