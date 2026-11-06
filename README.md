# Catering Business Management System

## Project Overview

The Catering Business Management System is a database-driven web application developed to manage catering business operations, including customer information, catering packages, menu items, reservations, payments, inventory, employee assignments, and cancellations.

The system provides two interfaces:

- **Staff Dashboard:** Manages catering operations, including reservations, customers, payments, inventory, employees, and cancellations.
- **Customer Portal:** Allows customers to register, sign in, browse packages, submit reservations, view booking statuses, and manage their accounts.

The application uses Node.js and Express.js for its backend and PostgreSQL for database management.

This project was developed for **COMP018 – Database Administration, Activity 3**, based on the database design established in Activity 2.

---

## Technologies Used

| Component | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL 18.6 |
| Database Connection | pg (node-postgres) |
| Environment Configuration | dotenv |
| Frontend | HTML, CSS, JavaScript |
| API Testing | Postman |
| Version Control | Git and GitHub |
| Development Environment | Visual Studio Code |

---

## Prerequisites

Before running the project, install the following:

1. Node.js and npm
2. PostgreSQL
3. Git
4. Visual Studio Code or another code editor
5. pgAdmin or another PostgreSQL client (recommended)

Ensure that PostgreSQL is installed and its database service is running.

---

## Installation and Setup

### 1. Clone the Repository

Open a terminal or Command Prompt and execute:

```bash
git clone https://github.com/yami-sumi/catering-management-system-management-system.git
cd catering-management-system
```

**Access:** If the repository is private, reviewers must be granted access before cloning it.

### 2. Install Dependencies

All backend dependencies, including `bcrypt`, are declared in `backend/package.json`. Install from the project root:

```bash
cd backend
npm ci
```

This installs the required Node.js dependencies listed in `package.json`.

### 3. Create the PostgreSQL Database

Open pgAdmin or another PostgreSQL client.

Create a new database named:

```text
catering_management_db
```

Connect to the newly created database before executing the SQL scripts.

**For a new, empty database:**

1. Open `database/schema.sql` and execute it to create the database tables, primary keys, foreign keys, and constraints.
2. Open `database/seed.sql` and execute it to insert sample records.
3. Refresh the database tables in pgAdmin to verify successful creation.
4. From `backend/`, run `node create-admin.js` to create a demo administrator. Use a new strong password and do not publish it. The session table is created when the server starts.

The SQL files are located in the `database` folder at the project root.

**Important:** Execute `schema.sql` before `seed.sql`. These scripts are intended for a new, empty database. Do not run them against an existing populated database.

The fresh schema already includes the customer account, payment workflow, and admin table. Do not apply the same migrations again to a database created using the latest `schema.sql`.

### 4. Configure Environment Variables

Inside the `backend` folder, copy `.env.example` and rename the copy to `.env`.

