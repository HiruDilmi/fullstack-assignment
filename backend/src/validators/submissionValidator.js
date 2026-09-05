const { body, param } = require('express-validator');
const SubmissionModel = require('../models/submissionModel');

// Regular expression for local mobile numbers (e.g. 07XXXXXXXX or +947XXXXXXXX)
const MOBILE_REGEX = /^(?:\+94|0)?[0-9]{9,10}$/;

const createSubmissionValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required.')
        .isLength({ max: 100 }).withMessage('First name cannot exceed 100 characters.'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required.')
        .isLength({ max: 100 }).withMessage('Last name cannot exceed 100 characters.'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail()
        .custom(async (email) => {
            const existing = await SubmissionModel.findByEmail(email);
            if (existing) {
                throw new Error('A submission with this email address already exists.');
            }
            return true;
        }),

    body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required.')
        .toUpperCase()
        .isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER.'),

    body('mobileNumber')
        .trim()
        .notEmpty().withMessage('Mobile number is required.')
        .matches(MOBILE_REGEX).withMessage('Please provide a valid mobile number (e.g. 0712345678 or +94712345678).'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required.')
        .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters.'),

    body('feedback')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage('Feedback cannot exceed 1000 characters.')
];

const updateSubmissionValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid submission ID.'),

    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required.')
        .isLength({ max: 100 }).withMessage('First name cannot exceed 100 characters.'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required.')
        .isLength({ max: 100 }).withMessage('Last name cannot exceed 100 characters.'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const existing = await SubmissionModel.findByEmail(email);
            // If exists and belongs to a different submission, throw conflict error
            if (existing && existing.submission_id !== parseInt(req.params.id, 10)) {
                throw new Error('A submission with this email address already exists.');
            }
            return true;
        }),

    body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required.')
        .toUpperCase()
        .isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER.'),

    body('mobileNumber')
        .trim()
        .notEmpty().withMessage('Mobile number is required.')
        .matches(MOBILE_REGEX).withMessage('Please provide a valid mobile number (e.g. 0712345678 or +94712345678).'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required.')
        .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters.'),

    body('feedback')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage('Feedback cannot exceed 1000 characters.')
];

module.exports = {
    createSubmissionValidation,
    updateSubmissionValidation
};
