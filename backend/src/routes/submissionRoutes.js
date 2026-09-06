const express = require('express');
const router = express.Router();

const SubmissionController = require('../controllers/submissionController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
    createSubmissionValidation,
    updateSubmissionValidation
} = require('../validators/submissionValidator');

// Customer Protected: Submit a new form
router.post(
    '/submit',
    authenticate,
    authorizeRoles('CUSTOMER'),
    createSubmissionValidation,
    validate,
    SubmissionController.createSubmission
);

// Admin Protected: Get all submissions (with gender filter & search by name)
router.get(
    '/',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN'),
    SubmissionController.getAllSubmissions
);

// Get own application (Customer or Admin)
router.get(
    '/my-application',
    authenticate,
    authorizeRoles('CUSTOMER', 'ADMIN', 'SUPER_ADMIN'),
    SubmissionController.getMySubmission
);

// Get single submission by ID (Admin or Customer)
router.get(
    '/get-single/:id',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN', 'CUSTOMER'),
    SubmissionController.getSubmissionById
);

// Update a submission (Admin or Application Owner Customer)
router.put(
    '/update/:id',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN', 'CUSTOMER'),
    updateSubmissionValidation,
    validate,
    SubmissionController.updateSubmission
);

// Admin Protected: Delete a submission
router.delete(
    '/delete/:id',
    authenticate,
    authorizeRoles('ADMIN', 'SUPER_ADMIN'),
    SubmissionController.deleteSubmission
);

module.exports = router;
