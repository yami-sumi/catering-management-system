# Group 10 – UniSync
## Database Access Control Findings and Feedback

**Project:** UniSync  
**DBMS:** PostgreSQL 18  
**Database:** `grp10_unisyncdb`  
**Reviewed Area:** Database roles, privileges, Row-Level Security (RLS), and access-control configuration

### Finding 1: Application Uses a PostgreSQL Superuser by Default

**Severity:** High  
**Affected File:** `config/db.php`

**Description:**  
The application's database configuration uses `postgres` as its default database username when no environment override is provided.

The `postgres` role has superuser privileges and can bypass PostgreSQL Row-Level Security policies.

**Evidence:**
- The default connection username is `postgres`.
- The `postgres` role has `rolsuper = true` and `rolbypassrls = true`.
- The restricted `unisync_app` role does not have these privileges.

**Possible Impact:**  
If the application connects using the superuser account, database restrictions intended for `unisync_app` will not protect application queries.

**Recommendation:**  
Configure the application to use `unisync_app` or another dedicated, least-privileged database role. Reserve `postgres` for database administration.

### Finding 2: Admin Membership Can Be Claimed in an Unclaimed Organization

**Severity:** High  
**Affected File:** `db/access-control.sql`  
**Affected Table:** `membership`

**Description:**  
The `membership_insert` RLS policy allows a user to insert an Admin membership when an organization has no existing memberships.

However, the policy does not verify that the user created or owns the organization.

**Evidence:**

During testing, Account 2 successfully inserted an Admin membership for an organization without existing members.

```text
membership_id | account_id | organization_id | role
240           | 2          | 31              | Admin
```

The transaction was rolled back afterward.

**Possible Impact:**  
A database user operating under the runtime role could claim administrative control of an organization that has no memberships.

**Recommendation:**  
Track the organization creator or owner in the database and require the Admin membership to match that account. Alternatively, create organizations and their initial Admin memberships through a controlled database function.

**Limitation:**  
The PHP organization-creation process creates the organization and its Admin membership in one transaction. Exploitation through the normal website workflow was not demonstrated.

### Finding 3: Session Security Settings Are Not Explicitly Enforced

**Severity:** Medium — Environment Configuration Observation  
**Affected Area:** PHP session configuration

**Description:**  
The tested XAMPP environment did not explicitly enable several recommended PHP session protections.

**Evidence:**

```text
session.cookie_secure = 0
session.cookie_httponly = empty
session.cookie_samesite = empty
session.use_strict_mode = 0
```

The inspected application files did not show explicit overrides for these settings.

**Possible Impact:**  
Depending on the deployment environment, session cookies may have weaker protection against interception or certain browser-based attacks.

**Recommendation:**  
Enable secure session settings, including `HttpOnly`, an appropriate `SameSite` policy, and strict session mode. Enable `Secure` when using HTTPS.

**Limitation:**  
These values were observed in the reviewer's XAMPP environment. They do not establish the configuration of every UniSync deployment.

### Finding 4: Database Allows an Organization to Lose All Active Admins

**Severity:** Medium  
**Affected File:** `db/access-control.sql`  
**Affected Table:** `membership`

**Description:**  
PostgreSQL does not independently enforce a rule requiring every active organization to retain at least one active Admin.

**Evidence:**

During a transaction, the following operations succeeded:

1. Account 2 promoted Account 5 to Admin.
2. Account 5 deactivated Account 2's Admin membership.
3. Account 5 deactivated their own Admin membership.

The final query returned:

```text
remaining_active_admins
0
```

All changes were rolled back.

**Possible Impact:**  
An active organization without an Admin may experience problems managing members, approving requests, or performing administrative tasks.

**Recommendation:**  
Add database-level validation or a controlled transaction mechanism to prevent removal of the final active Admin unless a replacement is assigned or the organization is deactivated.

**Limitation:**  
The PHP application includes Admin succession logic for its normal leave workflow. This test demonstrates a database-level weakness, not a confirmed exploit through the website.

---

## Positive Observations

UniSync also demonstrated several correctly implemented access-control protections:

- The six application-specific database roles do not have superuser or `BYPASSRLS` privileges.
- The restricted runtime role cannot delete account records.
- RLS blocked unauthorized role promotion in another organization.
- RLS blocked unauthorized membership reassignment.
- RLS prevented Account 2 from deactivating another organization's member.
- Authorized Admin role promotion worked as expected.
- The PHP application includes checks for organization membership management and Admin succession.

## Overall Feedback

UniSync has a functional access-control design using PostgreSQL roles, privileges, and Row-Level Security.

The most important improvement is to **avoid connecting the application as the PostgreSQL superuser**, because this undermines the intended database restrictions.

The database should also enforce critical organization ownership and Admin continuity rules rather than relying entirely on application-side validation.

The identified weaknesses provide opportunities to strengthen defense in depth. They do not mean that every restriction in the system is ineffective.

**Testing Note:** Temporary membership changes were rolled back, and the original records were verified afterward.