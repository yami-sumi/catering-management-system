
-- ACTIVITY 4: GROUP 1 - DROPBOXED
-- Testing Group: Group 8
-- Database: dropboxed_db
-- Schema: dropboxed
-- Purpose: Verify existing PostgreSQL roles and permissions

-- TEST 1: Existing database roles
SELECT rolname, rolcanlogin, rolsuper, rolcreaterole
FROM pg_roles
WHERE rolname LIKE 'dropboxed_%'
ORDER BY rolname;

-- TEST 2: Role memberships
SELECT
    r.rolname AS role_name,
    m.rolname AS member_name
FROM pg_auth_members am
JOIN pg_roles r ON r.oid = am.roleid
JOIN pg_roles m ON m.oid = am.member
WHERE r.rolname LIKE 'dropboxed_%'
ORDER BY r.rolname;

-- TEST 3: Reporting role permissions
SELECT
    has_table_privilege(
        'dropboxed_report', 'dropboxed.complaints', 'SELECT'
    ) AS can_select,
    has_table_privilege(
        'dropboxed_report', 'dropboxed.complaints', 'INSERT'
    ) AS can_insert,
    has_table_privilege(
        'dropboxed_report', 'dropboxed.complaints', 'UPDATE'
    ) AS can_update,
    has_table_privilege(
        'dropboxed_report', 'dropboxed.complaints', 'DELETE'
    ) AS can_delete;

-- TEST 4: Application role permissions
SELECT
    has_table_privilege(
        'dropboxed_app', 'dropboxed.complaints', 'SELECT'
    ) AS can_select,
    has_table_privilege(
        'dropboxed_app', 'dropboxed.complaints', 'INSERT'
    ) AS can_insert,
    has_table_privilege(
        'dropboxed_app', 'dropboxed.complaints', 'UPDATE'
    ) AS can_update,
    has_table_privilege(
        'dropboxed_app', 'dropboxed.complaints', 'DELETE'
    ) AS can_delete;

-- TEST 5: Allowed SELECT
-- Execute this block separately.
BEGIN;
SET LOCAL ROLE dropboxed_app;

SELECT current_user AS active_role,
       COUNT(*) AS total_complaints
FROM dropboxed.complaints;

ROLLBACK;

-- TEST 6: Denied UPDATE
-- Execute separately. Expected SQLSTATE: 42501
BEGIN;
SET LOCAL ROLE dropboxed_report;

UPDATE dropboxed.complaints
SET status = status
WHERE FALSE;

-- Run ROLLBACK separately after the expected error.

-- TEST 7: Denied DELETE
-- Execute separately after rolling back TEST 6.
-- Expected SQLSTATE: 42501
BEGIN;
SET LOCAL ROLE dropboxed_app;

DELETE FROM dropboxed.complaints
WHERE FALSE;

-- Run ROLLBACK separately after the expected error.
