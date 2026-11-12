# Group 2 — Activity 4 Access-Control Plan

Project: Eventer — High School Event Management System (HSEMS)
Database: `grp02_event_management_db`; schema: `school_event_management_db`.

## Existing implementation
- `event_owner` (LOGIN): schema owner; Flyway migrations; no SUPERUSER/CREATEDB/CREATEROLE.
- `event_app` (LOGIN): application runtime; no SUPERUSER/CREATEDB/CREATEROLE; database CONNECT and schema USAGE, but no database/schema CREATE.
- `role`: SELECT only.
- `user_account`: SELECT, INSERT, UPDATE; no DELETE.
- `venue`, `participant`, `event`, `event_schedule`, `event_assignment`, `attendance`: SELECT, INSERT, UPDATE, DELETE.
- `audit_log`: SELECT, INSERT; no UPDATE/DELETE.
- `flyway_schema_history`: no SELECT/INSERT/UPDATE/DELETE for `event_app`.
- Sequences: USAGE for `event_app` (9 of 9 observed).

## Documentation comparison / follow-up
`docs/user_roles.md` proposes separate `app_admin_grp` and `app_runtime_grp` group roles and a schema `public` privilege plan, whereas the implemented Flyway migration grants directly to `event_app` in `school_event_management_db`. Confirm whether the document is a proposal or intended current-state specification before labeling this a defect. The Spring Boot application enforces its user-level RBAC; PostgreSQL currently sees the shared runtime login.

## Change policy
Do not run SQL from other projects' `db-access-control/group-08` directory. Preserve existing migration-based privileges. Only apply reviewed changes after verifying application requirements and ownership.
