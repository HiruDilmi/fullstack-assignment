const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { hashPassword } = require('../utils/passwordUtils');

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'full-stack-assignment';

async function initializeDatabase() {
    let connection;
    try {
        console.log(`[DB Init] Connecting to MySQL at ${dbHost}:${dbPort}...`);

        connection = await mysql.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPassword,
            multipleStatements: true
        });

        // Ensure database exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        console.log(`[DB Init] Database '${dbName}' ensured.`);

        // Select database
        await connection.query(`USE \`${dbName}\`;`);

        // Execute database/schema.sql if it exists
        const schemaPath = path.join(__dirname, '../../../database/schema.sql');
        if (fs.existsSync(schemaPath)) {
            console.log(`[DB Init] Applying schema from database/schema.sql...`);
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await connection.query(schemaSql);
            console.log(`[DB Init] Schema applied successfully from schema.sql.`);
        } else {
            // Fallback: Inline default tables
            console.log(`[DB Init] Applying fallback inline schema...`);
            await connection.query(`
                CREATE TABLE IF NOT EXISTS \`users\` (
                  \`user_id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`email\` varchar(100) NOT NULL,
                  \`password\` varchar(255) NOT NULL,
                  \`role\` enum('CUSTOMER','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'CUSTOMER',
                  \`refresh_token\` text DEFAULT NULL,
                  \`status\` tinyint(1) NOT NULL DEFAULT 1,
                  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
                  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                  PRIMARY KEY (\`user_id\`),
                  UNIQUE KEY \`uq_users_email\` (\`email\`(100))
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

                CREATE TABLE IF NOT EXISTS \`submissions\` (
                  \`submission_id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`first_name\` varchar(100) NOT NULL,
                  \`last_name\` varchar(100) NOT NULL,
                  \`email\` varchar(100) NOT NULL,
                  \`gender\` enum('MALE','FEMALE','OTHER') NOT NULL,
                  \`mobile_number\` varchar(20) NOT NULL,
                  \`address\` text NOT NULL,
                  \`feedback\` text DEFAULT NULL,
                  \`user_created\` int(11) DEFAULT NULL,
                  \`date_created\` timestamp NOT NULL DEFAULT current_timestamp(),
                  \`user_modified\` int(11) DEFAULT NULL,
                  \`date_modified\` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                  PRIMARY KEY (\`submission_id\`),
                  KEY \`idx_submissions_user_created\` (\`user_created\`),
                  KEY \`idx_submissions_user_modified\` (\`user_modified\`),
                  CONSTRAINT \`fk_submissions_user_created\` FOREIGN KEY (\`user_created\`) REFERENCES \`users\` (\`user_id\`) ON DELETE SET NULL ON UPDATE CASCADE,
                  CONSTRAINT \`fk_submissions_user_modified\` FOREIGN KEY (\`user_modified\`) REFERENCES \`users\` (\`user_id\`) ON DELETE SET NULL ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            `);
            console.log(`[DB Init] Fallback tables created/verified.`);
        }

        // Seed default Super Admin account if none exists
        const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'superadmin@example.com';
        const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'SuperAdmin@123';

        const [adminRows] = await connection.query('SELECT user_id FROM users WHERE email = ?', [adminEmail]);

        if (adminRows.length === 0) {
            const hashedPassword = await hashPassword(adminPassword);
            const [result] = await connection.query(
                'INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)',
                [adminEmail, hashedPassword, 'SUPER_ADMIN', 1]
            );
            console.log(`Initial Super Admin seeded successfully:`);
            console.log(`         Email:    ${adminEmail}`);
            console.log(`         Password: ${adminPassword}`);
            console.log(`         User ID:  ${result.insertId}`);
        } else {
            console.log(`Super Admin '${adminEmail}' already exists.`);
        }

        console.log('Database initialization completed successfully.\n');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Database setup complete.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Fatal DB setup error:', err);
            process.exit(1);
        });
}

module.exports = initializeDatabase;
