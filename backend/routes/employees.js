const express = require("express");
const router = express.Router();
const pool = require("../db");
const { sendDbError } = require("../utils/dbError");

const text = (v) => (typeof v === "string" ? v.trim() : "");

// GET all employees
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employee ORDER BY employee_id ASC");
        res.json(result.rows);
    } catch (error) {
        return sendDbError(res, error, "Failed to retrieve employees.");
    }
});

// GET employee by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employee WHERE employee_id = $1", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Employee not found." });
        res.json(result.rows[0]);
    } catch (error) {
        return sendDbError(res, error, "Failed to retrieve employee.");
    }
});

// POST - Add employee
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, position, phone, email } = req.body;
        if (!text(first_name) || !text(last_name) || !text(position)) {
            return res.status(400).json({ message: "First name, last name and position are required." });
        }
        const result = await pool.query(
            `INSERT INTO employee (first_name, last_name, position, phone, email)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [text(first_name), text(last_name), text(position), phone || null, text(email) || null]
        );
        res.status(201).json({ message: "Employee added successfully!", employee: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to add employee.");
    }
});

// PUT - Update employee
router.put("/:id", async (req, res) => {
    try {
        const { first_name, last_name, position, phone, email } = req.body;
        if (!text(first_name) || !text(last_name) || !text(position)) {
            return res.status(400).json({ message: "First name, last name and position are required." });
        }
        const result = await pool.query(
            `UPDATE employee SET first_name = $1, last_name = $2, position = $3, phone = $4, email = $5
             WHERE employee_id = $6 RETURNING *`,
            [text(first_name), text(last_name), text(position), phone || null, text(email) || null, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Employee not found." });
        res.json({ message: "Employee updated successfully!", employee: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to update employee.");
    }
});

// DELETE - Remove employee
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM employee WHERE employee_id = $1 RETURNING *", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Employee not found." });
        res.json({ message: "Employee deleted successfully!", employee: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to delete employee.");
    }
});

module.exports = router;
