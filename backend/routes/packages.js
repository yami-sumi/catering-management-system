const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all packages
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM package ORDER BY package_id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching packages:", error.message);
        res.status(500).json({
            message: "Failed to retrieve packages."
        });
    }
});

// POST - Add a new package
router.post("/", async (req, res) => {
    try {
        const { package_name, description, price_per_guest } = req.body;

        const result = await pool.query(
            `INSERT INTO package
            (package_name, description, price_per_guest)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [package_name, description, price_per_guest]
        );

        res.status(201).json({
            message: "Package added successfully!",
            package: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding package:", error.message);
        res.status(500).json({
            message: "Failed to add package."
        });
    }
});

// PUT - Update an existing package
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { package_name, description, price_per_guest } = req.body;

        const result = await pool.query(
            `UPDATE package
             SET package_name = $1,
                 description = $2,
                 price_per_guest = $3
             WHERE package_id = $4
             RETURNING *`,
            [package_name, description, price_per_guest, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Package not found."
            });
        }

        res.json({
            message: "Package updated successfully!",
            package: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating package:", error.message);
        res.status(500).json({
            message: "Failed to update package."
        });
    }
});

// DELETE - Remove a package
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM package
             WHERE package_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Package not found."
            });
        }

        res.json({
            message: "Package deleted successfully!",
            package: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting package:", error.message);
        res.status(500).json({
            message: "Failed to delete package."
        });
    }
});

module.exports = router;