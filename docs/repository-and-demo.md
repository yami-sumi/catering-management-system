# Repository and cross-group demo

Repository: https://github.com/yami-sumi/catering-management-system

## Clone and run

```bash
git clone https://github.com/yami-sumi/catering-management-system.git
cd catering-management-system/backend
npm ci
```

1. Create a **new disposable** PostgreSQL database `catering_management_db`.
2. Run `database/schema.sql` followed by `database/seed.sql` against the **new** database. Do not run setup/reset commands on an existing database.
3. Copy `backend/.env.example` to `backend/.env`, configure PostgreSQL credentials, and generate two different session secrets.
4. Run `node create-admin.js` in `backend/` to create a demo administrator.
5. Run `npm run db:test`, then `npm start`.
6. Visit `/admin-login.html` for admin, `/customer.html` for customer.

## Reviewer checklist

- [ ] Database connection succeeds
- [ ] Admin login, logout, and dashboard access restriction work
- [ ] Customer registration and login work
- [ ] Reservation creation, staff confirmation, and customer display work
- [ ] Pending payment does not reduce verified balance
- [ ] Verified `Paid` payment reduces balance; `Failed`/`Refunded` do not
- [ ] Fully paid reservation hides the customer payment submission button
- [ ] Cancellation request and staff processing work

Record actual results and dates in `docs/testing-report.md`; do not mark tests passed before running them. Payment submission is a claim for staff verification, not a payment gateway.

## Safety

Do not commit `backend/.env`, passwords, session secrets, actual customer data, or database dumps. Share demo credentials privately. The source-only ZIP is not itself a Git checkout; copy changed files into the existing clone and review `git diff` before committing.
