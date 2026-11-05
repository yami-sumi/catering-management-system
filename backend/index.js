const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/customer-portal", customerPortalRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/event-assignments", eventAssignmentRoutes);
app.use("/api/cancellations", cancellationRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reservation-menu", reservationMenuRoutes);

// Web interface (static files in backend/public)
app.use(express.static(path.join(__dirname, "public")));

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