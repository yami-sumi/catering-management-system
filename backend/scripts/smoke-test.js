
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const endpoints = [
    "/api/db-test",
    "/api/customers",
    "/api/packages",
    "/api/menu-items",
    "/api/employees",
    "/api/inventory",
    "/api/reservations",
    "/api/payments",
    "/api/reservation-menu",
    "/api/event-assignments",
    "/api/cancellations"
];

async function runSmokeTest() {
    console.log("Catering Management System - API Smoke Test\n");

    let passed = 0;
    let failed = 0;

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);

            if (response.ok) {
                console.log(`PASS  ${endpoint} (${response.status})`);
                passed++;
            } else {
                console.log(`FAIL  ${endpoint} (${response.status})`);
                failed++;
            }
        } catch (error) {
            console.log(`FAIL  ${endpoint} (${error.message})`);
            failed++;
        }
    }

    console.log("\n---------------------------");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total:  ${endpoints.length}`);

    if (failed > 0) {
        process.exitCode = 1;
    }
}

runSmokeTest();
