# Catering Business Management System
## Database Documentation

### 1. Database Overview

The Catering Business Management System uses PostgreSQL 18.6 to store and manage customer information, catering packages, menu items, employees, inventory, reservations, payments, event assignments, and cancellations.

The database is designed to organize catering operations and maintain relationships between related records.

**Database Management System:** PostgreSQL 18.6  
**Main Database:** `catering_management_db`  
**Testing Database:** `group08_cateringdb_test`  
**Number of Tables:** 10

### 2. Database Tables

| Table | Primary Key | Description |
|---|---|---|
| customer | customer_id | Stores customer information |
| package | package_id | Stores catering package details |
| menu_item | menu_item_id | Stores available menu items |
| employee | employee_id | Stores employee information |
| inventory | inventory_id | Tracks available inventory |
| reservation | reservation_id | Stores catering reservations |
| payment | payment_id | Records reservation payments |
| reservation_menu | reservation_id, menu_item_id | Connects reservations and menu items |
| event_assignment | reservation_id, employee_id | Assigns employees to reservations |
| cancellation | cancellation_id | Stores reservation cancellation information |

### 3. Database Relationships

The database uses primary keys and foreign keys to connect related tables.

| Parent Table | Child Table | Relationship |
|---|---|---|
| customer | reservation | One-to-Many |
| package | reservation | One-to-Many |
| reservation | payment | One-to-Many |
| reservation | reservation_menu | One-to-Many |
| menu_item | reservation_menu | One-to-Many |
| reservation | event_assignment | One-to-Many |
| employee | event_assignment | One-to-Many |
| reservation | cancellation | One-to-Many |

The `reservation_menu` table implements the Many-to-Many relationship between reservations and menu items.

The `event_assignment` table implements the Many-to-Many relationship between reservations and employees.

### 4. Foreign Key Constraints

| Table | Foreign Key | References |
|---|---|---|
| reservation | customer_id | customer(customer_id) |
| reservation | package_id | package(package_id) |
| payment | reservation_id | reservation(reservation_id) |
| reservation_menu | reservation_id | reservation(reservation_id) |
| reservation_menu | menu_item_id | menu_item(menu_item_id) |
| event_assignment | reservation_id | reservation(reservation_id) |
| event_assignment | employee_id | employee(employee_id) |
| cancellation | reservation_id | reservation(reservation_id) |

### 5. Database Constraints

The database includes the following constraints:

- **PRIMARY KEY:** Uniquely identifies records.
- **FOREIGN KEY:** Maintains relationships between tables.
- **NOT NULL:** Requires values for mandatory fields.
- **UNIQUE:** Prevents duplicate customer emails and package names.
- **CHECK:** Validates selected numerical values.
- **DEFAULT:** Assigns default values to selected status fields.
- **IDENTITY:** Automatically generates IDs for tables with identity columns.

Examples of CHECK constraints include:

- Package price must be zero or greater.
- Inventory quantity must not be negative.
- Reservation guest count must be greater than zero.
- Payment amount must be greater than zero.
- Reservation menu quantity must be greater than zero.
- Cancellation fees and refund amounts cannot be negative when provided.

### 6. Database Setup

To create the database structure:

1. Create a PostgreSQL database.
2. Open the Query Tool in pgAdmin 4.
3. Execute `database/schema.sql`.
4. Verify that all 10 tables were created.
5. Execute `database/seed.sql` in the fresh database.
6. Verify that sample records were inserted successfully.

The database setup was tested using `group08_cateringdb_test`.

### 7. Database Verification

During Activity 3 testing:

- All 10 tables were created successfully.
- The seed script inserted 31 sample records.
- The backend successfully retrieved data from PostgreSQL.
- CRUD operations were tested through the backend API.

### 8. Conclusion

The PostgreSQL database provides the data storage and relational structure required for the Catering Business Management System.

Primary keys, foreign keys, and constraints help maintain data consistency and support the application's database operations.

## Additional operational tables

- `admin`: stores administrator username, bcrypt password hash, and creation timestamp. Defined in `database/schema.sql`.
- `session`: stores server-side administrator sessions; created by `connect-pg-simple` at runtime if absent.

These tables are separate from the core business entities.
