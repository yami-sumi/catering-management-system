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
| GRANT SELECT | TRUE | Not yet confirmed | Pending |
| REVOKE SELECT | FALSE | Not yet confirmed | Pending |

**Evidence:** 23-grant-revoke-verification.png (if captured)

**Note:** The test uses a temporary role. The changes are reversed using ROLLBACK to avoid modifying the existing application permissions.
