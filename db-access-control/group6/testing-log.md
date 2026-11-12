# Group 6 — Database Access Control Testing Log

**Project:** Car Rental Management System  
**Database:** car_rental_db  
**DBMS:** PostgreSQL 18  
**Reviewer:** Group 8

## Test Results

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Fresh database schema import | Schema imports successfully | Failed because a foreign key referenced `staff` before its primary key was created | FAIL |
| Table primary keys | All tables have primary keys | 16 original tables verified with primary keys after local repair | PASS |
| Runtime audit log UPDATE | Permission denied | Permission denied | PASS |
| Runtime audit log DELETE | Permission denied | Permission denied | PASS |
| Read-only staff password access | Permission denied | Permission denied | PASS |
| Read-only customer password access | Permission denied | Permission denied | PASS |
| Read-only approved columns | SELECT allowed | SELECT allowed | PASS |
| Runtime DELETE restrictions | Only permitted table deletions allowed | DELETE allowed only on `vehicle` among 17 tables | PASS |
| Runtime schema CREATE | Permission denied | Denied | PASS |
| Read-only schema CREATE | Permission denied | Denied | PASS |
| Admin schema CREATE | Permission denied | Denied | PASS |
| Future-table default privileges | Sensitive tables should receive appropriate restrictions | Runtime UPDATE and read-only SELECT automatically granted to a newly created test table | OBSERVATION |
| Sensitive account columns | Minimize unnecessary UPDATE permissions | Runtime UPDATE allowed on staff roles and staff/customer password hashes | OBSERVATION |

## Additional Verification

- Three database group roles were checked: `app_runtime_grp`, `app_readonly_grp`, and `app_admin_grp`.
- All three roles were configured as NOLOGIN roles without superuser, CREATEDB, or CREATEROLE privileges.
- Spring Security restricts staff-management endpoints to ADMIN and SYSTEM_ADMIN.
- System Admin's exclusion from operational endpoints is intentional according to the application's security configuration.
- The temporary future-table privilege test was rolled back.

## Overall Result

Most database access-control restrictions passed. One schema initialization failure was confirmed, along with two access-control hardening concerns. No unauthorized application-level role change was demonstrated.