const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createAdminValidation } = require('../validators/authValidator');

// Protected Admin Creation (only accessible by authenticated SUPER_ADMIN)
router.post(
    '/create-admin',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN'),
    createAdminValidation,
    validate,
    AdminController.createAdmin
);

// Fetch all active admins
router.get(
    '/fetch-active-admins',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN'),
    AdminController.fetchActiveAdmin
);


// Fetch all inactive admins
router.get(
    '/fetch-inactive-admins',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN'),
    AdminController.fetchInactiveAdmin
);

module.exports = router;
