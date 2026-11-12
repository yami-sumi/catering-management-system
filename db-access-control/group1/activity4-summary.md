# Activity 4 — Group 1 Access-Control Summary

**Testing Group:** Group 8  
**Evaluated System:** DropBoxed — Environmental Complaint Application  
**Database:** `dropboxed_db`  
**DBMS:** PostgreSQL 18

## 1. Objective

Evaluate the existing PostgreSQL access controls of Group 1's database, verify role permissions, and identify potential improvements based on the principle of least privilege.

## 2. Activities Performed

Group 8 inspected existing database roles, role memberships, and table privileges using pgAdmin.

Permission tests were conducted using the `dropboxed_report` and `dropboxed_app` accounts through PostgreSQL role switching.

## 3. Testing Results

| Test Category | Result |
|---|---|
| Existing roles and memberships | Verified |
| Reporting account read-only access | Passed |
| Reporting account denied UPDATE | Passed |
| Application account allowed SELECT | Passed |
| Application account denied DELETE on complaints | Passed |
| Runtime group privilege inspection | Completed |
| Existing DELETE grants | Verified |

## 4. Findings

**Finding 1 — Restricted UPDATE access**

The runtime group has no direct table-level UPDATE grants shown in the inspection. This may affect features requiring record updates, depending on the application's implementation.

**Finding 2 — DELETE permissions on selected tables**

The runtime group has DELETE privileges on `complaint_assignments` and `complaint_categories`. These should be reviewed to determine whether they are necessary.

Neither finding has been confirmed as a security flaw.

## 5. Recommendations

Review the application's required database operations before changing privileges.

Grant only the specific permissions needed for authorized operations, and revoke unnecessary permissions where justified.

## 6. Implementation Status

The existing access-control configuration was inspected and tested.

Proposed GRANT/REVOKE statements were documented in `access-control-changes.sql`, but no privilege changes were executed as part of this review.

## 7. Conclusion

The tested PostgreSQL access restrictions were enforced successfully. Additional application-level verification is necessary to establish whether the complete role configuration meets operational and least-privilege requirements.


## Feedback to Group 1 (DropBoxed)

### Verified Strengths
- Login accounts use separate NOLOGIN group roles.
- Application permissions follow column-level restrictions.
- Reporting access excludes tested sensitive columns.
- Backup role has read-only table access.
- DBA role has maintenance and monitoring privileges.
- Sequence privileges match the access-control plan.
- GRANT and REVOKE verification passed.

### Observation: Cross-Database CONNECT Access

The dropboxed_app account can connect to other
databases where PUBLIC has CONNECT permission.

This behavior is already acknowledged in Group 1's
access-control documentation.

Risk:
The account can establish connections to unrelated
databases, although this does not automatically
grant access to their tables.

Recommendation:
For shared PostgreSQL servers, administrators
should review database-level CONNECT permissions
and restrict unnecessary access where practical.

### Overall Assessment

The tested permissions largely match the
documented access-control plan.

No confirmed critical access-control flaw was
identified during these checks.

The application INSERT operation test remains
unverified and should not be marked as passed.


### Feedback Status

Feedback for Group 1 (DropBoxed) is documented
in this Activity 4 report.

The feedback includes verified strengths,
access-control observations, and recommendations.

Status: Documented in the repository.
Direct feedback to the owning group: Not sent.


## Final Automated Privilege Verification

Database: dropboxed_db
Verification date: November 12, 2026

The automated privilege verification was executed
using Group 1's provided verification script.

Results:
- Total tests: 48
- Passed: 48
- Unexpected results: 0
- Roles with elevated attributes: 0

The tests covered:
- Application role permissions
- Reporting role restrictions
- Backup role permissions
- DBA maintenance and monitoring
- Unauthorized database access

Assessment:
All 48 tested operations matched the expected
results in Group 1's access-control plan.

The application INSERT test for creating a complete
complaint remains unverified.

Evidence: privilege-results.md

Feedback status: Prepared but not sent.
