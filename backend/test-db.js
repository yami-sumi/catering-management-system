const pool = require("./db");

async function testConnection() {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database"
        );

        console.log("Database connected successfully!");
        console.log("Connected database:", result.rows[0].database);
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testConnection();