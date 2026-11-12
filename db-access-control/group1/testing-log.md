# Activity 4 — Group 1 Access-Control Testing Log

**Testing Group:** Group 8  
**System:** DropBoxed — Environmental Complaint Application  
**Database:** `dropboxed_db`  
**Schema:** `dropboxed`  
**DBMS:** PostgreSQL 18

## Test Results

| Test ID | Test Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| AC-01 | Inspect existing table privileges | Display granted privileges | Privilege records displayed | PASS |
| AC-02 | Inspect role memberships | Display role assignments | Four role memberships confirmed | PASS |
| AC-03 | Check reporting role permissions | SELECT allowed; writes denied | TRUE, FALSE, FALSE, FALSE | PASS |
| AC-04 | Attempt UPDATE using reporting role | Permission denied | SQLSTATE 42501 | PASS |
| AC-05 | Check application role permissions | Display effective privileges | TRUE, TRUE, FALSE, FALSE | PASS |
| AC-06 | Execute SELECT using application role | Query succeeds | 63 complaint records counted | PASS |
| AC-07 | Attempt DELETE using application role | Permission denied | SQLSTATE 42501 | PASS |

## Observations

The reporting account was restricted to SELECT access on the tested complaints table.

The application account had SELECT and INSERT privileges but lacked UPDATE and DELETE privileges on the same table.

PostgreSQL enforced the tested restrictions successfully. These results do not establish whether all database objects have appropriate permissions.

## Evidence

Screenshots `01` through `07` are stored in the `screenshots/` folder.

## Conclusion

All seven recorded verification tests passed. Further review of the application's required database operations is needed before concluding that the complete access-control configuration satisfies least-privilege requirements.

## Additional Access-Control Findings

**Finding AC-F01: Application role lacks direct table-level UPDATE privileges**

The `dropboxed_runtime_grp` role has no direct table-level UPDATE privileges shown in the privilege inspection.

This may affect application features that require updating existing records, such as complaint status changes. Further verification is needed to determine whether the application uses another authorized mechanism.

**Finding AC-F02: Application role has DELETE privileges on selected tables**

The `dropboxed_runtime_grp` role has DELETE privileges on `complaint_assignments` and `complaint_categories`.

These permissions should be reviewed against the application's intended functionality to determine whether they are necessary.

**Assessment:** Both findings require further verification. They are not yet confirmed security flaws.

### Finding AC-F03: Cross-Database CONNECT Access Through PUBLIC

**Affected account:** `dropboxed_app`

**Observation:** The application account has CONNECT privileges on seven unrelated databases, including Group 8's catering databases.

**Cause:** These databases grant CONNECT to PUBLIC, allowing all PostgreSQL roles to inherit the privilege.

**Security concern:** This creates broader database connection access than the application requires. CONNECT alone does not provide permission to read or modify tables.

**Recommendation:** Review PUBLIC CONNECT privileges on unrelated application databases and replace unnecessary broad access with explicit grants to authorized roles.

**Status:** Confirmed configuration concern; remediation pending.

**Evidence:** `20-cross-database-connect.png` and `21-public-cross-database-access.png`.


## Additional Permission Test

### AC-08: GRANT and REVOKE Verification

**Database:** dropboxed_db  
**Role:** dropboxed_ac4_verify (temporary test role)

**Objective:** Verify that PostgreSQL correctly applies GRANT and REVOKE commands.

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| GRANT SELECT | TRUE | TRUE | Pending |
| REVOKE SELECT | FALSE | FALSE | Pending |

**Evidence:** 23-grant-revoke-verification.png (if captured)

**Note:** The test uses a temporary role. The changes are reversed using ROLLBACK to avoid modifying the existing application permissions.


### AC-09: Application INSERT Test

- Role: dropboxed_app
- Table: dropboxed.complaints
- Expected: INSERT operation permitted
- Actual: SQLSTATE 428C9 (identity column restriction)
- Status: NOT VERIFIED
- Action: ROLLBACK executed successfully
- Note: The error was caused by the test query
  attempting to insert into a GENERATED ALWAYS
  identity column. It does not establish a
  privilege failure.


### AC-10: DBA and Backup Role Verification

Database: dropboxed_db
Table: dropboxed.complaints

| Permission | Backup Role | DBA Role |
|---|---|---|
| CONNECT | TRUE | TRUE |
| Schema USAGE | TRUE | TRUE |
| Schema CREATE | FALSE | FALSE |
| SELECT | TRUE | TRUE |
| INSERT | FALSE | TRUE |
| UPDATE | FALSE | TRUE |
| DELETE | FALSE | TRUE |

