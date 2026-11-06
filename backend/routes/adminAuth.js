
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// POST - Admin login
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const result = await pool.query(
            `SELECT admin_id, username, password_hash
             FROM admin
             WHERE username = $1`,
            [username.trim()]
        );

        const admin = result.rows[0];

        if (!admin || !(await bcrypt.compare(
            password,
            admin.password_hash
        ))) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Regenerate session to prevent session fixation
        req.session.regenerate((err) => {
            if (err) return next(err);

            req.session.adminId = admin.admin_id;
            req.session.adminUsername = admin.username;

            req.session.save((err) => {
                if (err) return next(err);

                res.json({
                    message: "Login successful!",
                    admin: {
                        admin_id: admin.admin_id,
                        username: admin.username
                    }
                });
            });
        });

    } catch (error) {
        next(error);
    }
});

// GET - Check admin session
router.get("/me", (req, res) => {
    if (!req.session.adminId) {
        return res.status(401).json({
            message: "Not authenticated."
        });
    }

    res.json({
        admin_id: req.session.adminId,
        username: req.session.adminUsername
    });
});

// POST - Admin logout
router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("catering.admin.sid", {
            path: "/"
        });

        res.json({
            message: "Logged out successfully."
        });
    });
});

module.exports = router;
