# Roles and Privileges Documentation

## 1. Overview

The Catering Business Management System provides two application interfaces:

1. **Staff Dashboard** – used to manage catering business operations.
2. **Customer Portal** – used by customers to manage their accounts and reservations.

The system README describes customer authentication for customer-specific account and reservation endpoints. It also states that the staff dashboard and staff management API do not have authentication in the current implementation.

This document describes the application access and permissions documented for the current system. It does not assume that PostgreSQL database roles have already been created.

## 2. Application User Roles

### 2.1 Staff

**Description:** Staff use the Staff Dashboard to manage catering operations and review customer transactions and reservations.

**Interface:** `http://localhost:5000/`

The README identifies the following staff management areas:

- Customer records
- Catering packages
- Menu items
- Reservations
- Payments
- Inventory
- Employees
- Event assignments
- Reservation menu selections
- Cancellations

The dashboard supports applicable create, read, update, and delete (CRUD) operations. Staff can also review customer reservations, update booking statuses, manage cancellation records, and verify payment information.

**Access limitation:** The current README states that the staff dashboard and staff management API do not have authentication. Therefore, the application does not currently enforce a staff sign-in or staff-specific permission level.

### 2.2 Customer

**Description:** Customers use the Customer Portal to register, sign in, browse catering offerings, submit reservations, and manage their own accounts.

**Interface:** `http://localhost:5000/customer.html`

The documented customer capabilities are:

- Register an account.
- Sign in and sign out.
- Update contact information.
- Browse catering packages and menu items.
- Select a package and optional menu items.
- Submit reservation requests.
- View their own reservations and booking statuses.
- Review estimated package costs and recorded payments.
- Submit payment information for processing, where supported by the reservation workflow.
- Request reservation cancellations.

New customer reservation requests are initially saved with a `Pending` status for staff review.

**Access restriction:** Customer authentication protects customer account and customer-specific reservation endpoints. Customers are intended to access their own reservation information rather than another customer's reservations.

## 3. Application Roles and Privileges Matrix

The following matrix summarizes the capabilities stated in the project README. A check indicates a capability documented for that interface; it does not imply that every individual API route has been independently verified.

| Functionality | Staff Dashboard | Customer Portal |
|---|---|---|
| Register a customer account | Not specified as a staff dashboard function | Yes |
| Sign in and sign out | No staff authentication currently implemented | Yes |
| Manage customer contact information | Manage customer records | Update own contact information |
| Browse catering packages | Manage package records | Browse packages |
| Browse menu items | Manage menu item records | Browse menu items |
| Submit a reservation | Review and manage reservations | Submit own reservation request |
| View reservation information | Review customer reservations | View own reservations |
| Update reservation status | Yes | No; customers can view status |
| Manage payment records | Review and verify payment information | Submit payment information where supported; review recorded payments |
| Manage inventory | Yes | Not documented |
| Manage employee records | Yes | Not documented |
| Manage event assignments | Yes | Not documented |
| Manage reservation menu selections | Yes | Select optional menu items during reservation |
| Process cancellation records | Review and process cancellations | Request cancellation |
| Access another customer's reservations | Staff can review customer reservations | Not permitted by the documented customer-specific access restriction |

## 4. Employee Roles

The database contains an `employee` table with a `role` column (`VARCHAR(50) NOT NULL`). The sample data includes these employee job roles:

| Sample Employee Role | Description |
|---|---|
| Head Chef | Employee job title recorded in the employee table. |
| Event Coordinator | Employee job title recorded in the employee table. |
| Service Staff | Employee job title recorded in the employee table. |

**Important distinction:** These values are employee job titles stored in the database. The current README and database schema do not establish them as application login roles or permission groups. No separate privileges for Head Chef, Event Coordinator, or Service Staff are defined in the supplied project documentation.

## 5. Authentication and Authorization

### 5.1 Customer Authentication

The Customer Portal supports customer registration, sign-in, and sign-out.

The `customer` table contains a `password_hash` column of type `TEXT`, which is intended to store a customer's password hash.

The README states that customer account and reservation endpoints are protected by customer authentication. Customer-specific operations are restricted so that one customer account cannot access another customer's reservations.

The README also documents these current limitations:

- There is no email verification.
- There is no password recovery feature.
- There is no login rate limiting.
- Seeded customer records do not contain login passwords; a new account should be registered to test sign-in.
- Customer sessions are stored in browser session storage and expire after eight hours.

### 5.2 Staff Authentication

The current system does not implement authentication for the Staff Dashboard or staff management API, according to the README.

Consequently:

- There is no documented staff login process.
- There are no documented staff account credentials.
- There are no implemented staff permission levels described in the supplied documentation.
- The staff management endpoints should not be exposed to the public internet.

### 5.3 Authorization Summary

| Area | Current documented behavior |
|---|---|
| Customer account endpoints | Protected by customer authentication. |
| Customer-specific reservation endpoints | Protected by customer authentication and customer-specific access restrictions. |
| Staff dashboard | No authentication currently implemented. |
| Staff management API | No authentication currently implemented. |
| Employee job roles | Stored as employee information; not documented as application authorization roles. |

## 6. PostgreSQL Database Roles and Privileges

The supplied `database/schema.sql` defines tables, primary keys, foreign keys, and constraints. It does not include `CREATE ROLE`, `CREATE USER`, `GRANT`, or `REVOKE` statements.

Therefore, the current schema file does not establish separate PostgreSQL roles or table-level privileges for staff and customers.

The database connection uses the PostgreSQL credentials configured in the backend `.env` file:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

These environment variables configure the backend's database connection. They do not, by themselves, define separate application roles for Staff and Customer.

Any PostgreSQL role and privilege configuration created later for database administration activities should be documented separately and should match the SQL commands actually applied in the database.

## 7. Security Considerations and Current Limitations

The project README identifies the following security limitations:

1. The Staff Dashboard and staff management API do not have authentication.
2. Customer authentication protects customer-specific account and reservation endpoints only.
3. The system does not provide email verification or password recovery.
4. The system does not implement login rate limiting.
5. The application is intended for academic demonstration and local development.
6. The application and its unauthenticated staff endpoints must not be exposed to the public internet.

For testing and demonstration, use a local development environment and avoid using real customer credentials or sensitive personal information.

## 8. Summary

The current application has two documented access groups: **Staff** and **Customer**. Staff use the Staff Dashboard to manage catering operations, while customers use the authenticated Customer Portal to manage their own accounts and reservation activities.

The employee job titles stored in the `employee.role` column are not documented as application permission roles. In addition, the supplied database schema does not create separate PostgreSQL users or grant table-level privileges. These distinctions should be maintained when documenting or implementing future access-control and database-administration features.
