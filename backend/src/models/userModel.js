const pool = require('../config/db');

class UserModel {
    // Find a user by email address
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT user_id, email, password, role, refresh_token, status, created_at FROM users WHERE email = ? LIMIT 1',
            [email]
        );
        return rows[0] || null;
    }

    // Find a user by user_id
    static async findById(userId) {
        const [rows] = await pool.query(
            'SELECT user_id, email, role, refresh_token, status, created_at FROM users WHERE user_id = ? LIMIT 1',
            [userId]
        );
        return rows[0] || null;
    }

    // Create a new user
    static async create({ email, password, role = 'CUSTOMER', status = 'ACTIVE' }) {
        const [result] = await pool.query(
            'INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)',
            [email, password, role, status]
        );
        return result.insertId;
    }

    // Store or update refresh token for a user
    static async updateRefreshToken(userId, refreshToken) {
        await pool.query(
            'UPDATE users SET refresh_token = ? WHERE user_id = ?',
            [refreshToken, userId]
        );
    }

    // Remove refresh token on logout
    static async clearRefreshToken(userId) {
        await pool.query(
            'UPDATE users SET refresh_token = NULL WHERE user_id = ?',
            [userId]
        );
    }
}

module.exports = UserModel;
