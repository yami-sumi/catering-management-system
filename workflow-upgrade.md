# System Workflow and Upgrade Notes

## 1. Purpose

This document describes how the Catering Business Management System connects its customer-facing reservation process with the staff dashboard and database. It also records the payment-workflow integration and important upgrade precautions.

The application uses a Node.js/Express backend, a PostgreSQL database, a staff dashboard, and a customer portal.

## 2. Main System Components

| Component | Purpose |
|---|---|
| Customer Portal (`/customer.html`) | Customer registration, sign-in, package/menu browsing, reservation requests, reservation history, payment-detail submissions, cancellation requests, and profile updates |
| Staff Dashboard (`/`) | Staff-side management of customers, packages, menu items, reservations, payments, inventory, employees, event assignments, reservation-menu records, and cancellations |
| Express API | Receives requests from the browser interfaces and performs database operations |
| PostgreSQL | Stores customer, package, menu, reservation, payment, inventory, employee, assignment, and cancellation records |

## 3. End-to-End Reservation Workflow

1. **Customer account:** A customer registers or signs in through the Customer Portal.
2. **Catalog browsing:** The portal retrieves available packages and menu items from the backend.
3. **Reservation details:** The customer selects a package and provides the event date, venue, event type, guest count, and optional menu selections.
4. **Validation and estimate:** The backend validates the request, checks that the package exists, and calculates the package estimate using price per guest multiplied by guest count.
5. **Reservation creation:** The reservation and selected menu records are saved in a database transaction. The initial reservation status is **Pending**.
6. **Staff review:** Staff review the request through the staff dashboard and update the reservation status as appropriate.
7. **Customer tracking:** The customer returns to the portal to view the reservation status and related details.

A submitted reservation is a request, not a confirmed booking. The system does not automatically verify whether the event date is available.

## 4. Payment Workflow

1. Staff review a reservation and change its status to **Confirmed**.
2. The customer opens the reservation history and selects **Submit payment details**.
3. The customer supplies a payment method, amount, and reference number.
4. The customer API checks that the reservation belongs to the signed-in customer, is Confirmed, and has sufficient unpaid balance after considering Paid and Pending payment records.
5. The system records the payment with status **Pending**.
6. Staff review the submitted details and independently verify the transaction.
7. Staff update the payment status through the staff dashboard. The customer can then see the recorded payment status and paid amount in reservation history.

Supported customer-entered methods are GCash, Maya, Bank Transfer, and Cash.

**Payment limitation:** The application does not connect to a payment gateway or bank/e-wallet provider. It records payment information supplied by the customer; staff verification is required. A Pending payment is not proof that funds have been received.

## 5. Cancellation Workflow

1. A customer submits a cancellation reason for an eligible Pending or Confirmed reservation.
2. The system creates a cancellation record with status **Pending**.
3. The reservation remains in its current status while the request awaits staff review.
4. Staff review the request:
   - If staff set the cancellation to **Processed**, the backend changes the reservation status to **Cancelled**.
   - If staff set it to **Rejected**, the cancellation request is rejected and the reservation is not cancelled by that request.
5. The customer can view the cancellation status in reservation history.

A customer cannot submit another request while a Pending or Processed cancellation exists for the reservation. A processed cancellation cannot be reopened through the staff cancellation update route.

**Refund limitation:** Processing a cancellation does not automatically issue or transfer a refund. Fee and refund values may be recorded by staff, but actual money transfers happen outside this application.

## 6. Other Staff Operations

The staff dashboard provides management screens for:

- Customers
- Packages
- Menu items
- Reservations
- Payments
- Inventory
- Employees
- Event assignments
- Reservation-menu selections
- Cancellations

The dashboard automatically refreshes the reservations, payments, and cancellations views periodically while those modules are active and the page is visible.

Inventory is maintained as its own set of records. The current system does not automatically deduct inventory based on a reservation because a recipe-to-inventory mapping is not implemented.

## 7. Payment Workflow Upgrade and Database Migration

The project includes a payment workflow migration at:

`database/migrations/002_payment_workflow.sql`

For an existing database, follow the migration sequence documented by the project:

1. Back up the database.
2. Confirm that migration `001` has already been applied.
3. Apply migration `002_payment_workflow.sql` to the existing database.
4. Restart the backend.
5. Refresh the browser and test the payment workflow.

For a **new, empty database**, follow the README instructions and execute the current `database/schema.sql` followed by `database/seed.sql`. The current fresh schema already includes the customer account and payment workflow columns; do not apply the same migrations again to a database created from that latest schema.

**Do not run `database/schema.sql`, seed resets, or a reset setup script against a populated database.** The schema setup drops and recreates tables and can destroy existing records. Back up first and use the migration path for an existing database.

## 8. Security and Deployment Limitations

The current project is intended for a local/classroom demonstration.

- Customer portal endpoints use signed customer session tokens. The configured session lifetime is eight hours.
- Customer passwords are stored as salted scrypt hashes, not as plain text.
- Customer reservation and profile routes verify the signed-in customer identity.
- The staff dashboard and staff API routes do not currently enforce staff login or role-based authorization.
- Do not expose the staff dashboard or backend port to the public Internet until staff authentication, authorization, and production security controls are implemented.
- Keep `.env` files, database passwords, and session secrets out of Git and shared ZIP files.
- Payment claims require independent staff verification.

## 9. Suggested Future Improvements

The following are possible future enhancements, not claims that they are already implemented:

- Staff authentication and role-based authorization.
- Date-availability checking before a reservation can be confirmed.
- Payment gateway integration and verified transaction callbacks.
- Automated refund handling, where supported by a payment provider.
- Email or SMS notifications for reservation, payment, and cancellation status changes.
- Customer password recovery and email verification.
- Audit logs for staff changes and payment verification.
- Recipe-to-inventory mapping and automatic stock deduction.
- Stronger database-level protections for concurrent payment and reservation updates.

## 10. Related Files

- `README.md`
- `database/schema.sql`
- `database/seed.sql`
- `database/migrations/002_payment_workflow.sql`
- `backend/index.js`
- `backend/routes/customerPortal.js`
- `backend/public/customer.js`
- `backend/public/app.js`
