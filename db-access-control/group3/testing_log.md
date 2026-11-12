# Group 3 — PAWPAW Access-Control Testing Log

**Reviewer:** Group 8  
**Database:** group3_Pawpaw  
**DBMS:** PostgreSQL 18.6  
**Tables:** 14  
**Result:** 6/6 permission tests passed

## 1. Initial Findings

- All 14 tables were owned by `postgres`.
- The documented roles `app_admin_grp` and `app_runtime_grp` had no SELECT, INSERT, UPDATE, or DELETE permissions on PAWPAW's tables.
- `app_runtime_grp` was assigned to `catering_app`, a role used by Group 8's project.
- No matching CREATE ROLE, CREATE USER, GRANT, or REVOKE statements were found in the searched repository SQL files.

## 2. Review Implementation

Created separate PostgreSQL group roles:

- `pawpaw_admin_grp`
- `pawpaw_runtime_grp`
- `pawpaw_readonly_grp`

The roles were configured without LOGIN or SUPERUSER privileges.

## 3. Permission Test Results

| Test ID | Role | Operation | Expected | Actual | Status |
|---|---|---|---|---|---|
| T01 | pawpaw_readonly_grp | SELECT service | Allowed | Allowed (9 records) | PASS |
| T02 | pawpaw_readonly_grp | UPDATE service | Denied | Permission denied | PASS |
| T03 | pawpaw_runtime_grp | SELECT appointment | Allowed | Allowed (0 records) | PASS |
| T04 | pawpaw_runtime_grp | DELETE user_account | Denied | Permission denied | PASS |
| T05 | pawpaw_admin_grp | SELECT user_account | Allowed | Allowed (0 records) | PASS |
| T06 | pawpaw_admin_grp | DELETE audit_log | Denied | Permission denied | PASS |

## 4. Assessment

All six selected permission tests passed.

The review implementation demonstrates that PostgreSQL roles can restrict operations according to the proposed access-control policy.

**Limitations:** Testing used SET LOCAL ROLE through a PostgreSQL superuser connection. Dedicated LOGIN accounts, application integration, and all permitted write operations have not yet been tested. The proposed runtime role also has broad SELECT privileges, requiring further least-privilege review.

## 5. Recommendations

- Implement dedicated PostgreSQL roles for PAWPAW.
- Use a restricted database account for routine backend operations.
- Keep database administrator permissions separate from application permissions.
- Review access to sensitive medical, authentication, and audit data.
- Verify application functionality using a dedicated restricted LOGIN account.
