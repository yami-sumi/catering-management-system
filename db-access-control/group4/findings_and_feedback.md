# Group 4 — Access-Control Findings and Feedback

**Reviewer:** Group 8  
**Reviewed Project:** HealthBridge Clinic Management System  
**Database:** `grp03_projectdb`  
**DBMS Tested:** PostgreSQL 18

## Finding 1 — Excessive Permissions on Backup Records

**Severity:** Medium

**Affected table:** `deleted_records`  
**Affected role:** `hb_app`

**Observation:**

The application database account can SELECT, INSERT, UPDATE, and DELETE records in the backup table.

However, the project's documentation identifies backup viewing, restoration, and permanent deletion as administrator-only application functions.

**Test Evidence:**
- DELETE operation: `DELETE 0` — Allowed
- UPDATE operation: `UPDATE 0` — Allowed

**Possible Impact:**

Unauthorized SQL execution using the application account could potentially modify or permanently delete backup records.

**Recommendation:**

Restrict backup-management privileges and separate administrative operations from regular application operations.

## Finding 2 — Excessive Permissions on Staff Accounts

**Severity:** High potential impact

**Affected table:** `staff_users`  
**Affected role:** `hb_app`

**Observation:**

The application account has UPDATE permission on sensitive columns, including `role` and `password_hash`.

**Test Evidence:**
- UPDATE `role`: `UPDATE 0` — Allowed
- UPDATE `password_hash`: `UPDATE 0` — Allowed

**Possible Impact:**

Unauthorized SQL execution could potentially allow modification of staff privileges or password hashes.

**Recommendation:**

Limit UPDATE permissions on sensitive columns and use restricted database functions where appropriate.

## Overall Assessment

Group 4's reviewed project has an existing PostgreSQL access-control implementation with separate roles and a dedicated application login.

However, two database-level access-control concerns were identified.

**Testing Results:** 4/4 selected permission tests passed.

No actual database records were modified.

## Feedback and Recommendations

Group 4 should review the permissions inherited by `hb_app`, particularly access to backup records and staff account information.

Applying the principle of least privilege would help reduce the impact of unauthorized database access.

The findings concern database permissions and do not prove that ordinary application users can bypass PHP authorization.

**Review Status:** Findings documented; feedback not yet sent.