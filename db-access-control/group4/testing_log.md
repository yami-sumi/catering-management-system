# HealthBridge Clinic Management System — Access-Control Testing Log

**Reviewer:** Group 8  
**Project Owner:** Group 03 — HealthBridge  
**Database:** `grp03_projectdb`  
**DBMS Used for Testing:** PostgreSQL 18

## 1. Database Setup

The following scripts were executed successfully:

1. `schema.sql`
2. `seed.sql`
3. `roles.sql`
4. `update_reason.sql`
5. `update_note_unique.sql`
6. `update_billing.sql`
7. `create_views.sql`
8. `demo_accounts.sql`

The database setup completed without reported SQL errors.

## 2. Existing Database Roles

| Role | Login | Superuser | Purpose |
|---|---|---|---|
| `hb_admin` | No | No | Administrative permissions |
| `hb_staff` | No | No | Staff database permissions |
| `hb_app` | Yes | No | PHP backend database account |

The `hb_app` role inherits permissions from `hb_staff`.

## 3. Permission Testing Results

All tests were executed using PostgreSQL. Modification tests targeted a nonexistent record ID (`-1`) and were rolled back.

| Test ID | Test Description | Actual Result | Status |
|---|---|---|---|
| T01 | Check `hb_app` DELETE permission on `deleted_records` | DELETE 0 | Passed |
| T02 | Check `hb_app` UPDATE permission on `deleted_records.label` | UPDATE 0 | Passed |
| T03 | Check `hb_app` UPDATE permission on `staff_users.role` | UPDATE 0 | Passed |
| T04 | Check `hb_app` UPDATE permission on `staff_users.password_hash` | UPDATE 0 | Passed |

**Total:** 4/4 selected SQL permission tests passed.

These results confirm that PostgreSQL permits the tested operations. They do not indicate that actual records were modified.

## 4. Findings

### Finding 1 — Excessive Backup Permissions

**Severity:** Medium

The runtime account `hb_app` can SELECT, INSERT, UPDATE, and DELETE records in `deleted_records`.

The project's documentation describes backup viewing, restoration, and permanent deletion as administrator-only application functions.

**Concern:** PostgreSQL does not independently restrict these operations to an administrator-specific database account.

### Finding 2 — Excessive Staff Account Modification Permissions

**Severity:** High potential impact

The runtime account `hb_app` can execute UPDATE statements targeting `staff_users.role` and `staff_users.password_hash`.

**Concern:** These fields control staff authorization and authentication. Broad database permissions increase the potential impact of an application compromise or unauthorized SQL execution.

## 5. Testing Limitations

- No existing backup or staff account records were modified.
- Tests used `SET LOCAL ROLE hb_app` through an administrative connection, rather than a direct login as `hb_app`.
- PHP application authorization was not bypassed or tested.
- Other database permissions and complete application functionality were not exhaustively tested.

## 6. Recommendations

- Restrict backup management operations to the minimum required privileges.
- Consider separating administrative database operations from routine application operations.
- Review whether unrestricted UPDATE permission on `staff_users` is necessary.
- Apply column-level permissions or dedicated database functions where appropriate.
- Test the proposed restrictions against existing PHP application features before deployment.

**Overall Result:** Two database-level access-control findings supported by four successful permission tests.