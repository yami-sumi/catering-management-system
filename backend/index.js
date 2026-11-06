const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const requireAdmin = require("./middleware/requireAdmin");


const pool = require("./db");
const customerRoutes = require("./routes/customers");
const packageRoutes = require("./routes/packages");
const menuItemRoutes = require("./routes/menuItems");
const reservationRoutes = require("./routes/reservations");
const paymentRoutes = require("./routes/payments");
const inventoryRoutes = require("./routes/inventory");
const eventAssignmentRoutes = require("./routes/eventAssignments");
const cancellationRoutes = require("./routes/cancellations");
const employeeRoutes = require("./routes/employees");
const reservationMenuRoutes = require("./routes/reservationMenu");
const customerPortalRoutes = require("./routes/customerPortal");
const adminAuthRoutes = require("./routes/adminAuth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());


if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing from .env");
}

app.use(session({
    store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true
    }),
    name: "catering.admin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 2
    }
}));



// Public authentication routes
app.use("/api/admin", adminAuthRoutes);

// Customer Portal routes remain accessible
app.use("/api/customer-portal", customerPortalRoutes);

// Protected Staff Dashboard routes
app.use("/api/customers", requireAdmin, customerRoutes);
app.use("/api/packages", requireAdmin, packageRoutes);
app.use("/api/menu-items", requireAdmin, menuItemRoutes);
app.use("/api/reservations", requireAdmin, reservationRoutes);
app.use("/api/payments", requireAdmin, paymentRoutes);
app.use("/api/inventory", requireAdmin, inventoryRoutes);
app.use("/api/event-assignments", requireAdmin, eventAssignmentRoutes);
app.use("/api/cancellations", requireAdmin, cancellationRoutes);
app.use("/api/employees", requireAdmin, employeeRoutes);
app.use("/api/reservation-menu", requireAdmin, reservationMenuRoutes);

// Web interface (static files in frontend)
// Serve frontend files

const frontendPath = path.join(__dirname, "../frontend");

// Protect the dashboard entry page
app.get(["/", "/index.html"], (req, res) => {
    if (!req.session || !req.session.adminId) {
        return res.redirect("/admin-login.html");
    }

    res.sendFile(path.join(frontendPath, "index.html"));
});

// Serve frontend assets and the customer portal
app.use(express.static(frontendPath, {
    index: false
}));


// Database test route
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database"
        );

        res.json({
            message: "Database connected successfully!",
            database: result.rows[0].database
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Database connection failed."
        });
    }
});

// Unknown API routes and malformed JSON bodies -> JSON responses
app.use("/api", (req, res) => {
    res.status(404).json({ message: "API route not found." });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Request body is not valid JSON." });
    }
    console.error(err.message);
    res.status(500).json({ message: "Unexpected server error." });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});