
-- ACTIVITY 4: GROUP 1 - DROPBOXED
-- Testing Group: Group 8
-- Database: dropboxed_db
-- Purpose: Proposed access-control changes
--
-- REVIEW ONLY: Do not execute without confirming
-- the application's required database operations.

-- FINDING AC-F01
-- The runtime group has no direct table-level
-- UPDATE grants.
--
-- Example proposed grant, ONLY if the application
-- needs to update complaint statuses:
--
-- GRANT UPDATE (status)
-- ON TABLE dropboxed.complaints
-- TO dropboxed_runtime_grp;

-- FINDING AC-F02
-- The runtime group has DELETE privileges on
-- complaint_assignments and complaint_categories.
--
-- Example proposed revocations, ONLY if these
-- operations are not required:
--
-- REVOKE DELETE
-- ON TABLE dropboxed.complaint_assignments
-- FROM dropboxed_runtime_grp;
--
-- REVOKE DELETE
-- ON TABLE dropboxed.complaint_categories
-- FROM dropboxed_runtime_grp;

-- VERIFICATION: Existing effective privileges
SELECT
    table_name,
    has_table_privilege(
        'dropboxed_app',
        'dropboxed.' || table_name,
        'SELECT'
    ) AS can_select,
    has_table_privilege(
        'dropboxed_app',
        'dropboxed.' || table_name,
        'INSERT'
    ) AS can_insert,
    has_table_privilege(
        'dropboxed_app',
        'dropboxed.' || table_name,
        'UPDATE'
    ) AS can_update,
    has_table_privilege(
        'dropboxed_app',
        'dropboxed.' || table_name,
        'DELETE'
    ) AS can_delete
FROM information_schema.tables
WHERE table_schema = 'dropboxed'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