Status: PASS - Privilege inspection completed.

Observation:
The backup role has read-only access to complaints.
The DBA role has SELECT, INSERT, UPDATE, and DELETE
permissions but does not have schema CREATE permission.

Further review:
Compare these privileges with the documented role
responsibilities before confirming least-privilege compliance.

Evidence: screenshots/24-dba-backup-permissions.png


### AC-11: DBA and Backup Permissions on All Tables

Database: dropboxed_db
Schema: dropboxed
Tables inspected: 8

| Operation | Backup Role | DBA Role |
|---|---|---|
| SELECT | TRUE (8/8) | TRUE (8/8) |
| INSERT | FALSE (8/8) | TRUE (8/8) |
| UPDATE | FALSE (8/8) | TRUE (8/8) |
| DELETE | FALSE (8/8) | TRUE (8/8) |

Status: PASS - Privilege inspection completed.

Observation:
The backup role has read-only access to all 8 tables.
The DBA role has full SELECT, INSERT, UPDATE, and DELETE
permissions on all 8 tables.

No obvious table-level privilege issue was identified.
Final least-privilege assessment requires comparison
with the documented responsibilities of each role.

Evidence: screenshots/25-dba-backup-all-tables.png


### AC-12: Users Table Permission Verification

Database: dropboxed_db
Table: dropboxed.users

| Permission | Application Role | Reporting Role |
|---|---|---|
| SELECT | TRUE | FALSE |
| INSERT | TRUE | FALSE |
| UPDATE | FALSE | FALSE |
| DELETE | FALSE | FALSE |

Status: PASS - Privilege inspection completed.

Observation:
The application role can SELECT and INSERT user
records but cannot UPDATE or DELETE them.

The reporting role has no access to the users table.

Further review:
Check whether the application requires UPDATE
permissions for user account management.

Evidence: screenshots/26-users-table-permissions.png


### AC-13: Column-Level UPDATE Permission Verification

Database: dropboxed_db
Role: dropboxed_app

| Table | Columns Tested | Result |
|---|---|---|
| complaint_categories | 2 | 2/2 PASS |
| complaints | 4 | 4/4 PASS |
| staff | 2 | 2/2 PASS |
| users | 4 | 4/4 PASS |

Status: PASS - 12/12 documented UPDATE privileges verified.

Observation:
The application role has UPDATE permission on all
12 columns specified in Group 1's access-control plan.

The earlier table-level UPDATE results of FALSE
do not indicate a missing permission because
PostgreSQL supports column-level UPDATE grants.

Evidence: screenshots/27-column-update-permissions.png


### AC-14: Sensitive Column Access Verification

Database: dropboxed_db
Role: dropboxed_report
Tables: users, staff

| Test | Expected | Actual | Status |
|---|---|---|---|
| Approved reporting columns (8) | TRUE | TRUE | PASS |
| users.email | FALSE | FALSE | PASS |
| users.phone_number | FALSE | FALSE | PASS |
| users.password_hash | FALSE | FALSE | PASS |
| staff.password_hash | FALSE | FALSE | PASS |

Status: PASS - 12/12 column permissions verified.

Observation:
The reporting role can access the eight approved
reporting columns tested.

Access to email, phone_number, and password_hash
is restricted as documented.

Evidence: screenshots/28-sensitive-column-permissions.png


### AC-15: DBA Maintenance and Monitoring Privileges

Database: dropboxed_db
Role: dropboxed_dba

| Test | Expected | Actual | Status |
|---|---|---|---|
| MAINTAIN on complaints | TRUE | TRUE | PASS |
| pg_monitor membership | TRUE | TRUE | PASS |

Status: PASS - 2/2 privileges verified.

Observation:
The DBA role has MAINTAIN permission on the
complaints table and membership in pg_monitor.

Both match Group 1's documented access-control plan.

Evidence: screenshots/29-dba-maintenance-monitoring.png


### AC-16: Backup and Application Sequence Privileges

Database: dropboxed_db
Schema: dropboxed
Sequences inspected: 8

| Test | Expected | Actual | Status |
|---|---|---|---|
| Backup SELECT | TRUE (8/8) | TRUE (8/8) | PASS |
| Application USAGE | FALSE (8/8) | FALSE (8/8) | PASS |

Status: PASS - 16/16 privilege checks matched expectations.

Observation:
The backup role has SELECT privileges on all
8 sequences.

The application role has no direct USAGE
privileges on the 8 identity sequences.

These results match Group 1's documented
access-control plan.

Evidence: screenshots/30-backup-sequence-permissions.png

