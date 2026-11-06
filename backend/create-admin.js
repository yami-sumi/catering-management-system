
require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./db");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    try {
        const username = await new Promise(resolve =>
            rl.question("Admin username: ", resolve)
        );

        const password = await new Promise(resolve =>
            rl.question("Admin password: ", resolve)
        );

        if (!username.trim() || password.length < 12) {
            throw new Error("Username is required and password must be at least 12 characters.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO admin (username, password_hash)
             VALUES ($1, $2)`,
            [username.trim(), passwordHash]
        );

        console.log("Admin account created successfully!");
    } catch (error) {
        console.error("Failed to create admin:", error.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

createAdmin();
