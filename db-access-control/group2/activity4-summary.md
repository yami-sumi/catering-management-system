# Group 2 — Activity 4 Review Summary

**Project:** Eventer: A High School Event Management System (HSEMS)

**Status:** Database initialized; nine application-table permission checks passed; schema, database, sequence, and Flyway table privilege checks matched expectations.

**Strengths:** Separate migration owner and application runtime accounts; no elevated role attributes; append-only audit-log writes; runtime cannot access Flyway history table; no runtime schema/database CREATE.

**Documentation observation:** `docs/user_roles.md` describes proposed `app_admin_grp` / `app_runtime_grp` group roles and `public` schema, while the actual V3 migration grants privileges directly to `event_app` under `school_event_management_db`. Recommend updating the roles documentation to distinguish application roles from implemented PostgreSQL accounts and privilege grants. This is a documentation alignment observation, not yet a proven security defect.

**Pending:** Test actual allow/deny operations as `event_app`; capture concise screenshot evidence; decide whether any SQL change is warranted; record feedback status accurately; upload to Group 8 repository; update tracker and PDF.

**Feedback to owner:** Not sent. This report contains proposed feedback.