Configure the following values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catering_management_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
CUSTOMER_SESSION_SECRET=your_unique_random_secret_at_least_32_characters
SESSION_SECRET=another_unique_random_secret_at_least_32_characters
```

Replace the placeholder values with your local PostgreSQL credentials.

To generate a secure customer session secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Generate **two different secrets** and set `CUSTOMER_SESSION_SECRET` and `SESSION_SECRET` in `.env`. Both are needed for customer and administrator sessions.

**Security reminder:** Never upload `.env`, actual database passwords, or session secrets to GitHub.

### 5. Start the Backend Server

From the `backend` directory, execute:

```bash
npm start
```

Alternatively, if supported by the project:

```bash
node index.js
```

The application should be accessible at:

**Admin Login:** http://localhost:5000/admin-login.html

**Staff Dashboard:** http://localhost:5000/

**Customer Portal:** http://localhost:5000/customer.html

Both interfaces are served through the same Express.js application.

### 6. Verify the Database Connection

Open the following endpoint in your browser:

```text
http://localhost:5000/api/db-test
```

A successful response should indicate that the backend can connect to the PostgreSQL database.

You may also run the database connection test from the `backend` directory:

```bash
node test-db.js
```

---

## Database Structure

The PostgreSQL database is named `catering_management_db` and uses the `public` schema.

It contains 10 tables based on the Activity 2 database design.

| Table | Description |
|---|---|
| `customer` | Stores customer information and account credentials |
| `package` | Stores catering packages and pricing |
| `menu_item` | Stores available food and beverage items |
| `employee` | Stores employee information and roles |
| `inventory` | Tracks supplies and available quantities |
| `reservation` | Stores customer event bookings |
| `payment` | Records reservation payments and payment statuses |
| `reservation_menu` | Associates selected menu items with reservations |
| `event_assignment` | Associates employees with reservations |
| `cancellation` | Records reservation cancellation requests and processing |

### Database Relationships

- One customer can have multiple reservations.
- One catering package can be associated with multiple reservations.
- One reservation can have multiple payment records.
- One reservation can have multiple menu items through `reservation_menu`.
- One menu item can be associated with multiple reservations.
- One reservation can have multiple employees assigned through `event_assignment`.
- One employee can be assigned to multiple reservations.
- One reservation can have multiple cancellation records according to the database schema.

The database uses primary keys, foreign keys, composite primary keys, unique constraints, and check constraints to maintain data integrity.

The `inventory` table is maintained independently in the current schema.

---

## Sample Data

The `database/seed.sql` file contains 31 sample records across all 10 tables.

| Table | Records |
|---|---:|
| customer | 3 |
| package | 3 |
| menu_item | 5 |
| employee | 3 |
| inventory | 5 |
| reservation | 3 |
| payment | 2 |
| reservation_menu | 3 |
| event_assignment | 3 |
| cancellation | 1 |
| **Total** | **31** |

### Important Sample Data Notes

- Sample customers do not have login passwords. To test the Customer Portal, register a new customer account using an unused email address.
- Sample payments may have empty `payment_method` and `reference_number` fields. These fields can be populated through the payment workflow.
- Sample reservations contain different statuses, including `Pending`, `Confirmed`, and `Cancelled`.
- Sample records are intended for database testing, demonstration, and SQL operations.
- Run the seed script only once on a new, empty database.

---

## System Features

### Staff Dashboard

The staff dashboard provides database management functionality for:

- Customers
- Catering packages
- Menu items
- Reservations
- Payments
- Inventory
- Employees
- Event assignments
- Reservation menu selections
- Cancellations

The dashboard supports applicable CRUD operations, including creating, viewing, updating, and deleting records.

Staff can also review customer reservations, update booking statuses, manage cancellation records, and verify payment information.

### Customer Portal

The customer portal allows customers to:

1. Register an account.
2. Sign in and sign out.
3. Update their contact information.
4. Browse catering packages and menu items.
5. Select a package and optional menu items.
6. Submit reservation requests.
7. View their own reservations and booking statuses.
8. Review estimated package costs and recorded payments.
9. Submit payment information for processing, where supported by the reservation workflow.
10. Request cancellation of reservations.

New customer reservation requests are initially recorded as `Pending` for staff review.

Customer account and reservation endpoints are protected by customer authentication.

---

## Reservation Workflow

The general reservation process is:

1. A customer registers or signs in.
2. The customer selects a catering package.
3. The customer provides the event date, venue, event type, and number of guests.
4. The customer may select optional menu items and quantities.
5. The customer submits the reservation request.
6. The reservation is stored with a `Pending` status.
7. Staff review the reservation and update its status.
8. The customer can view the updated reservation information through the Customer Portal.

Estimated reservation cost is calculated using the package price and number of guests. Optional menu selections are recorded for staff quotation.

Submitting a reservation does not guarantee that the selected event date is available.

---

## Payment Workflow

The payment module records payments associated with customer reservations.

The `payment` table includes:

- `payment_id`
- `reservation_id`
- `payment_amount`
- `payment_date`
- `payment_status`
- `payment_method`
- `reference_number`

### Payment Processing

1. The customer submits payment information through the supported Customer Portal workflow.
2. The system records the payment amount, method, reference number, and status.
3. Staff review the payment information through the dashboard.
4. Staff update the payment status after verification.
5. The payment record remains associated with its reservation.

**Important:** The system does not process real money transfers or automatically verify payments with a bank or electronic wallet provider. Payment verification is performed manually by staff.

---

## Cancellation Workflow

The system supports reservation cancellation records.

The `cancellation` table stores:

- Cancellation ID
- Reservation ID
- Cancellation date
- Cancellation reason
- Cancellation fee
- Refund amount
- Cancellation status

Cancellation requests can be reviewed and processed by staff.

Cancellation information remains associated with the relevant reservation through its foreign key.

---

## API Endpoints

The Express.js backend provides the following API routes:

| Module | Endpoint |
|---|---|
| Customers | `/api/customers` |
| Catering Packages | `/api/packages` |
| Menu Items | `/api/menu-items` |
| Employees | `/api/employees` |
| Inventory | `/api/inventory` |
| Reservations | `/api/reservations` |
| Reservation Menu | `/api/reservation-menu` |
| Payments | `/api/payments` |
| Event Assignments | `/api/event-assignments` |
| Cancellations | `/api/cancellations` |
| Customer Portal | `/api/customer-portal` |
| Database Connection Test | `/api/db-test` |

Applicable modules support REST-style operations such as:

- `GET` – Retrieve records
- `POST` – Create records
- `PUT` – Update records
- `DELETE` – Delete records

Available methods and request bodies depend on the specific route.

The Customer Portal routes also support customer authentication and customer-specific operations.

---

## Updating an Existing PostgreSQL Database

This section applies only when upgrading an older version of the Catering Business Management System database.

**Do not follow these migration steps when creating a new database using the latest `schema.sql`.**

### 1. Back Up the Existing Database

Create a backup before applying any migration.

Example:

```bash
pg_dump -U postgres -d catering_management_db -Fc -f catering_backup.dump
```

Keep the backup in a secure local location outside the public repository.

### 2. Apply the Customer Account Migration

If upgrading a database that does not yet contain customer authentication fields, execute:

```cmd
psql -U postgres -d catering_management_db -f database\migrations\001_customer_accounts.sql
```

### 3. Apply the Payment Workflow Migration

If upgrading a database that does not yet contain the payment method and reference number fields, execute:

```cmd
psql -U postgres -d catering_management_db -f database\migrations\002_payment_workflow.sql
```

Execute migration files from the project root.

Apply only migrations required by the current database version. Inspect the existing schema before applying a migration.

### 4. Configure and Restart

Ensure `.env` contains all required configuration values, including `CUSTOMER_SESSION_SECRET`.

Then run:

```bash
cd backend
npm install
npm start
```

**Warning:** Do not run `schema.sql` or `seed.sql` on an existing populated database.

---

## Testing Guide

### Database Testing

Using pgAdmin or another PostgreSQL client, verify that:

1. All 10 tables exist.
2. Sample records were inserted.
3. Primary keys and foreign keys are present.
4. Database constraints work as expected.
5. Relationships between reservations, customers, packages, payments, employees, and menu items are correct.

Example SQL queries:

```sql
SELECT * FROM customer;
SELECT * FROM package;
SELECT * FROM reservation;
SELECT * FROM payment;
```

### Staff Dashboard Testing

1. Open http://localhost:5000/.
2. View the available management modules.
3. Retrieve existing records.
4. Add a test record.
5. Update the test record.
6. Delete the test record.
7. Verify that changes are reflected in PostgreSQL.

Use disposable test records when testing update and delete operations.

### Customer Portal Testing

1. Open http://localhost:5000/customer.html.
2. Register using an unused email address.
3. Sign out and sign in again.
4. Browse catering packages and menu items.
5. Submit a new reservation.
6. Verify that the reservation appears as `Pending`.
7. Open the staff dashboard and update the reservation status.
8. Return to the Customer Portal and confirm the updated status.
9. Test the payment submission workflow.
10. Test cancellation processing where applicable.
11. Verify that another customer account cannot view the first customer's reservations.

### API Testing

Use Postman or another HTTP client to test the available endpoints.

Verify successful database operations and appropriate responses for invalid requests.

---

## Database Administration and Cross-Group Checking

This project serves as the Activity 3 system implementation for subsequent database administration activities.

Other authorized groups may clone the repository and configure a separate local PostgreSQL database for checking.

### Activity 4 – Database Users, Roles, and Privileges

Other groups can examine the database structure and application access requirements, then implement and test PostgreSQL roles and privileges using their own database copies.

### Activity 5 – Database Maintenance and Monitoring

Other groups can inspect PostgreSQL database statistics, review available logs, analyze query execution plans, and perform appropriate maintenance operations in their testing environments.

### Activity 6 – Database Backup, Restoration, and Recovery

Other groups can create database backups, restore them to separate test databases, verify restored records and constraints, and document recovery procedures.

### Important Guidelines for Other Groups

- Use your own local PostgreSQL database.
- Do not modify the original group's repository without permission.
- Do not use the original group's database credentials.
- Do not run destructive commands against the original database.
- Perform maintenance and recovery simulations only in an authorized testing environment.
- Keep passwords, session secrets, and backup files containing sensitive data out of public repositories.

---

## Troubleshooting

### Database Connection Failed

- Verify that PostgreSQL is running.
- Confirm that the database exists.
- Check the host, port, username, password, and database name in `.env`.
- Verify that the configured PostgreSQL user has the necessary database permissions.

### Cannot Find Module

Run:

```bash
cd backend
npm install
```

### Server Cannot Start

- Check whether port 5000 is already in use.
- Confirm that the required dependencies are installed.
- Review the terminal error message.
- Ensure the environment variables are configured correctly.

### API Returns an Error

- Confirm that the backend server is running.
- Check that the required tables exist.
- Verify request parameters and submitted data.
- Review the terminal error message.

### Customer Cannot Sign In

- Ensure `CUSTOMER_SESSION_SECRET` is configured.
- Register a new customer account through the Customer Portal.
- Do not attempt to sign in using seeded customers without password hashes.
- Check that the backend can connect to PostgreSQL.

### Payment Information Is Missing

- Check whether the payment workflow columns exist.
- For a fresh installation, verify that the latest `schema.sql` was used.
- For an older database, check whether the required payment migration was applied.

---

## Security and System Limitations

This application is intended for academic demonstration and local development.

Current limitations include:

- The staff dashboard and staff management API do not have authentication.
- Customer authentication protects customer-specific account and reservation endpoints only.
- There is no email verification or password recovery feature.
- There is no login rate limiting.
- The system does not integrate with a live payment gateway.
- Payment verification is performed manually.
- Event date availability is not automatically guaranteed.
- Existing customer records without password hashes cannot sign in until an appropriate account registration or migration process is completed.

Customer sessions are stored in browser session storage and expire after eight hours.

**Do not expose the application or its unauthenticated staff endpoints to the public internet.**

---

## Repository Information

**GitHub Repository:** https://github.com/yami-sumi/catering-management-system

**Branch for Testing:** `main`

The repository should include the backend source code, frontend files, database schema, seed data, migration scripts, and setup documentation.

Files such as `.env`, `node_modules`, and database backups containing sensitive information should not be committed.

---

## Academic Information

**Course:** COMP018 – Database Administration

**Activity:** Activity 3 – System Development and Repository Deployment and Progress Documentation

**Project:** Catering Business Management System

**Database:** catering_management_db

**DBMS:** PostgreSQL 18.6

**Purpose:** Academic system development, database implementation, testing, and preparation for database administration activities.

## Payment balance behavior

- Only payment transactions marked `Paid` count toward the verified total. `Pending` and `Failed` payments do not count as received funds.
- The customer portal shows the remaining balance and hides the submission button when the reservation is fully paid **or the remaining amount is already covered by pending submissions**.
- The customer payment API also checks paid and pending amounts before accepting new submissions. Staff must independently verify payment details.
- The staff payment API still allows manual corrections; verify entries carefully. This application does not automatically refund overpayments.

## Repository safety

Never commit `.env`, `.env.original.backup`, database dumps containing real records, or `node_modules`. The provided source-only archive excludes those files and Git metadata. If secrets were previously pushed, remove them from repository history and rotate them.
