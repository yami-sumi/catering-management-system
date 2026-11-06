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

### 7. Testing Results

The testing demonstrated that the backend can communicate with PostgreSQL and perform CRUD operations across the eight tested API endpoints.

The database setup was also verified using a separate test database.

**Overall Result:** CRUD testing was completed, with the final cancellation deletion response still requiring explicit confirmation for the evidence log.

### 8. Conclusion

The Catering Business Management System successfully performed database setup and backend API operations during Activity 3 testing.

The tests verified that the system can create, retrieve, update, and delete database records through its backend API.

Further testing may include invalid inputs, foreign key constraints, database permissions, and deployment verification.