# Group 9 – Batumbakal Gym
## Access Control Findings and Feedback

### Finding 1: Missing API Authentication and Authorization

**Severity:** High  
**Status:** Confirmed through API testing

**Affected Files:**
- `MemberController.java`
- `MemberService.java`

**Affected Endpoints:**
- `GET /api/members`
- `POST /api/members`
- `DELETE /api/members/{id}`

### Description

The system allows users to access and modify member records without requiring authentication or checking user permissions.

The Member Controller does not enforce authentication or role-based authorization before processing requests.

### Evidence

Three tests were performed without providing login credentials or authentication tokens.

| Test | Actual Result |
|---|---|
| View member records | HTTP 200 – Returned five member records |
| Create a member | HTTP 200 – Successfully created member ID 6 |
| Deactivate a member | HTTP 200 – Changed member ID 6 to Inactive |

The temporary test member was removed from the local database after testing.

### Possible Impact

- Unauthorized users may access member names, email addresses, and contact numbers.
- Unauthorized users may create fake member records.
- Unauthorized users may deactivate existing members.
- Member information and database integrity may be compromised.

### Recommendation

Implement authentication and role-based access control (RBAC) using Spring Security.

Only authorized administrators or staff should be allowed to create, update, or deactivate member records. Sensitive member information should not be accessible to unauthenticated users.

### Feedback

The system's CRUD functionality works, but its API endpoints need stronger access restrictions. Implementing authentication and authorization would help protect member information and prevent unauthorized database modifications.