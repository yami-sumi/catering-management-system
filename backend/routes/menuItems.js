
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all menu items
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM menu_item ORDER BY menu_item_id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching menu items:", error.message);
        res.status(500).json({
            message: "Failed to retrieve menu items."
        });
    }
});

// GET menu item by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM menu_item WHERE menu_item_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Menu item not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching menu item:", error.message);
        res.status(500).json({
            message: "Failed to retrieve menu item."
        });
    }
});

// POST - Add a new menu item
router.post("/", async (req, res) => {
    try {
        const { item_name, description, category, price } = req.body;

        const result = await pool.query(
            `INSERT INTO menu_item
            (item_name, description, category, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [item_name, description, category, price]
        );

        res.status(201).json({
            message: "Menu item added successfully!",
            menuItem: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding menu item:", error.message);
        res.status(500).json({
            message: "Failed to add menu item."
        });
    }
});

// PUT - Update menu item
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, description, category, price } = req.body;

        const result = await pool.query(
            `UPDATE menu_item
             SET item_name = $1,
                 description = $2,
                 category = $3,
                 price = $4
             WHERE menu_item_id = $5
             RETURNING *`,
            [item_name, description, category, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Menu item not found."
            });
        }

        res.json({
            message: "Menu item updated successfully!",
            menuItem: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating menu item:", error.message);
        res.status(500).json({
            message: "Failed to update menu item."
        });
    }
});

// DELETE - Remove menu item
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM menu_item
             WHERE menu_item_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Menu item not found."
            });
        }

        res.json({
            message: "Menu item deleted successfully!",
            menuItem: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting menu item:", error.message);
        res.status(500).json({
            message: "Failed to delete menu item."
        });
    }
});

module.exports = router;
