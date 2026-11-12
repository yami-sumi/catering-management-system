# Group 5 — SHIORI Cafe Access-Control Testing Log

**Reviewer:** Group 8  
**Reviewed Project:** Group 5 — SHIORI Cafe  
**Database:** `grp10_shioricafedb`  
**Schema:** `shioricafe_schema`  
**DBMS Used for Testing:** PostgreSQL 18

## 1. Database Setup

The following database migrations were executed successfully:

1. `001_core_schema.sql`
2. `002_order_tables.sql`
3. `003_order_discount_tables.sql`
4. `004_financial_tables.sql`
5. `005_triggers_and_views.sql`

All five migrations completed without reported SQL errors.

## 2. Database Role Verification

The project's documentation proposes the following PostgreSQL roles:

- `app_runtime_grp`
- `app_readonly_grp`
- `app_migration_grp`
- `shioricafe_app_login`
- `shioricafe_readonly_login`
- `shioricafe_migration_login`

### Actual Local Results

| Role | Exists | Login Permission |
|---|---|---|
| `app_runtime_grp` | Yes | NOLOGIN |
| `app_readonly_grp` | Yes | NOLOGIN |
| `app_migration_grp` | No | — |
| `shioricafe_app_login` | No | — |
| `shioricafe_readonly_login` | No | — |
| `shioricafe_migration_login` | No | — |

The two existing group roles were also used during previous project reviews. Their existence does not establish that SHIORI Cafe created them.

## 3. Database Permission Verification

| Permission | app_runtime_grp | app_readonly_grp |
|---|---|---|
| CONNECT to database | Allowed | Allowed |
| USAGE on application schema | Denied | Denied |
| SELECT on tables | 0 tables | 0 tables |
| INSERT on tables | 0 tables | 0 tables |
| UPDATE on tables | 0 tables | 0 tables |
| DELETE on tables | 0 tables | 0 tables |

## 4. SQL Permission Tests

### Test T01 — Runtime Role SELECT

**Role:** `app_runtime_grp`

**SQL:**

```sql
BEGIN;
SET LOCAL ROLE app_runtime_grp;
SELECT COUNT(*) FROM shioricafe_schema.customers;
ROLLBACK;
```

**Actual Result:**

```text
BEGIN
SET
ERROR: permission denied for schema shioricafe_schema
```

**Status:** Passed — Expected denial confirmed.

### Test T02 — Read-Only Role SELECT

**Role:** `app_readonly_grp`

**SQL:**

```sql
BEGIN;
SET LOCAL ROLE app_readonly_grp;
SELECT COUNT(*) FROM shioricafe_schema.customers;
ROLLBACK;
```

**Actual Result:**

```text
BEGIN
SET
ERROR: permission denied for schema shioricafe_schema
```

**Status:** Passed — Expected denial confirmed.

**Testing Summary:** 2/2 permission-denial tests produced the expected results.

## 5. Findings

### Finding 1 — Incomplete Database Access-Control Implementation

**Severity:** Medium

The documentation proposes PostgreSQL roles and login accounts, but the local database does not have the required SHIORI-specific login accounts.

The existing shared roles have no privileges on the application schema or tables.

The repository SQL files searched did not contain role-creation or privilege-granting statements.

**Impact:** The documented runtime account cannot be used until the required database access-control setup is completed.

### Finding 2 — Incorrect Default Database Port

**Severity:** Low

The PHP connection file defaults to port `5173`, while `.env.example` specifies PostgreSQL port `5432`.

**Impact:** A missing `DB_PORT` setting could cause a database connection failure.

### Finding 3 — Migration Documentation Inconsistency

**Severity:** Low — Documentation

`DATABASE_ORGANIZATION.md` describes a proposed migration structure containing 11 files, while the actual repository contains five numbered migrations.

The document identifies its structure as proposed, so this is a documentation clarity concern rather than a confirmed database defect.

## 6. Recommendations

- Implement the proposed PostgreSQL roles and dedicated login accounts.
- Assign only the privileges required for application operations.
- Verify runtime and read-only permissions using actual database login accounts.
- Change the PHP fallback database port to `5432`, unless a different port is intentionally configured.
- Update database documentation to distinguish proposed migration files from implemented files.

## 7. Testing Limitations

- Results describe the locally reproduced database, not the owners' original deployment.
- The database was created using PostgreSQL 18, while the project's intended environment may differ.
- Tests used `SET LOCAL ROLE` rather than direct login accounts.
- PHP application functionality was not tested.
- No original project permissions were modified.

**Overall Result:** One confirmed local access-control implementation gap, one confirmed configuration inconsistency, and one documentation improvement identified.