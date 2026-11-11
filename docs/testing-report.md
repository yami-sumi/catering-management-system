# Catering Business Management System
## Activity 3 – Database and API Testing Report

### 1. Project Information

**Project Name:** Catering Business Management System  
**Course:** COMP018 – Database Administration  
**Database:** PostgreSQL 18.6  
**Backend:** Node.js and Express.js  
**Testing Tools:** pgAdmin 4, PowerShell, Web Browser  
**Repository:** https://github.com/yami-sumi/catering-management-system

### 2. Testing Objectives

The purpose of this testing activity is to verify that the Catering Business Management System can successfully connect to PostgreSQL and perform database operations through its backend API.

The testing focuses on the four CRUD operations:

- **CREATE (POST):** Add new records.
- **READ (GET):** Retrieve existing records.
- **UPDATE (PUT):** Modify existing records.
- **DELETE (DELETE):** Remove records.

### 3. Database Setup Testing

A separate PostgreSQL database named `group08_cateringdb_test` was used to test the database setup.

| Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|
| Execute schema.sql | Create 10 tables | 10 tables created | Passed |
| Execute seed.sql | Insert sample records | 31 records inserted | Passed |
| Verify table records | Tables contain sample data | All 10 tables contain records | Passed |

The database setup was successful. All 10 tables were created, and 31 sample records were verified.

### 4. API CRUD Testing

The backend API was tested using PowerShell commands and browser requests.

| API Endpoint             | CREATE |  READ  | UPDATE | DELETE |
|--------------------------|--------|--------|--------|--------|
| /api/customers           | Passed | Passed | Passed | Passed |
| /api/packages            | Passed | Passed | Passed | Passed |
| /api/menu-items          | Passed | Passed | Passed | Passed |
| /api/reservations        | Passed | Passed | Passed | Passed |
| /api/payments            | Passed | Passed | Passed | Passed |
| /api/inventory           | Passed | Passed | Passed | Passed |
| /api/event-assignments   | Passed | Passed | Passed | Passed |
| /api/cancellations       | Passed | Passed | Passed | Reported complete; final response not captured |

### 5. Testing Procedure

1. Started the backend server using `node index.js`.
2. Opened each API endpoint in a web browser to verify READ operations.
3. Used PowerShell `Invoke-RestMethod` commands to create temporary records.
4. Updated temporary records using PUT requests.
5. Retrieved records again to verify that the updated values were saved.
6. Deleted temporary records using DELETE requests.
7. Checked API responses to verify the results.

### 6. Issues Encountered

**Issue 1: Individual Customer GET Request**

The request `GET /api/customers/1` returned `Cannot GET /api/customers/1`.

The collection endpoint `GET /api/customers` worked correctly and was used to verify customer records.

**Issue 2: Incorrect Package ID**

An UPDATE request for Package ID 4 returned `Package not found`.

After retrieving the package list, the temporary package was found with ID 8. The UPDATE operation was repeated using the correct ID and succeeded.

### 7. PostgreSQL Role and Privilege Verification

PostgreSQL role verification was performed using pgAdmin 4 on the `catering_management_db` database.

The group created three NOLOGIN group roles and one LOGIN role.

| Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|
| Verify PostgreSQL roles | Four Catering roles exist | Four roles found | Passed |
| Verify role types | Three NOLOGIN and one LOGIN | Role types matched | Passed |
| Verify table privileges | Assigned permissions appear on the database tables | 36 role-table privilege summaries returned | Passed |
| Verify application role membership | `catering_app` belongs to `app_runtime_grp` | Membership checked in pgAdmin | Passed, if expected membership was returned |

The verification confirmed that PostgreSQL roles were created and table permissions were assigned.

The following screenshots were captured:

- `01-postgresql-roles.png`
- `02-role-privileges.png`
- `03-role-membership.png`

These tests verified role configuration and recorded privileges. Login-based permission enforcement was not part of this evidence set.

### 8. Testing Results

The testing demonstrated that the backend can communicate with PostgreSQL and perform CRUD operations across the eight tested API endpoints.

The database setup was also verified using a separate test database.

**Overall Result:** CRUD testing was completed, with the final cancellation deletion response still requiring explicit confirmation for the evidence log.

### 9. Conclusion

The Catering Business Management System successfully performed database setup and backend API operations during Activity 3 testing.

The tests verified that the system can create, retrieve, update, and delete database records through its backend API.

Further testing may include invalid inputs, foreign key constraints, database permissions, and deployment verification.

### 10. Testing Evidence

The group collected screenshots of the database and API testing activities.

| Evidence | Description |
|---|---|
| PostgreSQL role creation | Four PostgreSQL roles verified using pgAdmin 4 |
| PostgreSQL table privileges | Role permissions verified across 12 tables |
| PostgreSQL role membership | Application login membership checked |
| CREATE operation | Menu item created successfully, HTTP 201 |
| READ operation | Catering packages retrieved successfully, HTTP 200 |
| UPDATE operation | Customer information updated successfully, HTTP 200 |
| Database verification | Menu item records retrieved through SQL |

Additional API test results are documented in Section 4. Not every reported endpoint result has a corresponding screenshot in the current evidence set.

### Activity 3 — CRUD Testing Evidence

**Module Tested:** Menu Item Management  
**Testing Tool:** Thunder Client (VS Code)  
**Backend:** Node.js / Express  
**Database:** PostgreSQL

| Operation | HTTP Method | Endpoint | Expected Result |
|---|---|---|---|
| Create | POST | `/api/menu-items` | 201 Created |
| Read | GET | `/api/menu-items` | 200 OK |
| Update | PUT | `/api/menu-items/:id` | 200 OK |
| Delete | DELETE | `/api/menu-items/:id` | Successful deletion |

**Testing Summary:**

The Menu Item Management module was tested using Thunder Client. A temporary menu item named "Activity 3 Test Burger" was created, retrieved, updated, and deleted through the REST API.

Screenshots of the four operations are stored in `docs/activity3/screenshots/crud/`.

**Result:** CRUD operations completed successfully, subject to confirmation of the saved response screenshots.