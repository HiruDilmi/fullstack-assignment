const pool = require('../config/db');

class SubmissionModel {
    /**
     * Create a new form submission
     */
    static async create({
        firstName,
        lastName,
        email,
        gender,
        mobileNumber,
        address,
        feedback = null,
        userCreated
    }) {
        const [result] = await pool.query(
            `INSERT INTO submissions 
            (first_name, last_name, email, gender, mobile_number, address, feedback, user_created, date_created) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [firstName, lastName, email, gender, mobileNumber, address, feedback, userCreated]
        );
        return result.insertId;
    }

    /**
     * Find a submission by email (for uniqueness check)
     */
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT submission_id, email FROM submissions WHERE email = ? LIMIT 1',
            [email]
        );
        return rows[0] || null;
    }

    /**
     * Find a submission by ID
     */
    static async findById(submissionId) {
        const [rows] = await pool.query(
            `SELECT s.submission_id, s.first_name, s.last_name, s.email, s.gender, 
                    s.mobile_number, s.address, s.feedback,
                    s.user_created, uc.email AS user_created_email, s.date_created,
                    s.user_modified, um.email AS user_modified_email, s.date_modified
             FROM submissions s
             LEFT JOIN users uc ON s.user_created = uc.user_id
             LEFT JOIN users um ON s.user_modified = um.user_id
             WHERE s.submission_id = ? LIMIT 1`,
            [submissionId]
        );
        return rows[0] || null;
    }

    /**
     * Retrieve all submissions with optional gender filter and name search (case-insensitive partial match)
     */
    static async findAll({ gender, search } = {}) {
        let sql = `
            SELECT s.submission_id, s.first_name, s.last_name, s.email, s.gender, 
                   s.mobile_number, s.address, s.feedback,
                   s.user_created, uc.email AS user_created_email, s.date_created,
                   s.user_modified, um.email AS user_modified_email, s.date_modified
            FROM submissions s
            LEFT JOIN users uc ON s.user_created = uc.user_id
            LEFT JOIN users um ON s.user_modified = um.user_id
            WHERE 1=1
        `;
        const params = [];

        // Filter by gender (MALE, FEMALE, OTHER)
        if (gender) {
            sql += ' AND s.gender = ?';
            params.push(gender.toUpperCase());
        }

        // Search by first_name or last_name (case-insensitive partial match)
        if (search && search.trim() !== '') {
            sql += ' AND (LOWER(s.first_name) LIKE LOWER(?) OR LOWER(s.last_name) LIKE LOWER(?))';
            const searchTerm = `%${search.trim()}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY s.date_created DESC';

        const [rows] = await pool.query(sql, params);
        return rows;
    }

    /**
     * Update a submission by ID
     */
    static async update(submissionId, {
        firstName,
        lastName,
        email,
        gender,
        mobileNumber,
        address,
        feedback,
        userModified
    }) {
        const [result] = await pool.query(
            `UPDATE submissions 
             SET first_name = ?, 
                 last_name = ?, 
                 email = ?, 
                 gender = ?, 
                 mobile_number = ?, 
                 address = ?, 
                 feedback = ?, 
                 user_modified = ?, 
                 date_modified = NOW()
             WHERE submission_id = ?`,
            [firstName, lastName, email, gender, mobileNumber, address, feedback, userModified, submissionId]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete a submission by ID
     */
    static async delete(submissionId) {
        const [result] = await pool.query(
            'DELETE FROM submissions WHERE submission_id = ?',
            [submissionId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = SubmissionModel;
