# Group 9 – Batumbakal Gym
## Database Access Control Testing Log

**Reviewed System:** Batumbakal Gym Membership Management System  
**Database:** grp99_gymdb  
**DBMS:** PostgreSQL 18  
**Backend:** Java Spring Boot  
**Review Type:** Access Control and Security Testing  
**Test Date:** November 13, 2026

### Test 1 – Database Setup

**Procedure:**
1. Created the local PostgreSQL database `grp99_gymdb`.
2. Imported `database/schema.sql`.
3. Imported `database/seed.sql`.
4. Started the Spring Boot application using Maven.

**Result:** PASS

The database was successfully initialized, and the application connected to PostgreSQL.

### Test 2 – Unauthenticated Member Information Access

**Command:**
```cmd
curl -i http://localhost:8080/api/members
```

**Expected:** Member information should only be accessible to authorized users.

**Actual:** The API returned HTTP 200 and five member records, including names, email addresses, phone numbers, and emergency contact numbers.

**Result:** FAIL – Missing authentication and authorization.

### Test 3 – Unauthenticated Member Creation

**Endpoint:** `POST /api/members`

**Procedure:** Submitted a temporary member record without providing authentication credentials.

**Expected:** Unauthorized requests should be rejected.

**Actual:** The API returned HTTP 200 and created a new member with ID 6.

**Result:** FAIL – Unauthorized record creation was allowed.

### Test 4 – Unauthenticated Member Deactivation

**Command:**
```cmd
curl -i -X DELETE http://localhost:8080/api/members/6
```

**Expected:** Only authorized personnel should be allowed to deactivate members.

**Actual:** The API returned HTTP 200 and changed member 6's status from Active to Inactive.

**Result:** FAIL – Unauthorized record modification was allowed.

### Test 5 – Test Data Cleanup

**Procedure:**
1. Verified that member 6 had no related attendance, class enrollment, or membership records.
2. Deleted the temporary member directly from the local PostgreSQL database.

**Result:** PASS – PostgreSQL confirmed `DELETE 1`.

### Overall Finding

**Finding 1: Missing API Authentication and Authorization**

**Severity:** High

The application allows unauthenticated requests to retrieve member information, create member records, and deactivate members. This exposes personal information and permits unauthorized modifications when the API is reachable.

**Recommendation:** Implement authentication and role-based authorization for sensitive API endpoints. Restrict member-management operations to approved staff or administrators.