
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all event assignments
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM event_assignment
             ORDER BY reservation_id ASC, employee_id ASC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching event assignments:", error.message);
        res.status(500).json({
            message: "Failed to retrieve event assignments."
        });
    }
});

// GET assignment by reservation ID and employee ID
router.get("/:reservation_id/:employee_id", async (req, res) => {
    try {
        const { reservation_id, employee_id } = req.params;

        const result = await pool.query(
            `SELECT * FROM event_assignment
             WHERE reservation_id = $1 AND employee_id = $2`,
            [reservation_id, employee_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Event assignment not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching assignment:", error.message);
        res.status(500).json({
            message: "Failed to retrieve event assignment."
        });
    }
});

// POST - Add a new event assignment
router.post("/", async (req, res) => {
    try {
        const { reservation_id, employee_id, assignment_role } = req.body;

        if (!Number.isInteger(reservation_id) || reservation_id <= 0 ||
            !Number.isInteger(employee_id) || employee_id <= 0 ||
            !assignment_role || !assignment_role.trim()) {
            return res.status(400).json({
                message: "Please provide valid reservation_id, employee_id, and assignment_role."
            });
        }

        const result = await pool.query(
            `INSERT INTO event_assignment
             (reservation_id, employee_id, assignment_role)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [reservation_id, employee_id, assignment_role.trim()]
        );

        res.status(201).json({
            message: "Event assignment added successfully!",
            assignment: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding assignment:", error.message);
        res.status(500).json({
            message: "Failed to add event assignment."
        });
    }
});

// PUT - Update an event assignment
router.put("/:reservation_id/:employee_id", async (req, res) => {
    try {
        const { reservation_id, employee_id } = req.params;
        const { assignment_role } = req.body;

        if (!assignment_role || !assignment_role.trim()) {
            return res.status(400).json({
                message: "Please provide a valid assignment_role."
            });
        }

        const result = await pool.query(
            `UPDATE event_assignment
             SET assignment_role = $1
             WHERE reservation_id = $2 AND employee_id = $3
             RETURNING *`,
            [assignment_role.trim(), reservation_id, employee_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Event assignment not found."
            });
        }

        res.json({
            message: "Event assignment updated successfully!",
            assignment: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating assignment:", error.message);
        res.status(500).json({
            message: "Failed to update event assignment."
        });
    }
});

// DELETE - Remove an event assignment
router.delete("/:reservation_id/:employee_id", async (req, res) => {
    try {
        const { reservation_id, employee_id } = req.params;

        const result = await pool.query(
            `DELETE FROM event_assignment
             WHERE reservation_id = $1 AND employee_id = $2
             RETURNING *`,
            [reservation_id, employee_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Event assignment not found."
            });
        }

        res.json({
            message: "Event assignment deleted successfully!",
            assignment: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting assignment:", error.message);
        res.status(500).json({
            message: "Failed to delete event assignment."
        });
    }
});

module.exports = router;
