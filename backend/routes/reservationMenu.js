const express = require("express");
const router = express.Router();
const pool = require("../db");
const { sendDbError } = require("../utils/dbError");

const isPosInt = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

// GET all (optionally ?reservation_id=) with menu item details
router.get("/", async (req, res) => {
    try {
        const params = [];
        let where = "";
        if (req.query.reservation_id !== undefined) {
            if (!isPosInt(req.query.reservation_id)) {
                return res.status(400).json({ message: "reservation_id must be a positive integer." });
            }
            params.push(req.query.reservation_id);
            where = "WHERE rm.reservation_id = $1";
        }
        const result = await pool.query(
            `SELECT rm.*, m.item_name, m.category, m.price, (m.price * rm.quantity) AS line_total
             FROM reservation_menu rm
             JOIN menu_item m ON m.menu_item_id = rm.menu_item_id
             ${where}
             ORDER BY rm.reservation_id, rm.menu_item_id`,
            params
        );
        res.json(result.rows);
    } catch (error) {
        return sendDbError(res, error, "Failed to retrieve reservation menu.");
    }
});

// POST - add a menu item to a reservation
router.post("/", async (req, res) => {
    try {
        const { reservation_id, menu_item_id, quantity } = req.body;
        const qty = quantity === undefined || quantity === "" ? 1 : quantity;
        if (!isPosInt(reservation_id) || !isPosInt(menu_item_id) || !isPosInt(qty)) {
            return res.status(400).json({ message: "reservation_id, menu_item_id and a positive whole-number quantity are required." });
        }
        const result = await pool.query(
            `INSERT INTO reservation_menu (reservation_id, menu_item_id, quantity)
             VALUES ($1, $2, $3) RETURNING *`,
            [reservation_id, menu_item_id, qty]
        );
        res.status(201).json({ message: "Menu item added to reservation!", reservation_menu: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to add menu item to reservation.");
    }
});

// PUT - change quantity
router.put("/:reservation_id/:menu_item_id", async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!isPosInt(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive whole number." });
        }
        const result = await pool.query(
            `UPDATE reservation_menu SET quantity = $1
             WHERE reservation_id = $2 AND menu_item_id = $3 RETURNING *`,
            [quantity, req.params.reservation_id, req.params.menu_item_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Reservation menu entry not found." });
        res.json({ message: "Quantity updated successfully!", reservation_menu: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to update reservation menu.");
    }
});

// DELETE
router.delete("/:reservation_id/:menu_item_id", async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM reservation_menu WHERE reservation_id = $1 AND menu_item_id = $2 RETURNING *`,
            [req.params.reservation_id, req.params.menu_item_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Reservation menu entry not found." });
        res.json({ message: "Menu item removed from reservation!", reservation_menu: result.rows[0] });
    } catch (error) {
        return sendDbError(res, error, "Failed to remove menu item from reservation.");
    }
});

module.exports = router;
