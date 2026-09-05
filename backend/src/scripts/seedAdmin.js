const dotenv = require('dotenv');
dotenv.config();

const pool = require('../config/db');
const { hashPassword } = require('../utils/passwordUtils');

async function seedAdmin() {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@1234';

    try {
        console.log(`Checking if admin '${adminEmail}' already exists...`);
        const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [adminEmail]);

        if (existing.length > 0) {
            console.log(`Admin account '${adminEmail}' already exists (User ID: ${existing[0].user_id}).`);
            process.exit(0);
        }

        const hashedPassword = await hashPassword(adminPassword);
        const [result] = await pool.query(
            'INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)',
            [adminEmail, hashedPassword, 'ADMIN', 'ACTIVE']
        );

        console.log(`\n Successfully seeded initial Admin:`);
        console.log(`Email:    ${adminEmail}\nPassword: ${adminPassword}\nUser ID: ${result.insertId}\n`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
