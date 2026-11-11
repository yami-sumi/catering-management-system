# Catering Business Management System
## Application Roles and Database Access Documentation

### 1. Overview

The Catering Business Management System supports different users involved in managing catering services.

The system includes application-level user roles and PostgreSQL database roles. Application roles describe user responsibilities, while database roles control permissions for accessing and modifying database information.

The group implemented PostgreSQL roles and verified their existence, table privileges, and role membership using pgAdmin 4.

### 2. Application User Roles

| Role | Responsibilities | Implementation Status |
|---|---|---|
| Customer | View catering packages, submit reservations, and check reservation status | Customer authentication and portal features included |
| Staff | View assigned events and assist with catering operations | Proposed role; separate staff authentication not verified |
| Administrator | Manage customers, packages, reservations, payments, inventory, employees, and cancellations | Administrator authentication and management features included |

Application user roles are separate from PostgreSQL database accounts. They are not automatically assigned the same privileges as database roles.

### 3. Implemented PostgreSQL Roles

The group created the following PostgreSQL roles using the role definitions in `database/roles.sql`.

| Database Role | Type | Purpose |
|---|---|---|
| `app_admin_grp` | NOLOGIN | Administrative data-management privileges |
| `app_runtime_grp` | NOLOGIN | Database permissions required by the backend |
| `app_readonly_grp` | NOLOGIN | Read-only access to database tables |
| `catering_app` | LOGIN | Application database account assigned to `app_runtime_grp` |

The three NOLOGIN roles organize database privileges. The LOGIN role is intended to connect to PostgreSQL and inherit permissions from its assigned group.

### 4. Implemented Database Privileges

The following table summarizes the privileges assigned to the existing tables in the `public` schema.

| Database Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `app_admin_grp` | Yes | Yes | Yes | Yes |
| `app_runtime_grp` | Yes | Yes | Yes | Yes |
| `app_readonly_grp` | Yes | No | No | No |
| `catering_app` | Inherited | Inherited | Inherited | Inherited |

The `catering_app` account is a member of `app_runtime_grp` and inherits its privileges.

The permissions above apply to all 12 existing tables in the public schema. They do not represent separate table-level restrictions for customers or staff.

### 5. Access Control Guidelines

The system follows these access-control guidelines as design principles:

1. Assign database permissions according to user responsibilities.
2. Protect customer and payment information from unauthorized access.
3. Restrict administrative functions to authorized application users.
4. Keep database credentials out of the public repository.
5. Review database permissions when responsibilities change.
6. Maintain separate application authentication and PostgreSQL database access controls.

These guidelines describe security objectives. The existing table grants do not establish that every objective is fully enforced.

### 6. Database Connection Security

The backend uses environment variables to configure its PostgreSQL connection.

Sensitive credentials are stored locally in `backend/.env`, which should remain excluded from Git version control.

The repository includes `backend/.env.example` with placeholder configuration values for other developers.

The PostgreSQL login role `catering_app` was created and assigned to the runtime group. Actual use of this login account by the backend must be confirmed through its environment configuration and a successful connection test.

### 7. Implementation and Verification Status

The group implemented PostgreSQL roles in the `catering_management_db` database environment.

Verification was performed using SQL queries in pgAdmin 4.

| Verification | Result |
|---|---|
| Catering database tables | 12 tables found |
| PostgreSQL role existence | Four roles confirmed |
| PostgreSQL role types | Three NOLOGIN roles and one LOGIN role |
| Table privileges | 36 role-table privilege summaries returned |
| Application login membership | Checked using `pg_auth_members` |
| Login-based allowed/denied operations | Not yet documented in this evidence set |

The following screenshots are retained as supporting evidence:

- `docs/activity-3/screenshots/01-postgresql-roles.png`
- `docs/activity-3/screenshots/02-role-privileges.png`
- `docs/activity-3/screenshots/03-role-membership.png`

The SQL queries verify the recorded role definitions, table privileges, and membership. They do not independently prove that all application authorization rules or PostgreSQL permission restrictions work as intended.

### 8. Conclusion

The Catering Business Management System has implemented PostgreSQL roles for administrative data management, backend runtime operations, and read-only access.

The group verified the role definitions and assigned table privileges through pgAdmin 4. This implementation supports the Activity 3 database access documentation and provides a foundation for further access-control testing and improvement.