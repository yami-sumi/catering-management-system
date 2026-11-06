# Catering Business Management System
## Application Roles and Database Access Documentation

### 1. Overview

The Catering Business Management System is designed to support different users involved in managing catering services.

Role-based access helps organize responsibilities and protect database information by allowing users to perform only the operations needed for their tasks.

The roles and privileges described below are **proposed for the system design**. They are not yet implemented as PostgreSQL roles.

### 2. Application User Roles

| Role | Responsibilities |
|---|---|
| Customer | View catering packages, submit reservations, and check reservation status |
| Staff | View assigned events and assist with catering operations |
| Administrator | Manage customers, packages, reservations, payments, inventory, employees, and cancellations |

### 3. Proposed Database Roles

| Database Role | Purpose |
|---|---|
| catering_admin | Manage database records and application operations |
| catering_staff | Access and update information needed for daily catering activities |
| catering_customer | Access permitted customer-facing information |
| catering_readonly | View selected records for reports and verification |

These are proposed PostgreSQL role names. They have not yet been created or granted privileges.

### 4. Proposed Database Privileges

The following table summarizes the intended access permissions.

| Database Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| catering_admin | Yes | Yes | Yes | Yes |
| catering_staff | Yes | Limited | Limited | No |
| catering_customer | Limited | Limited | Limited | No |
| catering_readonly | Yes | No | No | No |

**Limited** means access should be restricted to specific tables, columns, or authorized records.

### 5. Access Control Guidelines

The system should follow these guidelines:

1. Users should receive only the permissions required for their responsibilities.
2. Customer information should be protected from unauthorized access.
3. Staff should only access information relevant to their assigned duties.
4. Administrative operations should be restricted to authorized personnel.
5. Database passwords and connection credentials should not be committed to GitHub.
6. Database access should be reviewed when user responsibilities change.

### 6. Database Connection Security

The backend uses environment variables to configure its PostgreSQL connection.

Sensitive information should be stored in `backend/.env`, which must remain excluded from Git version control.

The repository should provide `backend/.env.example` containing placeholder values so other developers can configure their own database connections.

### 7. Implementation Status

The current Activity 3 backend provides API endpoints for managing catering records.

The application roles and database privileges described here are part of the proposed access-control design.

**Application-level authentication, role authorization, and separate PostgreSQL role privileges have not been verified as implemented.**

These features can be implemented and tested in a later development stage.

### 8. Conclusion

The proposed role structure separates customer, staff, and administrator responsibilities.

Documenting database privileges helps prepare the system for more secure access control while supporting future PostgreSQL role and permission testing.