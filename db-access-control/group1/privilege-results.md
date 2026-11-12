Database: dropboxed_db. Run at 2026-11-12T12:39:36.152Z.

| # | Account | Statement or operation | Expected | Actual | Result | Server response |
|---|---|---|---|---|---|---|
| 1 | dropboxed_app | `SELECT complaint_id, status FROM complaints LIMIT 1` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 2 | dropboxed_app | `SELECT password_hash FROM users LIMIT 1` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 3 | dropboxed_app | `INSERT INTO complaint_categories (category_name) VALUES ('verify-test') RETURNING category_id` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 4 | dropboxed_app | `UPDATE complaints SET status = 'Pending', resolved_at = NULL WHERE FALSE` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 5 | dropboxed_app | `SELECT complaint_id FROM complaints LIMIT 1 FOR UPDATE` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 6 | dropboxed_app | `DELETE FROM complaint_assignments WHERE FALSE` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 7 | dropboxed_app | `DELETE FROM complaint_categories WHERE FALSE` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 8 | dropboxed_app | `DELETE FROM complaints WHERE FALSE` | Denied | Denied | PASS | permission denied for table complaints |
| 9 | dropboxed_app | `DELETE FROM users WHERE FALSE` | Denied | Denied | PASS | permission denied for table users |
| 10 | dropboxed_app | `DELETE FROM attachments WHERE FALSE` | Denied | Denied | PASS | permission denied for table attachments |
| 11 | dropboxed_app | `UPDATE status_logs SET remarks = 'x' WHERE FALSE` | Denied | Denied | PASS | permission denied for table status_logs |
| 12 | dropboxed_app | `DELETE FROM status_logs WHERE FALSE` | Denied | Denied | PASS | permission denied for table status_logs |
| 13 | dropboxed_app | `UPDATE users SET email = 'x@example.com' WHERE FALSE` | Denied | Denied | PASS | permission denied for table users |
| 14 | dropboxed_app | `UPDATE complaints SET submitted_at = NOW() WHERE FALSE` | Denied | Denied | PASS | permission denied for table complaints |
| 15 | dropboxed_app | `TRUNCATE status_logs` | Denied | Denied | PASS | permission denied for table status_logs |
| 16 | dropboxed_app | `DROP TABLE status_logs` | Denied | Denied | PASS | must be owner of table status_logs |
| 17 | dropboxed_app | `CREATE TABLE dropboxed.verify_test (id INTEGER)` | Denied | Denied | PASS | permission denied for schema dropboxed |
| 18 | dropboxed_app | `CREATE TABLE public.verify_test (id INTEGER)` | Denied | Denied | PASS | permission denied for schema public |
| 19 | dropboxed_app | `SELECT nextval('dropboxed.complaint_categories_category_id_seq')` | Denied | Denied | PASS | permission denied for sequence complaint_categories_category_id_seq |
| 20 | dropboxed_app | `CREATE DATABASE verify_new_db` | Denied | Denied | PASS | permission denied to create database |
| 21 | dropboxed_app | `CREATE ROLE verify_new_role` | Denied | Denied | PASS | permission denied to create role |
| 22 | dropboxed_app | `Connect to database dropboxed_verify_unrelated` | Denied | Denied | PASS | permission denied for database "dropboxed_verify_unrelated" |
| 23 | dropboxed_report | `SELECT status, COUNT(*) FROM complaints GROUP BY status` | Allowed | Allowed | PASS | ok (3 rows, rolled back) |
| 24 | dropboxed_report | `SELECT user_id, full_name FROM users LIMIT 1` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 25 | dropboxed_report | `SELECT password_hash FROM users LIMIT 1` | Denied | Denied | PASS | permission denied for table users |
| 26 | dropboxed_report | `SELECT email FROM users LIMIT 1` | Denied | Denied | PASS | permission denied for table users |
| 27 | dropboxed_report | `SELECT * FROM staff LIMIT 1` | Denied | Denied | PASS | permission denied for table staff |
| 28 | dropboxed_report | `UPDATE complaints SET status = 'Resolved' WHERE FALSE` | Denied | Denied | PASS | permission denied for table complaints |
| 29 | dropboxed_report | `INSERT INTO complaint_categories (category_name) VALUES ('verify-test') RETURNING category_id` | Denied | Denied | PASS | permission denied for table complaint_categories |
| 30 | dropboxed_report | `DELETE FROM complaint_assignments WHERE FALSE` | Denied | Denied | PASS | permission denied for table complaint_assignments |
| 31 | dropboxed_report | `ANALYZE complaints` | Denied | Denied | PASS | permission denied to analyze "complaints", skipping it |
| 32 | dropboxed_report | `CREATE DATABASE verify_new_db` | Denied | Denied | PASS | permission denied to create database |
| 33 | dropboxed_backup | `SELECT password_hash FROM staff LIMIT 1` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 34 | dropboxed_backup | `SELECT last_value FROM dropboxed.complaints_complaint_id_seq` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 35 | dropboxed_backup | `LOCK TABLE complaints IN ACCESS SHARE MODE` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 36 | dropboxed_backup | `UPDATE complaints SET status = 'Resolved' WHERE FALSE` | Denied | Denied | PASS | permission denied for table complaints |
| 37 | dropboxed_backup | `DELETE FROM attachments WHERE FALSE` | Denied | Denied | PASS | permission denied for table attachments |
| 38 | dropboxed_backup | `CREATE ROLE verify_new_role` | Denied | Denied | PASS | permission denied to create role |
| 39 | dropboxed_dba | `SELECT COUNT(*) FROM complaints` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 40 | dropboxed_dba | `UPDATE complaints SET flag_reason = NULL WHERE FALSE` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 41 | dropboxed_dba | `ANALYZE complaints` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 42 | dropboxed_dba | `VACUUM complaints` | Allowed | Allowed | PASS | ok (0 rows, rolled back) |
| 43 | dropboxed_dba | `SELECT query FROM pg_stat_activity LIMIT 1` | Allowed | Allowed | PASS | ok (1 rows, rolled back) |
| 44 | dropboxed_dba | `DROP TABLE status_logs` | Denied | Denied | PASS | must be owner of table status_logs |
| 45 | dropboxed_dba | `TRUNCATE status_logs` | Denied | Denied | PASS | permission denied for table status_logs |
| 46 | dropboxed_dba | `CREATE DATABASE verify_new_db` | Denied | Denied | PASS | permission denied to create database |
| 47 | dropboxed_dba | `CREATE ROLE verify_new_role` | Denied | Denied | PASS | permission denied to create role |
| 48 | dropboxed_verify_outsider | `Connect to database dropboxed_db` | Denied | Denied | PASS | permission denied for database "dropboxed_db" |

| Role | Can log in | Superuser | Create DB | Create role | Replication | Bypass RLS | Member of |
|---|---|---|---|---|---|---|---|
| dropboxed_app | true | false | false | false | false | false | dropboxed_runtime_grp |
| dropboxed_backup | true | false | false | false | false | false | dropboxed_backup_grp |
| dropboxed_backup_grp | false | false | false | false | false | false |  |
| dropboxed_dba | true | false | false | false | false | false | dropboxed_dba_grp |
| dropboxed_dba_grp | false | false | false | false | false | false | pg_monitor |
| dropboxed_readonly_grp | false | false | false | false | false | false |  |
| dropboxed_report | true | false | false | false | false | false | dropboxed_readonly_grp |
| dropboxed_runtime_grp | false | false | false | false | false | false |  |

48 tests, 0 unexpected results. 0 roles with elevated attributes.
