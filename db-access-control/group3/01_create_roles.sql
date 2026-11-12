
-- Group 8 Review: Group 3 PAWPAW
-- Create dedicated NOLOGIN group roles.
-- Safe to rerun; does not modify existing catering roles.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = 'pawpaw_admin_grp'
    ) THEN
        CREATE ROLE pawpaw_admin_grp NOLOGIN;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = 'pawpaw_runtime_grp'
    ) THEN
        CREATE ROLE pawpaw_runtime_grp NOLOGIN;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = 'pawpaw_readonly_grp'
    ) THEN
        CREATE ROLE pawpaw_readonly_grp NOLOGIN;
    END IF;
END
$$;
