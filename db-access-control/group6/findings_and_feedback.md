# Group 6 — Access Control Findings and Feedback

**Project:** Car Rental Management System  
**Database:** car_rental_db  
**Reviewer:** Group 8

## Finding 1: Incorrect SQL Constraint Order

**Severity:** Medium  
**Category:** Database Setup / Schema Integrity

**Description:**  
The original `schema.sql` failed during a fresh database import because the `payment_received_by_fkey` foreign key referenced `staff(staff_id)` before the `staff` table's primary key was created.

**Impact:**  
The database cannot be initialized successfully using the original schema script without manual intervention. This may delay deployment and leave the database partially configured.

**Recommendation:**  
Create the primary key on `staff.staff_id` before defining foreign keys that reference it. Test the complete schema script on a fresh database.

## Finding 2: Broad Default Privileges on Future Tables

**Severity:** Low  
**Category:** Access Control / Least Privilege

**Description:**  
The database grants default privileges to application roles for future tables created by the configured owner in the `public` schema.

A transactional test confirmed that a newly created table automatically allowed:

- `app_runtime_grp` — UPDATE
- `app_readonly_grp` — SELECT

**Impact:**  
Newly created tables containing sensitive information could inherit permissions that are broader than intended unless their privileges are explicitly restricted.

**Recommendation:**  
Review default privileges and apply table-specific restrictions to sensitive tables. Include privilege verification when adding new database tables.

## Finding 3: Broad Runtime UPDATE Permissions on Sensitive Columns

**Severity:** Low  
**Category:** Security Hardening / Least Privilege

**Description:**  
The `app_runtime_grp` database role has UPDATE permission on:

- `staff.role`
- `staff.password_hash`
- `customer.password_hash`

The application uses backend authorization checks to control user actions, but the database runtime role itself is not restricted from updating these columns.

**Impact:**  
If the application or runtime database credentials are compromised, sensitive account information could be modified.

This is a defense-in-depth concern, not a demonstrated authorization bypass.

**Recommendation:**  
Consider restricting sensitive column updates through dedicated database roles, controlled functions, or other appropriately secured database operations.

## Positive Findings

The following access-control protections were successfully verified:

- Runtime UPDATE and DELETE operations on `audit_log` were denied.
- Read-only access to staff and customer password hashes was denied.
- Read-only access to approved columns was permitted.
- Runtime DELETE privileges were limited to the intended table.
- Runtime, read-only, and admin group roles could not create tables in the `public` schema.
- Spring Security restricts staff-management endpoints to authorized roles.
- System Admin access restrictions were consistent with the documented technical-administration role.

## Overall Feedback

Group 6 implemented several effective access-control restrictions, particularly for audit logs, read-only access, and application-level role management.

The main issue is the schema initialization failure, which should be corrected to support reliable deployment. The remaining findings are preventive recommendations to strengthen least-privilege access.

**Overall Assessment:** Access-control testing largely passed, with one confirmed database setup flaw and two security-hardening concerns.