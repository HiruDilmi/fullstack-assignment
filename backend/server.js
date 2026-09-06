// server.js
const app = require('./src/app');
const pool = require('./src/config/db');
const initializeDatabase = require('./src/scripts/initDb');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Automatically ensure DB, tables, and default Super Admin exist
        await initializeDatabase();

        // Verify pool connection
        const connection = await pool.getConnection();
        console.log('Connected to MySQL Database via pool.');
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Database connection / initialization failed:', err.message);
        process.exit(1);
    }
}

startServer();