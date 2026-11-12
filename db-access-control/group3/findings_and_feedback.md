# Group 3 — PAWPAW Access-Control Findings and Feedback

**Reviewer:** Group 8  
**Project:** PAWPAW Veterinary Appointment and Pet Management System  
**Database:** group3_Pawpaw  
**DBMS:** PostgreSQL 18.6

## Finding 1 — Documented Database Roles Lack Table Permissions

**Severity:** Medium — Implementation Gap

**Observation:** PAWPAW's application-role documentation proposes `app_admin_grp` and `app_runtime_grp`. During the initial database review, both roles had zero SELECT, INSERT, UPDATE, and DELETE privileges across all 14 PAWPAW tables.

**Impact:** If the application attempts to use these roles without additional privileges, required database operations may fail.

**Recommendation:** Implement and verify appropriate database privileges based on the application's required operations.

## Finding 2 — Database Superuser Used in Local Setup

**Severity:** High if used for routine application operations

**Observation:** The local database was created and managed using `postgres`. The application's connection configuration supports database credentials through environment variables. The original application's runtime database account was not independently verified.

**Impact:** Using a superuser for routine application queries would expose the database to unnecessary privileges.

**Recommendation:** Use a dedicated, restricted PostgreSQL LOGIN account for the backend and reserve `postgres` for administrative tasks.

## Finding 3 — Shared PostgreSQL Roles

**Severity:** Low — Local Environment Configuration

**Observation:** The existing `app_runtime_grp` role was assigned to `catering_app`, an account belonging to Group 8's project.

**Impact:** Modifying shared PostgreSQL roles could unintentionally affect another project.

**Recommendation:** Use project-specific database roles and avoid modifying roles used by unrelated databases.

## Group 8's Review Implementation

Group 8 created three separate roles:

- `pawpaw_admin_grp`
- `pawpaw_runtime_grp`
- `pawpaw_readonly_grp`

Permissions were applied to the local PAWPAW database.

**Verification:** All six selected allowed/denied permission tests passed.

## Limitations

The findings describe the reviewed local environment and available repository files. They do not establish the configuration of Group 3's original deployment.

The proposed access-control policy still requires testing with a dedicated LOGIN account and verification of application functionality.

## Feedback to Group 3

We recommend implementing the documented PostgreSQL access-control design, separating routine application permissions from database administration, and verifying that each role has only the privileges required for its responsibilities.

The review also recommends documenting the actual database account used by the backend and maintaining project-specific roles to prevent unintended access between systems.
