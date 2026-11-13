# Group 10 – UniSync
## Database Access Control Testing Log

**Project:** UniSync  
**DBMS:** PostgreSQL 18  
**Database:** `grp10_unisyncdb`  
**Repository:** https://github.com/CoffyJosh/unisync.git  
**Testing Environment:** Windows CMD, PostgreSQL 18, XAMPP/PHP

### 1. Testing Objective

Evaluate the implementation of database access control, including database roles, privileges, Row-Level Security (RLS), organization membership permissions, and administrative restrictions.

### 2. Database Setup

The project database was created and initialized using the repository's SQL scripts:

- `db/init.sql` – Created the database tables and indexes.
- `db/seed.sql` – Inserted sample records.
- `db/access-control.sql` – Created database roles, privileges, and RLS policies.

All three scripts executed successfully.

### 3. Access Control Tests

| Test | Procedure | Actual Result | Assessment |
|---|---|---|---|
| 1. Database roles | Inspected the six UniSync database roles. | All six roles were non-superusers without `BYPASSRLS`. | PASS |
| 2. Account deletion | Attempted to delete an account using `unisync_app`. | PostgreSQL returned `permission denied for table account`. | PASS |
| 3. Unauthorized promotion | Attempted to promote Account 2 from Member to Admin in Organization 3. | PostgreSQL rejected the update due to an RLS policy. | PASS |
| 4. Unauthorized deactivation | Account 2 attempted to deactivate another member in Organization 3. | `UPDATE 0`; no record changed. | PASS |
| 5. Cross-organization reassignment | Attempted to move a membership into another organization. | PostgreSQL rejected the change due to an RLS policy. | PASS |
| 6. Admin membership claim | Account 2 attempted to claim Admin membership in an organization with no existing memberships. | PostgreSQL permitted the insertion. | FAIL |
| 7. Authorized promotion | Account 2, Admin of Organization 2, promoted Account 5 to Admin. | `UPDATE 1`; permitted. | PASS |
| 8. Admin deactivation | Account 5, acting as Admin, deactivated Account 2's membership. | `UPDATE 1`; permitted. | PASS — Consistent with Admin permissions |
| 9. Last Admin deactivation | Deactivated both Admin memberships in Organization 2. | The active Admin count became `0`. | FAIL |
| 10. Rollback verification | Checked memberships 8 and 9 after the transaction rollback. | Account 2 remained Admin; Account 5 remained Manager; both active. | PASS |

### 4. Key Evidence

**Test 6 – Admin Membership Claim**

An insertion using `unisync_app` with `app.account_id = 2` successfully created an Admin membership for a newly created organization without existing members.

Result:

```text
membership_id | account_id | organization_id | role
240           | 2          | 31              | Admin
```

The transaction was rolled back. This demonstrates a database-level authorization weakness. The application's normal organization-creation workflow was not proven vulnerable.

**Test 7 – Authorized Promotion**

```text
membership_id | account_id | organization_id | role  | status
9             | 5          | 2               | Admin | active

UPDATE 1
ROLLBACK
```

The authorized Admin promotion succeeded.

**Test 9 – Organization Without an Active Admin**

After promoting Account 5 and deactivating both Admin memberships:

```text
UPDATE 1
UPDATE 1
UPDATE 1

remaining_active_admins
0

ROLLBACK
```

PostgreSQL permitted an active organization to have zero active Admins.

**Test 10 – Data Restoration**

```text
membership_id | account_id | organization_id | role    | status
8             | 2          | 2               | Admin   | active
9             | 5          | 2               | Manager | active
```

The original membership records were restored successfully.

### 5. Additional Configuration Observations

**Database Connection**

The application's `config/db.php` uses `postgres` as its default database username when no local environment override is supplied. PostgreSQL's `postgres` superuser can bypass RLS protections.

**PHP Session Configuration**

The tested XAMPP environment returned:

```text
session.cookie_secure = 0
session.cookie_httponly = empty
session.cookie_samesite = empty
session.use_strict_mode = 0
```

These observations concern the tested PHP environment and do not establish that all UniSync deployments use the same settings.

### 6. Testing Conclusion

UniSync successfully restricts several unauthorized membership operations through database privileges and RLS.

However, testing identified weaknesses involving the default superuser database connection, Admin membership claims in unclaimed organizations, and the lack of database-level enforcement requiring active organizations to retain an active Admin.

The PHP application includes additional authorization and Admin succession checks, but those safeguards are not independently enforced by every database policy.

**Data Integrity:** All temporary changes made during the membership tests were rolled back. No permanent changes were made to the tested membership records.