# Database Documentation

## 1. Database Overview

The **Catering Business Management System** uses PostgreSQL 18.6 to store and manage the information needed for catering business operations.

| Property | Details |
|---|---|
| Database name | `catering_management_db` |
| Database management system | PostgreSQL 18.6 |
| Schema | `public` |
| Number of tables | 10 |

The database covers customer accounts, catering packages, menu items, employees, inventory, reservations, payments, menu selections, employee assignments, and cancellations.

## 2. Database Tables

The database consists of the following 10 tables:

| No. | Table | Purpose |
|---:|---|---|
| 1 | `customer` | Stores customer information and account credentials. |
| 2 | `package` | Stores catering package names, descriptions, and prices per guest. |
| 3 | `menu_item` | Stores food and beverage items, their categories, descriptions, and prices. |
| 4 | `employee` | Stores employee information and roles. |
| 5 | `inventory` | Tracks inventory items, units, quantities, and availability status. |
| 6 | `reservation` | Stores customer event bookings and their details. |
| 7 | `payment` | Records payments associated with reservations. |
| 8 | `reservation_menu` | Links reservations to selected menu items and stores their quantities. |
| 9 | `event_assignment` | Links reservations to assigned employees and records each assignment role. |
| 10 | `cancellation` | Stores cancellation details associated with reservations. |

## 3. Table Structure and Data Dictionary

The following data dictionary is based on the table definitions in `database/schema.sql`.

### 3.1 `customer`

**Purpose:** Stores customer personal information and account credentials.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `customer_id` | `INTEGER` | Primary key; identity column | Unique identifier for each customer. |
| `first_name` | `VARCHAR(50)` | `NOT NULL` | Customer's first name. |
| `last_name` | `VARCHAR(50)` | `NOT NULL` | Customer's last name. |
| `email` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Customer's email address. |
| `phone` | `VARCHAR(20)` | Nullable | Customer's phone number. |
| `address` | `VARCHAR(255)` | Nullable | Customer's address. |
| `password_hash` | `TEXT` | Nullable | Stores the customer's password hash. |

### 3.2 `package`

