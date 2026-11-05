const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all customers
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT customer_id, first_name, last_name, email, phone, address FROM customer ORDER BY customer_id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching customers:", error.message);

        res.status(500).json({
            message: "Failed to retrieve customers."
        });
    }
});

// POST - Add a new customer
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address } = req.body;

        const result = await pool.query(
            `INSERT INTO customer
            (first_name, last_name, email, phone, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING customer_id, first_name, last_name, email, phone, address`,
            [first_name, last_name, email, phone, address]
        );

        res.status(201).json({
            message: "Customer added successfully!",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding customer:", error.message);

        res.status(500).json({
            message: "Failed to add customer."
        });
    }
});

// PUT - Update an existing customer
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone, address } = req.body;

        const result = await pool.query(
            `UPDATE customer
             SET first_name = $1,
                 last_name = $2,
                 email = $3,
                 phone = $4,
                 address = $5
             WHERE customer_id = $6
             RETURNING customer_id, first_name, last_name, email, phone, address`,
            [first_name, last_name, email, phone, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found."
            });
        }

        res.json({
            message: "Customer updated successfully!",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating customer:", error.message);
        res.status(500).json({
            message: "Failed to update customer."
        });
    }
});

// DELETE - Remove a customer
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM customer
             WHERE customer_id = $1
             RETURNING customer_id, first_name, last_name, email, phone, address`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found."
            });
        }

        res.json({
            message: "Customer deleted successfully!",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting customer:", error.message);
        res.status(500).json({
            message: "Failed to delete customer."
        });
    }
});

module.exports = router;