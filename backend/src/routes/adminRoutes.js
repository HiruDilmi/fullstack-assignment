const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createAdminValidation } = require('../validators/authValidator');

// Protected Admin Creation (only accessible by authenticated ADMIN)
router.post(
    '/create-admin',
    authenticate,
    authorizeRoles('ADMIN'),
    createAdminValidation,
    validate,
    AdminController.createAdmin
);

module.exports = router;
