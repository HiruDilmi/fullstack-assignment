const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Hash a password using bcrypt (used by seedAdmin)
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Compare plain text password with stored hash
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate a cryptographically secure random password (uppercase, lowercase, digit, symbol included)
const generateRandomPassword = (length = 10) => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length];
    }
    return password;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateRandomPassword
};
