
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET - Payment summary for a reservation
router.get("/summary/:reservationId", async (req, res) => {
    try {
        const { reservationId } = req.params;

        if (
            !Number.isInteger(Number(reservationId)) ||
            Number(reservationId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid reservation ID."
            });
        }

        const result = await pool.query(
            `SELECT
                r.reservation_id,
                r.estimated_cost AS total_cost,
                COALESCE(SUM(
                    CASE
                        WHEN p.payment_status = 'Paid'
                        THEN p.payment_amount
                        ELSE 0
                    END
                ), 0) AS total_paid
             FROM reservation r
             LEFT JOIN payment p
                ON r.reservation_id = p.reservation_id
             WHERE r.reservation_id = $1
             GROUP BY r.reservation_id, r.estimated_cost`,
            [reservationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        const { total_cost, total_paid } = result.rows[0];

        if (total_cost === null) {
            return res.status(409).json({
                message: "Reservation estimated cost is not set."
            });
        }

        // Calculate using integer centavos to avoid
        // floating-point rounding errors.
        const cost = Math.round(Number(total_cost) * 100);
        const paid = Math.round(Number(total_paid) * 100);

        const balance = Math.max(0, cost - paid);
        const excess = Math.max(0, paid - cost);

        let status = "Unpaid";

        if (paid > cost) {
            status = "Overpaid";
        } else if (paid === cost) {
            status = "Paid";
        } else if (paid > 0) {
            status = "Partially Paid";
        }

        res.json({
            reservation_id: Number(reservationId),
            total_cost: (cost / 100).toFixed(2),
            total_paid: (paid / 100).toFixed(2),
            remaining_balance: (balance / 100).toFixed(2),
            excess_payment: (excess / 100).toFixed(2),
            overall_payment_status: status
        });

    } catch (error) {
        console.error("Payment summary error:", error.message);

        res.status(500).json({
            message: "Failed to calculate payment summary."
        });
    }
});

// GET - Retrieve all payments
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                p.*,
                r.event_type,
                r.event_date
             FROM payment p
             JOIN reservation r
                ON p.reservation_id = r.reservation_id
             ORDER BY p.payment_id ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching payments:", error.message);
        res.status(500).json({
            message: "Failed to retrieve payments."
        });
    }
});

// GET - Retrieve a payment by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                p.*,
                r.event_type,
                r.event_date
             FROM payment p
             JOIN reservation r
                ON p.reservation_id = r.reservation_id
             WHERE p.payment_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Payment not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching payment:", error.message);
        res.status(500).json({
            message: "Failed to retrieve payment."
        });
    }
});

// POST - Add a new payment
router.post("/", async (req, res) => {
    try {
        const {
            reservation_id,
            payment_amount,
            payment_date,
            payment_status,
            payment_method,
            reference_number
        } = req.body;

        if (
            !reservation_id ||
            payment_amount === undefined ||
            !payment_date
        ) {
            return res.status(400).json({
                message: "Please provide reservation ID, payment amount, and payment date."
            });
        }

        if (
            !Number.isInteger(Number(reservation_id)) ||
            Number(reservation_id) <= 0
        ) {
            return res.status(400).json({
                message: "Reservation ID must be a positive integer."
            });
        }

        if (
            !Number.isFinite(Number(payment_amount)) ||
            Number(payment_amount) <= 0
        ) {
            return res.status(400).json({
                message: "Payment amount must be greater than zero."
            });
        }

        // Check if the reservation exists
        const reservationResult = await pool.query(
            `SELECT reservation_id, status, estimated_cost
             FROM reservation
             WHERE reservation_id = $1`,
            [reservation_id]
        );

        if (reservationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        if (['Cancelled','Completed'].includes(reservationResult.rows[0].status)) return res.status(409).json({message:'Cannot add payments to cancelled or completed events.'});
        const result = await pool.query(
            `INSERT INTO payment
            (
                reservation_id,
                payment_amount,
                payment_date,
                payment_status, payment_method, reference_number
            )
            VALUES ($1, $2, $3, COALESCE($4, 'Pending'), $5, $6)
            RETURNING *`,
            [
                reservation_id,
                payment_amount,
                payment_date,
                payment_status || null, payment_method || null, reference_number || null
            ]
        );

        res.status(201).json({
            message: "Payment added successfully!",
            payment: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding payment:", error.message);
        res.status(500).json({
            message: "Failed to add payment."
        });
    }
});

// PUT - Update an existing payment
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            reservation_id,
            payment_amount,
            payment_date,
            payment_status,
            payment_method,
            reference_number
        } = req.body;

        if (
            !reservation_id ||
            payment_amount === undefined ||
            !payment_date
        ) {
            return res.status(400).json({
                message: "Please provide all required payment details."
            });
        }

        if (
            !Number.isInteger(Number(reservation_id)) ||
            Number(reservation_id) <= 0
        ) {
            return res.status(400).json({
                message: "Reservation ID must be a positive integer."
            });
        }

        if (
            !Number.isFinite(Number(payment_amount)) ||
            Number(payment_amount) <= 0
        ) {
            return res.status(400).json({
                message: "Payment amount must be greater than zero."
            });
        }

        // Check if the reservation exists
        const reservationResult = await pool.query(
            `SELECT reservation_id, status, estimated_cost
             FROM reservation
             WHERE reservation_id = $1`,
            [reservation_id]
        );

        if (reservationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        const currentPayment = await pool.query('SELECT reservation_id,payment_status FROM payment WHERE payment_id=$1',[id]);
        if(!currentPayment.rowCount) return res.status(404).json({message:'Payment not found.'});
        if(Number(currentPayment.rows[0].reservation_id)!==Number(reservation_id))return res.status(409).json({message:'Payment reservation cannot be changed.'});
        if(payment_status==='Paid' && reservationResult.rows[0].status==='Cancelled')return res.status(409).json({message:'Cannot verify a payment for a cancelled event.'});
        const result = await pool.query(
            `UPDATE payment
             SET reservation_id = $1,
                 payment_amount = $2,
                 payment_date = $3,
                 payment_status = COALESCE($4, payment_status),
                 payment_method = COALESCE($5,payment_method),
                 reference_number = COALESCE($6,reference_number)
             WHERE payment_id = $7
             RETURNING *`,
            [
                reservation_id,
                payment_amount,
                payment_date,
                payment_status || null,
                payment_method || null,
                reference_number || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Payment not found."
            });
        }

        res.json({
            message: "Payment updated successfully!",
            payment: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating payment:", error.message);
        res.status(500).json({
            message: "Failed to update payment."
        });
    }
});

// DELETE - Remove a payment
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM payment
             WHERE payment_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Payment not found."
            });
        }

        res.json({
            message: "Payment deleted successfully!",
            payment: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting payment:", error.message);
        res.status(500).json({
            message: "Failed to delete payment."
        });
    }
});

module.exports = router;
