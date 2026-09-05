const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_access_secret_for_dev_only';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_for_dev_only';

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

// Generate JWT access token
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
};

// Generate JWT refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
};

// Verify JWT access token
const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

// Verify JWT refresh token
const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
