
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET - Retrieve all reservations
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                r.*,
                c.first_name,
                c.last_name,
                p.package_name
             FROM reservation r
             JOIN customer c
                ON r.customer_id = c.customer_id
             JOIN package p
                ON r.package_id = p.package_id
             ORDER BY r.reservation_id ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching reservations:", error.message);
        res.status(500).json({
            message: "Failed to retrieve reservations."
        });
    }
});

// GET - Retrieve a reservation by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                r.*,
                c.first_name,
                c.last_name,
                p.package_name
             FROM reservation r
             JOIN customer c
                ON r.customer_id = c.customer_id
             JOIN package p
                ON r.package_id = p.package_id
             WHERE r.reservation_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching reservation:", error.message);
        res.status(500).json({
            message: "Failed to retrieve reservation."
        });
    }
});

// POST - Create a new reservation
router.post("/", async (req, res) => {
    try {
        const {
            customer_id,
            package_id,
            event_date,
            venue,
            event_type,
            number_of_guests
        } = req.body;

        // Check required fields
        if (
            !customer_id ||
            !package_id ||
            !event_date ||
            !venue ||
            !event_type ||
            !number_of_guests
        ) {
            return res.status(400).json({
                message: "Please provide all required reservation details."
            });
        }

        if (
            !Number.isInteger(Number(number_of_guests)) ||
            Number(number_of_guests) <= 0
        ) {
            return res.status(400).json({
                message: "Number of guests must be a positive integer."
            });
        }

        // Get the selected package price
        const packageResult = await pool.query(
            `SELECT price_per_guest
             FROM package
             WHERE package_id = $1`,
            [package_id]
        );

        if (packageResult.rows.length === 0) {
            return res.status(404).json({
                message: "Package not found."
            });
        }

        // Calculate estimated cost
        const price = Number(packageResult.rows[0].price_per_guest);
        const estimated_cost = price * Number(number_of_guests);

        const result = await pool.query(
            `INSERT INTO reservation
            (
                customer_id,
                package_id,
                event_date,
                venue,
                event_type,
                number_of_guests,
                estimated_cost
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                customer_id,
                package_id,
                event_date,
                venue,
                event_type,
                number_of_guests,
                estimated_cost
            ]
        );

        res.status(201).json({
            message: "Reservation created successfully!",
            reservation: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating reservation:", error.message);
        res.status(500).json({
            message: "Failed to create reservation."
        });
    }
});

// PUT - Update an existing reservation
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            customer_id,
            package_id,
            event_date,
            venue,
            event_type,
            number_of_guests,
            status
        } = req.body;

        if (
            !customer_id ||
            !package_id ||
            !event_date ||
            !venue ||
            !event_type ||
            !number_of_guests
        ) {
            return res.status(400).json({
                message: "Please provide all required reservation details."
            });
        }

        if (
            !Number.isInteger(Number(number_of_guests)) ||
            Number(number_of_guests) <= 0
        ) {
            return res.status(400).json({
                message: "Number of guests must be a positive integer."
            });
        }

        // Get the selected package price
        const packageResult = await pool.query(
            `SELECT price_per_guest
             FROM package
             WHERE package_id = $1`,
            [package_id]
        );

        if (packageResult.rows.length === 0) {
            return res.status(404).json({
                message: "Package not found."
            });
        }

        // Recalculate estimated cost
        const estimated_cost =
            Number(packageResult.rows[0].price_per_guest) *
            Number(number_of_guests);

        const result = await pool.query(
            `UPDATE reservation
             SET customer_id = $1,
                 package_id = $2,
                 event_date = $3,
                 venue = $4,
                 event_type = $5,
                 number_of_guests = $6,
                 status = COALESCE($7, status),
                 estimated_cost = $8
             WHERE reservation_id = $9
             RETURNING *`,
            [
                customer_id,
                package_id,
                event_date,
                venue,
                event_type,
                number_of_guests,
                status || null,
                estimated_cost,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        res.json({
            message: "Reservation updated successfully!",
            reservation: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating reservation:", error.message);
        res.status(500).json({
            message: "Failed to update reservation."
        });
    }
});

// DELETE - Remove a reservation
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM reservation
             WHERE reservation_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found."
            });
        }

        res.json({
            message: "Reservation deleted successfully!",
            reservation: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting reservation:", error.message);

        if (error.code === "23503") {
            return res.status(409).json({
                message: "Cannot delete this reservation because it has related records."
            });
        }

        res.status(500).json({
            message: "Failed to delete reservation."
        });
    }
});

module.exports = router;
