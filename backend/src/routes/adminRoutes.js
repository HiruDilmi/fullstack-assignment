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
    authorizeRoles('SUPER_ADMIN'),
    createAdminValidation,
    validate,
    AdminController.createAdmin
);

// Fetch all active admins (SUPER_ADMIN only)
router.get(
    '/fetch-active-admins',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.fetchActiveAdmin
);


// Fetch all inactive admins (SUPER_ADMIN only)
router.get(
    '/fetch-inactive-admins',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.fetchInactiveAdmin
);

// Inactivate an admin account (only accessible by SUPER_ADMIN)
router.patch(
    '/inactivate-admin/:id',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.inactivateAdmin
);
router.put(
    '/inactivate-admin/:id',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.inactivateAdmin
);

// Activate an admin account (only accessible by SUPER_ADMIN)
router.patch(
    '/activate-admin/:id',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.activateAdmin
);
router.put(
    '/activate-admin/:id',
    authenticate,
    authorizeRoles('SUPER_ADMIN'),
    AdminController.activateAdmin
);

module.exports = router;
