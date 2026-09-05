const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
    registerValidation,
    loginValidation,
    refreshValidation
} = require('../validators/authValidator');

// Customer Registration
router.post('/register', registerValidation, validate, AuthController.register);

// Customer Login
router.post('/customer/login', loginValidation, validate, AuthController.customerLogin);

// Admin Login
router.post('/admin/login', loginValidation, validate, AuthController.adminLogin);

module.exports = router;
