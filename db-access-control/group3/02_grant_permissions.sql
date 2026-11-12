
-- Group 8 Review: Group 3 PAWPAW
-- Run only against group3_Pawpaw.
-- Proposed least-privilege policy for review testing.
-- Assumes dedicated PAWPAW roles created by 01_create_roles.sql.

BEGIN;

GRANT CONNECT ON DATABASE "group3_Pawpaw"
TO pawpaw_admin_grp, pawpaw_runtime_grp, pawpaw_readonly_grp;

GRANT USAGE ON SCHEMA public
TO pawpaw_admin_grp, pawpaw_runtime_grp, pawpaw_readonly_grp;

-- Administrative management
GRANT SELECT, INSERT, UPDATE ON
    public.user_account,
    public.owner,
    public.veterinarian,
    public.service,
    public.appointment,
    public.pet
TO pawpaw_admin_grp;

GRANT SELECT ON public.audit_log
TO pawpaw_admin_grp;

-- Shared backend runtime
-- Includes protected data because the application implements
-- authorization checks for individual application users.
GRANT SELECT ON ALL TABLES IN SCHEMA public
TO pawpaw_runtime_grp;

GRANT INSERT, UPDATE ON
    public.user_account,
    public.owner,
    public.veterinarian,
    public.pet,
    public.service,
    public.appointment,
    public.appointment_service,
    public.medical_record,
    public.prescription,
    public.vaccination,
    public.notification,
    public.audit_log,
    public.password_reset_code
TO pawpaw_runtime_grp;

GRANT DELETE ON
    public.prescription,
    public.vaccination,
    public.password_reset_code
TO pawpaw_runtime_grp;

-- Read-only reference data
GRANT SELECT ON public.service
TO pawpaw_readonly_grp;

-- Sequence permissions for generated IDs
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public
TO pawpaw_admin_grp, pawpaw_runtime_grp;

COMMIT;
