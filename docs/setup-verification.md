## Current clone setup (November 2026)

**Use the root `README.md` as the authoritative setup guide.** After cloning, each reviewer must create a private `backend/.env` from `backend/.env.example`, run the one-line Node.js secret generator, and enter their **own** PostgreSQL password. No shared secrets are published.

Open `http://localhost:5000/` for the **public landing page**, `http://localhost:5000/customer.html` for the customer portal, and `http://localhost:5000/admin-login.html` for staff login. The staff dashboard remains protected at `/index.html`.

The database must be created locally using `database/schema.sql` and `database/seed.sql`; create a staff account with `node create-admin.js` from `backend`. Do not commit `.env`.

---

# Catering Business Management System
## Activity 3 – Setup Verification Report

### 1. Project Information

**Project:** Catering Business Management System  
**Course:** COMP018 – Database Administration  
**Repository:** https://github.com/yami-sumi/catering-management-system  
**Database Management System:** PostgreSQL 18.6  
**Backend:** Node.js with Express.js  
**Testing Tools:** Visual Studio Code, pgAdmin 4, PowerShell, Web Browser

### 2. Purpose

The purpose of this report is to document the setup and verification of the Catering Business Management System.

The setup process includes preparing the PostgreSQL database, configuring the backend, running the application, and testing database operations.

### 3. Project Setup

The project contains the following main folders:

| Folder | Description |
|---|---|
| backend/ | Contains the Node.js and Express backend |
| database/ | Contains database schema and seed scripts |
| docs/ | Contains project documentation |
| frontend/ | Reserved for frontend development, if needed |

The backend uses environment variables to configure its database connection.

The `.env` file is excluded from GitHub to protect connection credentials.

### 4. Database Setup Verification

A separate test database named `group08_cateringdb_test` was created in PostgreSQL.

The following steps were performed:

1. Created the test database using pgAdmin 4.
2. Executed `database/schema.sql`.
3. Verified that 10 tables were created.
4. Executed `database/seed.sql`.
5. Verified that 31 sample records were inserted.

**Result:** Passed.

### 5. Backend Setup Verification

The backend was started using the following command:

```bash
cd backend
node index.js
```

The backend application was accessed through:

`http://localhost:5000`

API endpoints were tested using a web browser and PowerShell.

**Result:** Backend server started and API requests were processed successfully.

### 6. API Endpoint Verification

| API Endpoint | Verification Result |
|---|---|
| /api/customers | CRUD tested |
| /api/packages | CRUD tested |
| /api/menu-items | CRUD tested |
| /api/reservations | CRUD tested |
| /api/payments | CRUD tested |
| /api/inventory | CRUD tested |
| /api/event-assignments | CRUD tested |
| /api/cancellations | CRUD tested |

Temporary records were created and modified to test database operations.

Most temporary records were subsequently removed. Final cancellation cleanup should be confirmed against the current database state.

### 7. GitHub Repository Verification

The project was committed and pushed to GitHub.

**Repository:** https://github.com/yami-sumi/catering-management-system  
**Remote Branch:** main  
**Latest verified pushed commit:** `3018102`

The repository contains the backend source code, database scripts, and README documentation.

The new Activity 3 documentation files are being prepared for a later commit.

### 8. Issues Encountered

**Issue 1: Package ID mismatch**

An UPDATE request initially used an incorrect package ID and returned `Package not found`.

The correct ID was identified using the GET endpoint, and the UPDATE test succeeded.

**Issue 2: Individual customer GET route**

The endpoint `/api/customers/1` returned `Cannot GET /api/customers/1`.

The collection endpoint `/api/customers` worked and was used to verify customer records.

### 9. Verification Summary

| Component | Status |
|---|---|
| PostgreSQL installation | Verified |
| Database schema creation | Passed |
| Database seed data | Passed |
| Backend server startup | Passed |
| API database connectivity | Passed |
| CRUD operation testing | Completed |
| GitHub push | Passed |
| Fresh-clone setup by another user | Not yet verified |
| Deployment to another environment | Not yet verified |

### 10. Conclusion

The Catering Business Management System was successfully set up and tested in the local development environment.

The database schema and sample data were verified, and the backend successfully performed CRUD operations through its API endpoints.

Additional verification may be performed by another group member using a fresh clone of the repository and their own PostgreSQL database.