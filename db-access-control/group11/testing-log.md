# Group 11 – ReserveIT
## Testing Log

**System:** ReserveIT Classroom and Material Reservation System  
**Database:** PostgreSQL 18  
**Environment:** Local database (`localhost`, port 5432)  
**Review:** Activity 4 – Database Access Control

### Test 1: Database Privilege Testing

**Command:** `python tests/access_test.py`

**Result:** PASS

All 48 documented access checks passed, including the permitted and restricted operations for the application, reporting, maintenance, and owner accounts.

### Test 2: Reservation Status Transition

**Database role:** `reserveit_app`  
**Reservation ID:** 2  
**Original status:** `PENDING`  
**Attempted status:** `COMPLETED`

**Result:** Weakness confirmed.

PostgreSQL accepted the direct status change even though the application only permits completion of approved reservations.

**Cleanup:** Transaction rolled back. Reservation 2 was verified as `PENDING`.

### Test 3: Inventory Consistency

**Database role:** `reserveit_app`  
**Material:** Projector  
**Total quantity:** 6  
**Original available quantity:** 5  
**Reserved quantity:** 1  
**Attempted available quantity:** 6

**Result:** Weakness confirmed.

PostgreSQL accepted the inventory update despite an approved reservation requiring one projector.

**Cleanup:** Transaction rolled back. Available quantity was verified as 5.

### Test 4: Database Constraints

**Result:** Existing protections verified.

- Reservation status CHECK constraint: Present
- Reservation time CHECK constraint: Present
- Approved reservation overlap exclusion constraint: Present
- Material quantity CHECK constraints: Present

These constraints protect individual values and overlapping approved reservations, but do not fully enforce the tested workflow and inventory relationships.

### Test 5: Row-Level Security and Triggers

**Results:**

- Row-Level Security on `app_user`: Disabled
- Row-Level Security on `staff`: Disabled
- Row-Level Security on `reservation`: Disabled
- User-defined triggers on reservation and material-related tables: None found

**Note:** Missing RLS or triggers is not automatically a security flaw. These results help explain which protections are enforced through application code.

### Test 6: Account Status Enforcement

**Method:** Source code inspection  
**Files:** `app/auth.py`, `app/reservations.py`, `app/admin.py`

**Result:** Inconsistent validation identified.

Student authentication does not check account status, while staff authentication does. Some protected operations do not revalidate current account status.

No suspended-account login bypass was tested through the website.

### Test 7: Cancellation Concurrency

**Method:** Source code inspection  
**File:** `app/reservations.py`

**Result:** Potential race condition identified.

Cancellation checks eligibility before acquiring the row lock but does not validate eligibility again afterward.

Concurrent execution was not reproduced.

### Test 8: Flask Secret Key Configuration

**Method:** Source code inspection  
**File:** `app/__init__.py`

**Result:** Conditional configuration risk identified.

The application contains a predictable fallback secret key. Risk depends on whether a deployment uses that fallback.

### Test Cleanup and Verification

- Reservation 2 remained `PENDING` after rollback.
- Projector availability remained 5 after rollback.
- All six materials matched their expected available quantities during the consistency check.
- Testing was performed against the local PostgreSQL server at `::1`.
- No modifications were made to Group 11's remote repository or database through these local SQL tests.

## Overall Testing Result

**48 automated privilege checks passed.**

Additional SQL testing confirmed two database integrity weaknesses. Code inspection identified further account-status, concurrency, and configuration risks.

All direct SQL test modifications were rolled back and the relevant original values were verified.