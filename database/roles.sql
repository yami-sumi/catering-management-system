-- =====================================================================
-- Intended database roles (see docs/roles-and-privileges.md)
-- OPTIONAL for Activity 3. Run as a superuser AFTER schema.sql + seed.sql:
--   psql -U postgres -d catering_management_db \
--        -v runtime_pw="'CHOOSE_A_PASSWORD'" -f database/roles.sql
-- No real passwords are stored in this file.
-- =====================================================================

-- Group roles (NOLOGIN: privileges only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin_grp')    THEN CREATE ROLE app_admin_grp    NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime_grp')  THEN CREATE ROLE app_runtime_grp  NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_readonly_grp') THEN CREATE ROLE app_readonly_grp NOLOGIN; END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_admin_grp, app_runtime_grp, app_readonly_grp;

-- Administrator: full DML on all tables (not a superuser)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_admin_grp;

-- Runtime (the account the Express API uses): only the DML the code performs
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_runtime_grp;

-- Read-only / auditor
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly_grp;

-- Login account used by the API (password supplied at run time, never committed)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'catering_app') THEN
    CREATE ROLE catering_app LOGIN;
  END IF;
END $$;
GRANT app_runtime_grp TO catering_app;
\if :{?runtime_pw}
ALTER ROLE catering_app PASSWORD :runtime_pw;
\endif
