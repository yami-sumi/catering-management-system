
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all inventory items
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM inventory ORDER BY inventory_id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching inventory:", error.message);
        res.status(500).json({
            message: "Failed to retrieve inventory."
        });
    }
});

// GET inventory item by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM inventory WHERE inventory_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching inventory item:", error.message);
        res.status(500).json({
            message: "Failed to retrieve inventory item."
        });
    }
});

// POST - Add a new inventory item
router.post("/", async (req, res) => {
    try {
        const {
            item_name,
            unit,
            quantity,
            availability_status
        } = req.body;

        if (!item_name || !unit || quantity === undefined ||
            !Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Please provide a valid item name, unit, and non-negative whole-number quantity."
            });
        }

        const result = await pool.query(
            `INSERT INTO inventory
            (item_name, unit, quantity, availability_status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                item_name,
                unit,
                quantity,
                availability_status || "Available"
            ]
        );

        res.status(201).json({
            message: "Inventory item added successfully!",
            inventory: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding inventory item:", error.message);
        res.status(500).json({
            message: "Failed to add inventory item."
        });
    }
});

// PUT - Update an inventory item
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            item_name,
            unit,
            quantity,
            availability_status
        } = req.body;

        if (!item_name || !unit || quantity === undefined ||
            !Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Please provide a valid item name, unit, and non-negative whole-number quantity."
            });
        }

        const result = await pool.query(
            `UPDATE inventory
             SET item_name = $1,
                 unit = $2,
                 quantity = $3,
                 availability_status = COALESCE($4, availability_status)
             WHERE inventory_id = $5
             RETURNING *`,
            [
                item_name,
                unit,
                quantity,
                availability_status || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        res.json({
            message: "Inventory item updated successfully!",
            inventory: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating inventory item:", error.message);
        res.status(500).json({
            message: "Failed to update inventory item."
        });
    }
});

// DELETE - Remove an inventory item
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM inventory
             WHERE inventory_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        res.json({
            message: "Inventory item deleted successfully!",
            inventory: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting inventory item:", error.message);
        res.status(500).json({
            message: "Failed to delete inventory item."
        });
    }
});

module.exports = router;
