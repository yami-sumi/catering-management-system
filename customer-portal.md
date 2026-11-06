# Customer Portal Guide

## 1. Overview

The Customer Portal is the customer-facing interface of the Catering Business Management System. It is available at:

`http://localhost:5000/customer.html`

Customers can create an account, sign in, browse catering packages and menu items, request reservations, review reservation information, submit payment details after confirmation, request cancellation, and update their profile.

The portal communicates with the Express backend through the `/api/customer-portal` API routes and uses PostgreSQL to store and retrieve records.

## 2. Before Using the Portal

The application must be running locally before the portal can be opened. Confirm that:

- PostgreSQL is running.
- The project database has been created and initialized.
- Backend dependencies have been installed.
- The backend `.env` file has valid database settings and a configured `CUSTOMER_SESSION_SECRET`.
- The backend server is running.

See the project `README.md` for complete installation instructions.

## 3. Create a Customer Account

1. Open `http://localhost:5000/customer.html`.
2. Choose the registration option.
3. Enter your first name, last name, email address, and password. Phone number and address may also be provided.
4. Use a valid email address and a password between 8 and 128 characters.
5. Submit the registration form.

The system checks the required information and prevents registration with an email address that is already registered. A successful registration creates a customer record and signs the customer in.

**Note:** Existing sample customer records may not have passwords. Register a new account with an unused email address to test customer sign-in.

## 4. Sign In and Sign Out

### Sign in

1. Open the Customer Portal.
2. Select the sign-in option.
3. Enter the email address and password used during registration.
4. Submit the form.

If the credentials are valid, the portal opens the customer account area.

### Sign out

Use the **Logout** control in the account area. The portal removes the customer token stored in the browser's `sessionStorage` and returns to the sign-in view.

Customer session tokens expire after eight hours. If the session expires, sign in again.

## 5. Browse Packages and Menu Items

After signing in, the portal loads the available catering packages and menu items from the database.

- Each package displays its name, description, and price per guest.
- Menu items display their name, category, and listed price.
- Select a package before submitting a reservation.
- Optional menu items and quantities can be selected as part of the reservation request.

The package and menu catalog is read from the database. Customers cannot edit catalog information through the portal.

## 6. Submit a Reservation Request

1. Sign in to the Customer Portal.
2. Open the reservation/booking section.
3. Select a catering package.
4. Enter the event date, venue, event type, and number of guests.
5. Optionally select menu items and enter positive quantities.
6. Review the estimated package cost.
7. Submit the reservation request.

The system validates the submitted information. The event date must be today or a future date, the guest count must be a positive number, and required event details must be provided.

### Estimated cost

The displayed estimate is calculated as:

`Package price per guest × Number of guests`

Optional menu selections are recorded with the reservation. Additional charges for menu selections, if applicable, must be quoted by staff; they are not added to the displayed package estimate by the customer portal.

### Reservation status

A newly submitted request is saved with the status **Pending**. Staff must review it and update its status. Submitting a request does not guarantee that the requested event date is available.

## 7. View Reservation History and Status

Open **My Reservations** (or the reservation history section) after signing in.

The portal displays reservations belonging to the signed-in customer, including available details such as:

- Event type and event date
- Reservation number
- Catering package and venue
- Number of guests
- Reservation status
- Estimated package cost
- Selected menu items
- Recorded payments and payment statuses
- Cancellation request status, when applicable

Use the refresh control to reload the reservation list. While the reservation-history panel is open, the portal also refreshes it periodically.

Customers can see only reservations associated with their authenticated customer account through the customer-portal reservation endpoint.

## 8. Submit Payment Details

Payment submission is available only after staff changes the reservation status to **Confirmed**.

1. Open **My Reservations**.
2. Find the confirmed reservation.
3. Choose **Submit payment details**.
4. Enter the payment method: GCash, Maya, Bank Transfer, or Cash.
5. Enter the amount being reported.
6. Enter the payment reference number. For cash, enter the receipt/reference number.
7. Submit the details.

The system records the submission with a **Pending** payment status for staff verification. It checks that the amount is positive and does not exceed the remaining unpaid balance, including other pending submissions.

**Important:** This feature records a customer's payment claim. It does not transfer money, connect to a bank or e-wallet, or automatically verify receipt of funds. Staff must independently verify the transaction and update its status. A submitted payment is not automatically a confirmed or paid transaction.

## 9. Request Reservation Cancellation

1. Open **My Reservations**.
2. Find a reservation with a **Pending** or **Confirmed** status.
3. Choose **Request cancellation**.
4. Enter a reason for the request.
5. Submit the request.

The cancellation request is saved with a **Pending** status. The reservation itself is not cancelled immediately.

Staff review the request and either:

- **Process** it: the cancellation is marked Processed and the reservation status changes to Cancelled.
- **Reject** it: the cancellation request is marked Rejected and the reservation is not cancelled by that request.

A reservation cannot receive another customer cancellation request while an existing request is Pending or has been Processed. A completed or otherwise ineligible reservation cannot be cancelled through this customer workflow.

**Refund reminder:** Processing a cancellation does not automatically transfer a refund. Any applicable fee or refund amount is handled and recorded by staff; the application does not send money.

## 10. Update Customer Profile

1. Sign in.
2. Open the profile section.
3. Update your first name, last name, phone number, or address.
4. Save the changes.

The email address is displayed but is not editable through the current profile form.

## 11. Common Customer Messages

| Message or situation | What to do |
|---|---|
| Incorrect email or password | Check the registered email and password, then try again. |
| Session expired / Please sign in | Sign in again; customer sessions expire after eight hours. |
| Email already exists | Use the existing account or contact staff for assistance. |
| Payment details can be submitted after staff confirms the reservation | Wait until the reservation status is Confirmed. |
| Amount exceeds the unpaid balance | Check the remaining balance and any pending payment submissions. |
| A cancellation request already exists or was processed | Check the cancellation status in reservation history or contact staff. |
| Could not load packages or reservations | Check the server connection and contact the system administrator if the issue continues. |

## 12. Current Limitations

The current implementation is intended for local/classroom demonstration and requires further work before public production use.

- Reservation submission does not confirm date availability.
- Menu extras may require a separate staff quotation.
- Payment details are submitted for manual verification; there is no payment gateway or automatic bank/e-wallet verification.
- Refunds are not automatically transferred.
- There is no customer password-recovery or email-verification workflow in the current portal.
- Customers must refresh or revisit the portal to see changes; there are no email or SMS status notifications.
- The staff dashboard and staff APIs do not currently have staff authentication/authorization. Do not expose the application to the public Internet.

## 13. Related Project Files

- Customer page: `backend/public/customer.html`
- Customer styling: `backend/public/customer.css`
- Customer behavior: `backend/public/customer.js`
- Customer API: `backend/routes/customerPortal.js`
- Backend entry point: `backend/index.js`
- Setup instructions: `README.md`
