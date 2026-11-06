# Troubleshooting

This guide provides solutions to common problems encountered when installing and running the Catering Business Management System.

| Symptom | Cause / Solution |
|---|---|
| `DB_USER is not set` | Create `backend/.env` using `.env.example` and enter your local PostgreSQL credentials. |
| `password authentication failed` | Check `DB_USER` and `DB_PASSWORD` in `.env`. |
| `ECONNREFUSED` / connection failed | Make sure PostgreSQL is running and verify `DB_HOST` and `DB_PORT` (default: 5432). |
| `database "catering_management_db" does not exist` | Create the database manually or run `npm run db:setup -- --reset` from `backend` for a fresh installation. |
| `relation "customer" does not exist` | The database schema may not be loaded. Initialize a fresh database using the setup instructions in the README. |
| `permission denied for table` | Check the PostgreSQL user's privileges. Use an authorized database owner or configure the intended roles as documented in `docs/roles-and-privileges.md`. |
| `permission denied to create database` | Use a PostgreSQL account with CREATEDB privileges or ask an administrator to create the database manually. |
| `Cannot find module 'express'` | Run `npm install` inside the `backend` directory. |
| `EADDRINUSE :::5000` | Port 5000 is already in use. Stop the conflicting process or change `PORT` in `.env`. |
| Web interface cannot connect to database | Check the PostgreSQL service, `.env` credentials, and backend terminal for errors. |
| Cannot delete a referenced record | Another record depends on it through a foreign key. Review the related records before deleting anything. |
| Duplicate key error during seed loading | The sample records may already exist. Use a fresh database or intentionally reset a disposable database. |
| `npm run db:setup` displays a safety warning | The setup script requires `--reset` because it drops and recreates tables. Run `npm run db:setup -- --reset` only on a fresh or disposable database. |
| `npm run smoke` fails | Make sure the backend server is running, then check that all API endpoints are accessible. |

## Important Database Safety Reminder

The `database/schema.sql` script drops and recreates existing tables.

Running the database setup with `--reset` can permanently remove existing records.

Only use this command on a new or disposable database. Do not reset a database containing important information.

## Admin login and session setup

- If startup reports `SESSION_SECRET is missing`, set `SESSION_SECRET` to a long random value in `backend/.env` and restart.
- If customer login reports sessions are not configured, set `CUSTOMER_SESSION_SECRET` separately.
- If admin login fails, verify the `admin` table exists in the configured database and create a test admin using `node create-admin.js` from `backend/`.
- If `Cannot find module bcrypt` appears, run `npm ci` inside `backend/`.
- If `/` redirects to admin login, this is expected when signed out.
