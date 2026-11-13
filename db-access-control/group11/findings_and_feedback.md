# Group 11 – ReserveIT
## Findings and Feedback

**System:** ReserveIT Classroom and Material Reservation System  
**Database:** PostgreSQL 18  
**Review:** Activity 4 – Database Access Control

### Finding 1: Reservation Status Workflow Bypass

**Severity:** High candidate  
**Affected:** `reservation` table, `app/reservations.py`  
**Status:** Confirmed through database testing

**Flaw:** The database allows reservations to change directly from `PENDING` to `COMPLETED`, even though the application requires approval before completion.

**Evidence:** An UPDATE using `reserveit_app` successfully changed reservation 2 from `PENDING` to `COMPLETED`. The transaction was rolled back.

**Impact:** Direct database operations can bypass the reservation approval workflow.

**Recommendation:** Enforce valid status transitions through a PostgreSQL trigger or equivalent database-side validation.

### Finding 2: Inventory and Reservation Inconsistency

**Severity:** High candidate  
**Affected:** `material`, `reservation_material`, `reservation`  
**Status:** Confirmed through database testing

**Flaw:** The database allows material availability to be changed without checking the quantities assigned to approved reservations.

**Evidence:** The application database role successfully changed available projectors from 5 to 6 while one projector remained reserved by an approved reservation.

**Impact:** Inventory records may become inaccurate, potentially allowing overbooking.

**Recommendation:** Add database-side safeguards that maintain consistency between inventory and approved reservations.

### Finding 3: Inconsistent Account Status Enforcement

**Severity:** High candidate  
**Affected:** `app/auth.py`, `app/reservations.py`, `app/admin.py`  
**Status:** Confirmed through code inspection

**Flaw:** Staff login checks whether an account is active, but student login does not perform the same status check. Some protected routes also rely on session information without rechecking account status.

**Impact:** Suspended users may still authenticate or access certain functions, while previously authenticated inactive staff may retain access to some operations.

**Recommendation:** Verify account status during login and protected requests. Revalidate sensitive permissions using current database records.

### Finding 4: Cancellation Race Condition

**Severity:** Medium–High candidate  
**Affected:** `app/reservations.py`, lines 215–227  
**Status:** Potential issue identified through code inspection

**Flaw:** The cancellation function checks reservation status before acquiring a row lock. After locking, it reads the current status but does not check whether cancellation is still allowed.

**Impact:** Concurrent operations may allow an invalid status transition, such as cancelling a reservation that was completed by another transaction.

**Recommendation:** Revalidate the reservation status after acquiring the `FOR UPDATE` lock.

### Finding 5: Predictable Fallback Secret Key

**Severity:** High if deployed without a secure key  
**Affected:** `app/__init__.py`  
**Status:** Conditional configuration risk

**Flaw:** The application provides a predictable fallback value for Flask's `SECRET_KEY` when no environment value is configured.

**Impact:** A deployment using the fallback may expose the integrity of signed session cookies.

**Recommendation:** Require a strong secret key and prevent application startup when the key is missing or uses a placeholder.

## Overall Feedback

ReserveIT has a documented least-privilege access-control design, and all 48 automated database privilege checks passed.

However, additional testing identified database integrity weaknesses that the privilege tests do not cover. The most significant confirmed issues involve reservation status transitions and inventory consistency.

**Recommendation:** Maintain the existing role restrictions while strengthening database-level business-rule enforcement, account-status validation, and automated security testing.

**Testing scope:** Findings involving direct SQL access do not establish that ordinary website users can exploit those weaknesses.