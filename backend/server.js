// server.js
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
pool.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL Database via XAMPP.');
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });