# Group 2 — Activity 4 Testing Log

Environment: PostgreSQL 18, local copy of Group 2 project. Results supplied from CMD/psql during guided review, November 12, 2026.

| Check | Observed result | Status |
|---|---|---|
| Database setup | 10 tables reported | Observed |
| `event_owner` and `event_app` elevated attributes | Both LOGIN; neither SUPERUSER, CREATEDB, CREATEROLE | PASS |
| Nine application tables vs V3 privilege matrix | 9 PASS, 0 FAIL | PASS |
| `audit_log` app INSERT/UPDATE/DELETE | true/false/false | PASS |
| Schema USAGE / CREATE | true / false | PASS |
| Database CONNECT / CREATE | true / false | PASS |
| Sequence USAGE | 9 of 9 | PASS |
| `flyway_schema_history` app SELECT/INSERT/UPDATE/DELETE | false/false/false/false | PASS |

**Limitations:** Above results are catalog-based privilege checks supplied by the reviewer, not independently executed in this generated report. A login-as-`event_app` allowed/denied operation test, `event_owner` migration validation, and evidence screenshot remain recommended. No verified flaw has been established from these checks alone.

### Actual Account Verification — pgAdmin 4

Database: grp02_event_management_db
Account: event_app

Test 1: SELECT current_user;
Result: event_app
Status: PASS

Test 2: Check UPDATE privilege on audit_log
Result: false
Expected: false
Status: PASS

Conclusion:
The application account was verified directly
in pgAdmin. The audit_log UPDATE restriction
is correctly enforced at the privilege level.