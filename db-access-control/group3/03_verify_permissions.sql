
-- Group 8 Review: PAWPAW Permission Verification
-- Read-only checks; no database modifications.

SELECT
    r.rolname AS role_name,
    r.rolcanlogin AS can_login,
    r.rolsuper AS is_superuser,
    has_database_privilege(
        r.oid, current_database(), 'CONNECT'
    ) AS can_connect,
    has_schema_privilege(
        r.oid, 'public', 'USAGE'
    ) AS schema_usage
FROM pg_roles r
WHERE r.rolname IN (
    'pawpaw_admin_grp',
    'pawpaw_runtime_grp',
    'pawpaw_readonly_grp'
)
ORDER BY r.rolname;

SELECT
    r.rolname AS role_name,
    COUNT(*) FILTER (
        WHERE has_table_privilege(r.oid, t.oid, 'SELECT')
    ) AS select_tables,
    COUNT(*) FILTER (
        WHERE has_table_privilege(r.oid, t.oid, 'INSERT')
    ) AS insert_tables,
    COUNT(*) FILTER (
        WHERE has_table_privilege(r.oid, t.oid, 'UPDATE')
    ) AS update_tables,
    COUNT(*) FILTER (
        WHERE has_table_privilege(r.oid, t.oid, 'DELETE')
    ) AS delete_tables
FROM pg_roles r
CROSS JOIN pg_class t
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE r.rolname IN (
    'pawpaw_admin_grp',
    'pawpaw_runtime_grp',
    'pawpaw_readonly_grp'
)
AND n.nspname = 'public'
AND t.relkind = 'r'
GROUP BY r.rolname
ORDER BY r.rolname;
