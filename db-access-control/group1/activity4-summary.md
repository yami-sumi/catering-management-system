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