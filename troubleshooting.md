# Troubleshooting Guide

## 1. Purpose

This guide lists common setup and runtime problems for the Catering Business Management System and provides safe steps for diagnosing them.

The project uses Node.js, Express.js, and PostgreSQL. Run backend commands from the `backend` directory unless a step says otherwise.

## 2. Backend Installation and Startup

| Problem or message | Possible cause | Recommended action |
|---|---|---|
| `Cannot find module 'express'` (or another package) | Backend dependencies are not installed | Open a terminal in `backend` and run `npm install`. |
| `npm` or `node` is not recognized | Node.js is missing or not on PATH | Install the current project-compatible Node.js LTS release, reopen the terminal, and check `node -v` and `npm -v`. |
| `EADDRINUSE` or port 5000 is already in use | Another process is using the backend port | Stop the other process or set a different unused `PORT` in `backend/.env`, then restart the server. |
| Browser says the site cannot be reached | Backend is stopped or using another port | Start the server with `npm start` from `backend`; check the terminal for the listening message and open the matching local URL. |
| Browser displays an error or invalid response | Backend returned an error or the request did not receive JSON | Check the backend terminal for the error details, confirm the database connection, and retry. |

Start the backend with:

```bash
cd backend
npm install
npm start
```

The default local URLs are:

- Staff dashboard: `http://localhost:5000/`
- Customer portal: `http://localhost:5000/customer.html`
- Database connection test: `http://localhost:5000/api/db-test`

## 3. Environment Configuration

The backend reads its configuration from `backend/.env`.

1. Copy `backend/.env.example`.
2. Save the copy as `backend/.env`.
3. Enter the correct local PostgreSQL connection values.
4. Set a unique `CUSTOMER_SESSION_SECRET` containing at least 32 characters.
5. Restart the backend after changing environment values.

Example structure (replace the placeholders with your own local values):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catering_management_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
CUSTOMER_SESSION_SECRET=replace_with_a_unique_secret_of_at_least_32_characters
```

Never commit `.env`, real passwords, or session secrets to GitHub. Use `.env.example` as the shareable template.

| Problem or message | Possible cause | Recommended action |
|---|---|---|
| `DB_USER is not set` | Required database environment values are missing | Create `backend/.env` from `.env.example` and fill in the values. |
| `password authentication failed` | Incorrect PostgreSQL username or password | Verify `DB_USER` and `DB_PASSWORD`; confirm the account can connect to the selected database. |
| `ECONNREFUSED` or database connection failed | PostgreSQL is stopped or host/port is wrong | Start PostgreSQL and verify `DB_HOST` and `DB_PORT` (commonly `localhost` and `5432`). |
| `CUSTOMER_SESSION_SECRET` is missing or too short | Customer session signing is not configured | Set a unique secret of at least 32 characters in `backend/.env` and restart the backend. Customer registration/login will not work until this is configured. |

## 4. Database Setup Problems

| Problem or message | Possible cause | Recommended action |
|---|---|---|
| `database "catering_management_db" does not exist` | The database has not been created | Create the database in PostgreSQL/pgAdmin, then execute the project schema and seed scripts for a new empty database. |
| `relation "customer" does not exist` | The schema was not loaded into the selected database | Confirm the backend connects to the intended database, then apply the schema to a new empty database. |
| `permission denied for table` | The PostgreSQL account lacks required table privileges | Connect using an authorized database owner or ask the database administrator to grant the necessary privileges. |
| `permission denied to create database` | The PostgreSQL account lacks database-creation permission | Use an authorized PostgreSQL account or ask an administrator to create the database. |
| Duplicate key or duplicate sample data error | Seed data may already have been inserted | Do not repeatedly run the seed script. Check existing records and use a separate empty test database if a clean test is needed. |
| `npm run db:setup` warns that reset is required | The setup script protects against accidental data loss | Read the warning and setup script instructions. Only use a reset on a new or disposable database. |

### Database safety warning

The project schema setup drops and recreates tables. Running it against a populated database can permanently delete records.

- For a new, empty database: follow the README sequence, running `database/schema.sql` first and `database/seed.sql` second.
- For an existing database: back it up and follow the documented migration sequence. Do not use the fresh-schema reset process.
- Never run a reset command on a database containing information you need to keep.

## 5. Customer Portal Problems

| Problem or message | Possible cause | Recommended action |
|---|---|---|
| Incorrect email or password | Credentials do not match an account with a password | Check the email/password. Sample customer records may not have passwords; register a new test account. |
| Email already exists | The email is already registered | Sign in with that account or contact staff. |
| Please sign in / Invalid session / Session expired | The token is missing, invalid, or expired | Sign in again. Customer session tokens expire after eight hours. |
| Customer sessions are not configured | Session secret is missing or shorter than 32 characters | Configure `CUSTOMER_SESSION_SECRET` in `backend/.env` and restart the server. |
| Could not load packages or menu | Backend/database is unavailable or catalog tables are empty | Check the server terminal and database connection; verify package and menu records exist. |
| Payment details cannot be submitted | Reservation is not Confirmed, details are invalid, or amount exceeds the remaining balance | Wait for staff confirmation; check the method, amount, reference number, and existing pending/paid submissions. |
| A cancellation request already exists or was processed | A Pending or Processed cancellation already exists | Review the cancellation status in reservation history or contact staff. |
| Reservation request is rejected | Required event details are missing or invalid, the date is in the past, or package/menu data is no longer valid | Check the date, venue, event type, guest count, selected package, and menu quantities. |

## 6. API and Record Problems

- **`Cannot GET` for an endpoint:** Confirm the route exists and use the correct HTTP method and URL. The project may provide a collection endpoint without a matching individual-record route for every resource.
- **`404 Not Found`:** Confirm the record ID exists and belongs to the expected resource.
- **`400 Bad Request`:** Review required fields, data types, dates, positive amounts, and foreign-key IDs.
- **`409 Conflict`:** The requested action may violate a workflow rule, such as submitting payment before confirmation or requesting cancellation more than once.
- **Foreign-key constraint error:** A referenced customer, package, reservation, employee, or menu item may not exist. Verify the related record before retrying.
- **Cannot delete a referenced record:** Other database records depend on it. Review the relationships before attempting deletion; do not remove related records blindly.

## 7. Safe Diagnostic Checklist

When a problem occurs, check these items in order:

1. Is PostgreSQL running?
2. Does the intended database exist?
3. Are the correct database name, host, port, username, and password in `backend/.env`?
4. Was the schema installed in that database?
5. Were dependencies installed with `npm install`?
6. Is the backend running, and is the browser using the correct port?
7. Does `http://localhost:5000/api/db-test` report a successful database connection?
8. What exact error appears in the browser and backend terminal?

When asking a teammate or administrator for help, share the exact error message and the steps that caused it. Remove passwords, tokens, and other secrets before sharing logs or screenshots.

## 8. Security Reminder

This project is intended for local/classroom use. The current staff dashboard and staff API routes do not enforce staff authentication/authorization. Do not expose the application to the public Internet until appropriate access controls and production security measures are implemented.
