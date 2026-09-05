const { body } = require('express-validator');
const UserModel = require('../models/userModel');

const registerValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                throw new Error('Email is already registered.');
            }
            return true;
        }),

    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.'),

    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required.')
];

const refreshValidation = [
    body('refreshToken')
        .notEmpty().withMessage('Refresh token is required.')
];

const createAdminValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                throw new Error('Email is already registered.');
            }
            return true;
        })
];

module.exports = {
    registerValidation,
    loginValidation,
    refreshValidation,
    createAdminValidation
};
