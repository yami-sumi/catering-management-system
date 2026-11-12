# Group 7 – Applicant Management System
## Database Access Control Findings and Feedback

**Reviewer:** Group 8  
**Database:** `grp07_applicantdb`  
**Review Date:** November 13, 2026

### Finding 1: Documented Database Roles and Permissions Are Not Implemented

**Severity:** Medium  
**Category:** Access Control / Configuration

**Description:**

The system documentation defines PostgreSQL roles for administrators, application users, and read-only users. However, the database setup scripts do not create the required login accounts or apply the documented permissions.

**Evidence:**
- The login roles `ams_admin`, `ams_app_user`, and `ams_viewer` were not created during database setup.
- `app_runtime_grp` had no SELECT permission on any of the 9 tables.
- `app_readonly_grp` had no SELECT permission on any of the 9 tables.
- No custom default privileges were configured.

**Impact:**

The intended database accounts cannot perform their documented operations. The application may require a more privileged account to function, weakening the intended access-control design.

**Recommendation:**

Add an executable SQL setup script that creates the required roles, grants appropriate permissions, and configures the intended application database account. Include this script in the installation instructions.

---

### Finding 2: README Recommends Using the PostgreSQL Superuser

**Severity:** High  
**Category:** Excessive Privileges / Insecure Configuration

**Description:**

The README instructs users to configure the PHP application using `DB_USER=postgres`, while the access-control documentation identifies `ams_app_user` as the intended application account.

**Evidence:**
- `README.md`, line 83: `DB_USER=postgres`
- `docs/user-roles.md`, line 81: `ams_app_user` is identified as the PHP backend account.
- The required restricted login account is not created by the database setup scripts.

**Impact:**

If the application uses the PostgreSQL superuser, it receives unnecessary privileges. A compromised application connection could potentially access or modify data and database objects beyond its intended responsibilities.

**Recommendation:**

Update the README to use `ams_app_user` instead of `postgres`. Ensure the restricted account is created and granted only the permissions required by the PHP application.

**Verification limitation:** The README configuration was confirmed, but the credentials used in the actual deployment were not verified.

---

## Positive Observations

- Database schema and seed scripts imported successfully.
- PHP database configuration uses environment variables.
- Prepared statements and application-level authorization checks are present.
- Viewer actions are restricted in the reviewed application code.
- CSRF verification is implemented for POST requests.
- `.env` is ignored by Git and is not tracked.
- PostgreSQL's public schema does not grant CREATE permission to `PUBLIC`.

## Overall Feedback

Group 7 has documented an appropriate role-based database access-control design and implemented several application-level security measures. However, its database initialization does not apply the documented permissions, and the README recommends a highly privileged database account.

**Priority:** Implement the PostgreSQL role setup and replace the superuser configuration with a restricted application account.

**Total Findings: 2**