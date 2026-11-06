# Customer Portal – Activity 2 Traceability

The customer-facing web page is `/customer.html`; the existing staff dashboard is `/`.

| Activity 2 customer requirement | Implementation |
|---|---|
| Customer registration and profile | Register/sign in, edit contact details; password hashes in `customer.password_hash` |
| View packages and menu | Read-only package/menu catalog |
| Select package and menu | Reservation request with optional `reservation_menu` records |
| Submit event details | Date, venue, event type, guest count; server calculates estimated package cost |
| Review estimated cost | Displayed before submission and in reservation history |
| View reservation status/history | Customer-scoped reservation list with status, menu and recorded payments |
| Staff review | New reservations start Pending and are handled through existing staff dashboard |

Customers can submit payment details (amount, method, reference) for staff verification; this does not process or transfer money. Not yet implemented: payment gateway processing, payment-information editing, feedback collection, online date availability confirmation, password recovery and email verification. Activity 2 described these capabilities, but the present customer implementation is an initial working subset. See README for security and testing limitations.
