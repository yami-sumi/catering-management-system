# Group 7 – Applicant Management System
## Database Access Control Testing Log

**Reviewer:** Group 8  
**Database:** `grp07_applicantdb`  
**DBMS:** PostgreSQL 18  
**Review Date:** November 13, 2026

### 1. Database Setup

- Created database `grp07_applicantdb`.
- Imported `db/01_schema.sql` successfully.
- Imported `db/02_seed.sql` successfully.
- Verified that the database contains 9 tables.

**Result:** PASSED

### 2. PostgreSQL Roles and Permissions

**Test:** Checked the documented database roles and actual table permissions.

**Results:**
- The intended application login roles (`ams_admin`, `ams_app_user`, `ams_viewer`) were not created during database setup.
- The existing `app_runtime_grp` and `app_readonly_grp` roles had no SELECT access to any of the 9 tables.
- All 9 tables were owned by `postgres`.

**Result:** FAILED — Documented access-control permissions were not implemented.

### 3. Database and Schema Privileges

**Test:** Inspected database and public schema access-control lists.

**Results:**
- Database uses PostgreSQL's default database privileges.
- `PUBLIC` has schema USAGE.
- `PUBLIC` does not have schema CREATE.

**Result:** No additional confirmed flaw.

### 4. Default Privileges

**Test:** Queried `pg_default_acl`.

**Result:** No custom default privileges configured.

**Assessment:** Supports the finding that the documented role-based access-control setup is incomplete.

### 5. Application Database Credentials

**Test:** Reviewed README configuration and user-role documentation.

**Results:**
- `README.md` line 83 recommends `DB_USER=postgres`.
- `docs/user-roles.md` identifies `ams_app_user` as the intended PHP application account.
- These instructions are inconsistent.

**Result:** FAILED — Insecure superuser configuration is recommended.

### 6. Credential Protection

**Test:** Inspected `.gitignore` and checked tracked files using `git ls-files .env`.

**Results:**
- `.env` is included in `.gitignore`.
- `.env` is not tracked by Git.

**Result:** PASSED

### 7. PHP Access-Control Review

**Test:** Reviewed PHP database connection, authentication, authorization, and request handling.

**Results:**
- Database connection uses environment variables and PDO.
- Prepared statements are used.
- Authentication and role authorization checks are present.
- Viewer actions are restricted by the application.
- POST requests include CSRF verification.
- Action handlers are outside the documented public web root.

**Result:** No additional confirmed flaw from static code review.

### Summary

| Category | Result |
|---|---|
| Database initialization | PASSED |
| PostgreSQL role implementation | FAILED |
| Database/schema privileges | REVIEWED |
| Default privileges | REVIEWED |
| Application database account | FAILED |
| `.env` protection | PASSED |
| PHP access-control review | PASSED (static review) |

**Total findings: 2**

1. Missing implementation of documented PostgreSQL roles and permissions.
2. README recommends connecting the PHP application using the PostgreSQL superuser.

**Note:** Findings are based on the reviewed setup scripts, documentation, and local test database. The actual deployment configuration was not verified.