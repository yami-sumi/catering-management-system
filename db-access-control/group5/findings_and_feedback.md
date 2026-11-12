# Group 5 — SHIORI Cafe
## Access-Control Findings and Feedback

**Reviewer:** Group 8  
**Reviewed System:** SHIORI Cafe  
**Database:** `grp10_shioricafedb`  
**Schema:** `shioricafe_schema`

### Finding 1 — Incomplete Database Access-Control Implementation

**Severity:** Medium  
**Category:** Database Security / Access Control

**Description:**

The project documentation proposes dedicated PostgreSQL roles and login accounts. However, the local database does not contain the proposed SHIORI Cafe login accounts.

The existing `app_runtime_grp` and `app_readonly_grp` roles also lack access to the application's schema and tables.

**Evidence:**

- `shioricafe_app_login` was not found.
- `app_runtime_grp` failed a SELECT test.
- `app_readonly_grp` failed a SELECT test.
- Both tests returned `permission denied for schema shioricafe_schema`.

**Possible Impact:**

The application may be unable to access its database using the documented role configuration until the required accounts and privileges are implemented.

**Recommendation:**

Create the required database accounts, assign appropriate permissions, and test each role according to its intended responsibilities.

### Finding 2 — Database Port Configuration Mismatch

**Severity:** Low  
**Category:** Configuration

**Description:**

The PHP database configuration uses port `5173` as its fallback, while `.env.example` specifies PostgreSQL port `5432`.

**Possible Impact:**

If `DB_PORT` is missing, the application may attempt to connect using the wrong port.

**Recommendation:**

Use a consistent PostgreSQL port configuration and ensure that the fallback matches the intended database environment.

### Finding 3 — Migration Documentation Needs Clarification

**Severity:** Low  
**Category:** Documentation

**Description:**

The database organization document describes 11 proposed migration files, while the repository currently contains five numbered migrations.

Because the documentation identifies the larger structure as proposed, this is a clarity issue rather than a confirmed database error.

**Possible Impact:**

Developers or reviewers may be confused about which migration files are required for database setup.

**Recommendation:**

Clearly distinguish the proposed migration structure from the migrations currently implemented.

## Overall Feedback

SHIORI Cafe's five database migrations were successfully executed in the review environment.

However, the access-control setup described in the documentation could not be reproduced using the available migration scripts and existing local roles.

The main recommendation is to complete and document the PostgreSQL role setup, including the necessary grants and permission tests.

**Review Limitation:** These findings are based on the locally reproduced database and repository files examined. They do not establish the configuration of the project owners' original deployment.