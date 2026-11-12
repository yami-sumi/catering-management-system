# Activity 4 — Group 1 Access-Control Plan

**Designer/Testing Group:** Group 8  
**Project Evaluated:** DropBoxed — Environmental Complaint Application  
**Database:** `dropboxed_db`  
**Schema:** `dropboxed`  
**DBMS:** PostgreSQL 18

## 1. Objective

Evaluate the existing PostgreSQL roles and privileges of Group 1's DropBoxed database and verify that database access is restricted according to assigned responsibilities.

## 2. Existing Database Roles

| Role | Type | Intended Responsibility |
|---|---|---|
| `dropboxed_dba_grp` | NOLOGIN | Database administration |
| `dropboxed_runtime_grp` | NOLOGIN | Application database operations |
| `dropboxed_readonly_grp` | NOLOGIN | Read-only reporting |
| `dropboxed_backup_grp` | NOLOGIN | Database backup operations |
| `dropboxed_dba` | LOGIN | DBA account |
| `dropboxed_app` | LOGIN | Application account |
| `dropboxed_report` | LOGIN | Reporting account |
| `dropboxed_backup` | LOGIN | Backup account |

These responsibilities are inferred from role names and must be compared with Group 1's documented access-control requirements.

## 3. Verified Permissions

The following results were observed for the `dropboxed.complaints` table.

| Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `dropboxed_report` | Allowed | Denied | Denied | Denied |
| `dropboxed_app` | Allowed | Allowed | Denied | Denied |

## 4. Permission Testing Results

| Test | Actual Result |
|---|---|
| Reporting role permission check | SELECT allowed; INSERT, UPDATE, DELETE restricted |
| Reporting role UPDATE attempt | Permission denied, SQLSTATE 42501 |
| Application role permission check | SELECT and INSERT allowed; UPDATE and DELETE restricted |
| Application role SELECT | Successful; complaint count returned |
| Application role DELETE attempt | Permission denied, SQLSTATE 42501 |

## 5. Initial Security Assessment

The tested reporting account has read-only access to the complaints table, consistent with its apparent reporting responsibility.

The application account can retrieve and insert complaint records but cannot update or delete them using its current privileges.

Additional verification is required to determine whether these permissions fully support Group 1's intended application workflow and whether other database objects follow least-privilege principles.

## 6. Conclusion

Group 8 verified existing PostgreSQL role memberships and selected access restrictions in Group 1's DropBoxed database.

The tested restrictions were enforced successfully. However, the complete access-control plan must also consider schema permissions, other tables, sequences, administrative operations, and Group 1's documented requirements.