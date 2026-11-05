
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const cfg = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const dbName = process.env.DB_NAME || "catering_management_db";
const dbDir = path.join(__dirname, "..", "..", "database");

async function main() {
    if (!cfg.user || !cfg.password) {
        throw new Error(
            "Set DB_USER and DB_PASSWORD in backend/.env."
        );
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(dbName)) {
        throw new Error("Invalid database name.");
    }

    if (["postgres", "template0", "template1"].includes(dbName)) {
        throw new Error("Cannot install into a system database.");
    }

    let admin;
    let db;

    try {
        admin = new Client({
            ...cfg,
            database: "postgres"
        });

        await admin.connect();

        const exists = await admin.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [dbName]
        );

        if (exists.rowCount === 0) {
            await admin.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Created database: ${dbName}`);
        } else {
            console.log(`Database exists: ${dbName}`);
        }

        await admin.end();
        admin = null;

        db = new Client({
            ...cfg,
            database: dbName
        });

        await db.connect();

        const tables = await db.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
        `);

        if (tables.rowCount > 0) {
            throw new Error(
                "Database already contains tables. " +
                "Setup cancelled to protect existing data."
            );
        }

        const schema = fs.readFileSync(
            path.join(dbDir, "schema.sql"),
            "utf8"
        );

        const seed = fs.readFileSync(
            path.join(dbDir, "seed.sql"),
            "utf8"
        );

        await db.query("BEGIN");

        try {
            await db.query(schema);
            console.log("Schema installed.");

            if (!process.argv.includes("--no-seed")) {
                const seedWithoutTransaction = seed
                    .replace(/^\s*BEGIN\s*;/i, "")
                    .replace(/COMMIT\s*;\s*$/i, "");

                await db.query(seedWithoutTransaction);
                    console.log("Sample data installed.");
            }

            await db.query("COMMIT");
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        }

        console.log("Database setup completed successfully!");
        console.log("Start the backend using: npm start");

    } finally {
        if (db) await db.end();
        if (admin) await admin.end();
    }
}

main().catch(error => {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
});
