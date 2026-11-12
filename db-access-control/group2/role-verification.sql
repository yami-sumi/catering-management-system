-- Group 2 Activity 4 read-only privilege verification.
-- Run: psql -U postgres -h localhost -d grp02_event_management_db -P pager=off -f role-verification.sql
SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole
FROM pg_roles WHERE rolname IN ('event_owner','event_app') ORDER BY rolname;

WITH expected(table_name,s,i,u,d) AS (
 VALUES ('role',true,false,false,false),('user_account',true,true,true,false),
 ('venue',true,true,true,true),('participant',true,true,true,true),
 ('event',true,true,true,true),('event_schedule',true,true,true,true),
 ('event_assignment',true,true,true,true),('attendance',true,true,true,true),
 ('audit_log',true,true,false,false)
)
SELECT e.table_name,
 CASE WHEN has_table_privilege('event_app',format('%I.%I','school_event_management_db',e.table_name),'SELECT')=e.s
 AND has_table_privilege('event_app',format('%I.%I','school_event_management_db',e.table_name),'INSERT')=e.i
 AND has_table_privilege('event_app',format('%I.%I','school_event_management_db',e.table_name),'UPDATE')=e.u
 AND has_table_privilege('event_app',format('%I.%I','school_event_management_db',e.table_name),'DELETE')=e.d
 THEN 'PASS' ELSE 'FAIL' END AS result
FROM expected e ORDER BY e.table_name;

SELECT has_schema_privilege('event_app','school_event_management_db','USAGE') AS schema_usage,
 has_schema_privilege('event_app','school_event_management_db','CREATE') AS schema_create,
 has_database_privilege('event_app','grp02_event_management_db','CONNECT') AS db_connect,
 has_database_privilege('event_app','grp02_event_management_db','CREATE') AS db_create,
 (SELECT count(*) FROM pg_sequences WHERE schemaname='school_event_management_db'
 AND has_sequence_privilege('event_app',format('%I.%I',schemaname,sequencename),'USAGE')) AS usable_sequences,
 (SELECT count(*) FROM pg_sequences WHERE schemaname='school_event_management_db') AS total_sequences;

SELECT table_name,
 has_table_privilege('event_app',format('%I.%I',table_schema,table_name),'SELECT') AS can_select,
 has_table_privilege('event_app',format('%I.%I',table_schema,table_name),'INSERT') AS can_insert,
 has_table_privilege('event_app',format('%I.%I',table_schema,table_name),'UPDATE') AS can_update,
 has_table_privilege('event_app',format('%I.%I',table_schema,table_name),'DELETE') AS can_delete
FROM information_schema.tables WHERE table_schema='school_event_management_db'
AND table_name='flyway_schema_history';