**Purpose:** Stores the catering packages offered by the business and their prices per guest.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `package_id` | `INTEGER` | Primary key; identity column | Unique identifier for each package. |
| `package_name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Name of the catering package. |
| `description` | `TEXT` | Nullable | Description of the package. |
| `price_per_guest` | `NUMERIC(10,2)` | `NOT NULL`; check: value must be at least 0 | Package price for each guest. |

### 3.3 `menu_item`

**Purpose:** Stores the food and beverage items available for catering reservations.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `menu_item_id` | `INTEGER` | Primary key; identity column | Unique identifier for each menu item. |
| `item_name` | `VARCHAR(100)` | `NOT NULL` | Name of the food or beverage item. |
| `description` | `TEXT` | Nullable | Description of the menu item. |
| `category` | `VARCHAR(50)` | `NOT NULL` | Category of the menu item. |
| `price` | `NUMERIC(10,2)` | `NOT NULL`; check: value must be at least 0 | Price of the menu item. |

### 3.4 `employee`

**Purpose:** Stores employee details and their assigned business roles.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `employee_id` | `INTEGER` | Primary key; identity column | Unique identifier for each employee. |
| `first_name` | `VARCHAR(50)` | `NOT NULL` | Employee's first name. |
| `last_name` | `VARCHAR(50)` | `NOT NULL` | Employee's last name. |
| `role` | `VARCHAR(50)` | `NOT NULL` | Employee's role in the catering business. |
| `phone` | `VARCHAR(20)` | Nullable | Employee's phone number. |
| `email` | `VARCHAR(100)` | Nullable | Employee's email address. |

### 3.5 `inventory`

**Purpose:** Tracks supplies and available quantities. The current schema maintains this table independently, without a declared foreign-key relationship to the other tables.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `inventory_id` | `INTEGER` | Primary key; identity column | Unique identifier for each inventory record. |
| `item_name` | `VARCHAR(100)` | `NOT NULL` | Name of the inventory item. |
| `unit` | `VARCHAR(30)` | `NOT NULL` | Unit used to measure the item. |
| `quantity` | `INTEGER` | `NOT NULL`; check: value must be at least 0 | Available quantity of the item. |
| `availability_status` | `VARCHAR(30)` | `NOT NULL`; default: `'Available'` | Availability status of the inventory item. |

### 3.6 `reservation`

**Purpose:** Stores customer event bookings, including the selected package and event information.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `reservation_id` | `INTEGER` | Primary key; identity column | Unique identifier for each reservation. |
| `customer_id` | `INTEGER` | `NOT NULL`; foreign key to `customer.customer_id` | Customer who made the reservation. |
| `package_id` | `INTEGER` | `NOT NULL`; foreign key to `package.package_id` | Catering package selected for the reservation. |
| `event_date` | `DATE` | `NOT NULL` | Scheduled date of the event. |
| `venue` | `VARCHAR(255)` | `NOT NULL` | Event venue or location. |
| `event_type` | `VARCHAR(50)` | `NOT NULL` | Type of event. |
| `number_of_guests` | `INTEGER` | `NOT NULL`; check: value must be greater than 0 | Number of guests for the event. |
| `status` | `VARCHAR(30)` | `NOT NULL`; default: `'Pending'` | Current reservation status. |
| `estimated_cost` | `NUMERIC(10,2)` | Nullable | Estimated cost of the reservation. |

### 3.7 `payment`

**Purpose:** Records payment transactions associated with reservations.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `payment_id` | `INTEGER` | Primary key; identity column | Unique identifier for each payment record. |
| `reservation_id` | `INTEGER` | `NOT NULL`; foreign key to `reservation.reservation_id` | Reservation associated with the payment. |
| `payment_amount` | `NUMERIC(10,2)` | `NOT NULL`; check: value must be greater than 0 | Amount recorded for the payment. |
| `payment_date` | `DATE` | `NOT NULL` | Date of the payment. |
| `payment_status` | `VARCHAR(30)` | `NOT NULL`; default: `'Pending'` | Current status of the payment. |
| `payment_method` | `VARCHAR(40)` | Nullable | Payment method recorded for the payment. |
| `reference_number` | `VARCHAR(100)` | Nullable | Payment reference number, when available. |

### 3.8 `reservation_menu`

**Purpose:** Serves as a junction table between reservations and menu items. It also records the quantity of each selected menu item.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `reservation_id` | `INTEGER` | `NOT NULL`; part of composite primary key; foreign key to `reservation.reservation_id` | Reservation associated with the selected menu item. |
| `menu_item_id` | `INTEGER` | `NOT NULL`; part of composite primary key; foreign key to `menu_item.menu_item_id` | Menu item selected for the reservation. |
| `quantity` | `INTEGER` | `NOT NULL`; check: value must be greater than 0 | Quantity of the selected menu item. |

**Primary key:** (`reservation_id`, `menu_item_id`)

The composite primary key prevents the same menu item from being entered more than once for the same reservation as a separate row.

### 3.9 `event_assignment`

**Purpose:** Serves as a junction table between reservations and employees. It records which employees are assigned to each reservation and their assignment roles.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `reservation_id` | `INTEGER` | `NOT NULL`; part of composite primary key; foreign key to `reservation.reservation_id` | Reservation to which the employee is assigned. |
| `employee_id` | `INTEGER` | `NOT NULL`; part of composite primary key; foreign key to `employee.employee_id` | Employee assigned to the reservation. |
| `assignment_role` | `VARCHAR(50)` | `NOT NULL` | Role of the employee for the specific event assignment. |

**Primary key:** (`reservation_id`, `employee_id`)

The composite primary key prevents the same employee from having duplicate assignment rows for the same reservation.

### 3.10 `cancellation`

**Purpose:** Stores cancellation requests and their processing details for reservations.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `cancellation_id` | `INTEGER` | Primary key; identity column | Unique identifier for each cancellation record. |
| `reservation_id` | `INTEGER` | `NOT NULL`; foreign key to `reservation.reservation_id` | Reservation associated with the cancellation. |
| `cancellation_date` | `DATE` | `NOT NULL` | Date the cancellation was recorded. |
| `cancellation_reason` | `VARCHAR(255)` | Nullable | Reason for the cancellation. |
| `cancellation_fee` | `NUMERIC(10,2)` | Nullable; check: value must be `NULL` or at least 0 | Cancellation fee, when applicable. |
| `refund_amount` | `NUMERIC(10,2)` | Nullable; check: value must be `NULL` or at least 0 | Refund amount, when applicable. |
| `cancellation_status` | `VARCHAR(20)` | `NOT NULL`; default: `'Pending'` | Current status of the cancellation. |

## 4. Primary Keys and Foreign Keys

### 4.1 Primary Keys

A primary key uniquely identifies each record in a table.

| Table | Primary Key |
|---|---|
| `customer` | `customer_id` |
| `package` | `package_id` |
| `menu_item` | `menu_item_id` |
| `employee` | `employee_id` |
| `inventory` | `inventory_id` |
| `reservation` | `reservation_id` |
| `payment` | `payment_id` |
| `reservation_menu` | (`reservation_id`, `menu_item_id`) |
| `event_assignment` | (`reservation_id`, `employee_id`) |
| `cancellation` | `cancellation_id` |

The single-column primary keys use PostgreSQL identity columns. The `reservation_menu` and `event_assignment` tables use composite primary keys.

### 4.2 Foreign Keys

Foreign keys maintain referential integrity between related tables.

| Foreign Key | References | Relationship Purpose |
|---|---|---|
| `reservation.customer_id` | `customer.customer_id` | Connects a reservation to its customer. |
| `reservation.package_id` | `package.package_id` | Connects a reservation to its selected package. |
| `payment.reservation_id` | `reservation.reservation_id` | Connects a payment to its reservation. |
| `reservation_menu.reservation_id` | `reservation.reservation_id` | Connects a menu selection to its reservation. |
| `reservation_menu.menu_item_id` | `menu_item.menu_item_id` | Connects a menu selection to a menu item. |
| `event_assignment.reservation_id` | `reservation.reservation_id` | Connects an employee assignment to a reservation. |
| `event_assignment.employee_id` | `employee.employee_id` | Connects an employee assignment to an employee. |
| `cancellation.reservation_id` | `reservation.reservation_id` | Connects a cancellation record to a reservation. |

The schema does not specify `ON DELETE CASCADE` or `ON UPDATE CASCADE` actions for these foreign keys. PostgreSQL therefore applies its default foreign-key behavior.

## 5. Database Relationships

The relationships represented by the foreign keys are summarized below:

| Parent Table | Child Table | Relationship |
|---|---|---|
| `customer` | `reservation` | One customer can have multiple reservations. |
| `package` | `reservation` | One package can be associated with multiple reservations. |
| `reservation` | `payment` | One reservation can have multiple payment records. |
| `reservation` | `reservation_menu` | One reservation can have multiple menu-selection records. |
| `menu_item` | `reservation_menu` | One menu item can be selected in multiple reservations. |
| `reservation` | `event_assignment` | One reservation can have multiple employee assignments. |
| `employee` | `event_assignment` | One employee can be assigned to multiple reservations. |
| `reservation` | `cancellation` | One reservation can have multiple cancellation records according to the schema. |

The `reservation_menu` table resolves the many-to-many relationship between reservations and menu items. The `event_assignment` table resolves the many-to-many relationship between reservations and employees.

The `inventory` table has no foreign-key relationships declared in the current schema.

## 6. Database Constraints and Default Values

The schema uses constraints to help maintain data accuracy and consistency.

### 6.1 NOT NULL Constraints

`NOT NULL` constraints require a value for designated columns. They are applied to required fields such as customer names, package names, reservation details, payment amounts, and assignment roles.

### 6.2 UNIQUE Constraints

| Table | Column | Purpose |
|---|---|---|
| `customer` | `email` | Prevents duplicate customer email addresses. |
| `package` | `package_name` | Prevents duplicate package names. |

### 6.3 CHECK Constraints

| Table | Column | Condition |
|---|---|---|
| `package` | `price_per_guest` | Must be greater than or equal to 0. |
| `menu_item` | `price` | Must be greater than or equal to 0. |
| `inventory` | `quantity` | Must be greater than or equal to 0. |
| `reservation` | `number_of_guests` | Must be greater than 0. |
| `payment` | `payment_amount` | Must be greater than 0. |
| `reservation_menu` | `quantity` | Must be greater than 0. |
| `cancellation` | `cancellation_fee` | Must be `NULL` or greater than or equal to 0. |
| `cancellation` | `refund_amount` | Must be `NULL` or greater than or equal to 0. |

### 6.4 Default Values

| Table | Column | Default Value |
|---|---|---|
| `inventory` | `availability_status` | `'Available'` |
| `reservation` | `status` | `'Pending'` |
| `payment` | `payment_status` | `'Pending'` |
| `cancellation` | `cancellation_status` | `'Pending'` |

## 7. Sample Data

The `database/seed.sql` file inserts 31 sample records across the 10 tables.

| Table | Sample Records |
|---|---:|
| `customer` | 3 |
| `package` | 3 |
| `menu_item` | 5 |
| `employee` | 3 |
| `inventory` | 5 |
| `reservation` | 3 |
| `payment` | 2 |
| `reservation_menu` | 3 |
| `event_assignment` | 3 |
| `cancellation` | 1 |
| **Total** | **31** |

### 7.1 Sample Data Details

- The sample customers are Maria Santos, Paolo Reyes, and Ana Cruz.
- The sample packages are Classic Filipino, Celebration, and Premium.
- The sample menu items include Chicken Adobo, Pancit Canton, Leche Flan, Beef Caldereta, and Iced Tea.
- The sample employees include a Head Chef, Event Coordinator, and Service Staff member.
- Inventory examples include Rice, Chicken, Cooking Oil, Paper Plates, and Table Napkins.
- The sample reservations use `Confirmed`, `Pending`, and `Cancelled` statuses.
- The sample payment records use `Paid` and `Pending` statuses.
- The sample cancellation record has a `Completed` status.

**Customer account note:** The seed script inserts customer profile information but does not insert password values. Register a new customer account through the Customer Portal to test customer sign-in.

**Payment note:** The sample payment inserts do not provide values for `payment_method` or `reference_number`, so those nullable columns remain empty for the inserted sample records.

**Execution note:** The seed script is intended for a newly initialized database and should not be run repeatedly against an already populated database.

## 8. Database Initialization

For a new installation, create a PostgreSQL database named `catering_management_db`. Connect to that database and execute the SQL scripts in the following order:

1. Run `database/schema.sql` to create the database tables, primary keys, foreign keys, and constraints.
2. Run `database/seed.sql` to insert the sample records.

The project README specifies that the schema and seed scripts are intended for a new, empty database. Do not execute them against an existing populated database.

The latest schema already includes the customer account and payment workflow columns. Do not apply the corresponding migrations again to a database created using the latest `schema.sql`.

## 9. Backup

Before applying migrations or making structural changes to an existing database, create a backup.

Example PostgreSQL backup command:

```bash
pg_dump -U postgres -d catering_management_db -Fc -f catering_backup.dump
```

Store database backups in a secure local location. Do not commit backup files containing sensitive information to the public repository.

## 10. Notes and Scope

- This document describes the database structure defined in the current `database/schema.sql` and the sample records inserted by `database/seed.sql`.
- The `inventory` table is independent in the current schema and has no declared foreign key to another table.
- The schema does not define check constraints for status values such as reservation, payment, inventory availability, or cancellation status.
- The schema does not define a unique constraint on `employee.email`.
- The schema does not declare cascading actions for its foreign keys.
- Any future database changes should be reflected in this documentation to keep it consistent with the implemented system.
