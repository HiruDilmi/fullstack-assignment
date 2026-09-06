const SubmissionModel = require('../models/submissionModel');

class SubmissionController {
    // Submit a form (Customer Protected)
    // POST /api/submissions/submit
    static async createSubmission(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                email,
                gender,
                mobileNumber,
                address,
                feedback
            } = req.body;

            const userCreated = req.user.userId;

            const submissionId = await SubmissionModel.create({
                firstName,
                lastName,
                email,
                gender,
                mobileNumber,
                address,
                feedback,
                userCreated
            });

            const createdSubmission = await SubmissionModel.findById(submissionId);

            return res.status(201).json({
                success: true,
                message: 'Form submitted successfully.',
                data: {
                    submission: createdSubmission
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all submissions with search and filter (Admin Protected)
    // GET /api/submissions?gender=?&search=?
    static async getAllSubmissions(req, res, next) {
        try {
            const { gender, search } = req.query;

            const submissions = await SubmissionModel.findAll({ gender, search });

            return res.status(200).json({
                success: true,
                message: 'Submissions retrieved successfully.',
                count: submissions.length,
                data: {
                    submissions
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get own submission for logged in customer
    // GET /api/submissions/my-application
    static async getMySubmission(req, res, next) {
        try {
            const userId = req.user.userId;
            const email = req.user.email;

            let submission = await SubmissionModel.findByUserIdOrEmail(userId, email);

            if (submission && !submission.user_created && userId) {
                await SubmissionModel.linkUserCreated(submission.submission_id, userId);
                submission.user_created = userId;
            }

            return res.status(200).json({
                success: true,
                data: {
                    submission: submission || null,
                    hasSubmission: Boolean(submission)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single submission by ID
    // GET /api/submissions/get-single/:id
    static async getSubmissionById(req, res, next) {
        try {
            const { id } = req.params;

            const submission = await SubmissionModel.findById(id);
            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: `Submission with ID ${id} not found.`
                });
            }

            // If the user is a CUSTOMER, ensure they own this submission
            if (req.user.role === 'CUSTOMER') {
                const isOwner =
                    Number(submission.user_created) === Number(req.user.userId) ||
                    (submission.email && req.user.email && submission.email.toLowerCase() === req.user.email.toLowerCase());

                if (!isOwner) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied. You can only view your own application.'
                    });
                }
            }

            return res.status(200).json({
                success: true,
                data: {
                    submission
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Update a submission (Admin or Application Owner)
    // PUT /api/submissions/update/:id
    static async updateSubmission(req, res, next) {
        try {
            const { id } = req.params;

            const existing = await SubmissionModel.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: `Submission with ID ${id} not found.`
                });
            }

            // If the user is a CUSTOMER, ensure they own this submission
            if (req.user.role === 'CUSTOMER') {
                const isOwner =
                    Number(existing.user_created) === Number(req.user.userId) ||
                    (existing.email && req.user.email && existing.email.toLowerCase() === req.user.email.toLowerCase());

                if (!isOwner) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied. You can only update your own application.'
                    });
                }
            }

            const {
                firstName,
                lastName,
                email,
                gender,
                mobileNumber,
                address,
                feedback
            } = req.body;

            const userModified = req.user.userId;
            const userCreated = req.user.userId;

            await SubmissionModel.update(id, {
                firstName: firstName ?? existing.first_name,
                lastName: lastName ?? existing.last_name,
                email: email ?? existing.email,
                gender: gender ?? existing.gender,
                mobileNumber: mobileNumber ?? existing.mobile_number,
                address: address ?? existing.address,
                feedback: feedback !== undefined ? feedback : existing.feedback,
                userModified,
                userCreated
            });

            const updatedSubmission = await SubmissionModel.findById(id);

            return res.status(200).json({
                success: true,
                message: 'Submission updated successfully.',
                data: {
                    submission: updatedSubmission
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a submission (Admin Protected)
    // DELETE /api/submissions/delete/:id
    static async deleteSubmission(req, res, next) {
        try {
            const { id } = req.params;

            const existing = await SubmissionModel.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: `Submission with ID ${id} not found.`
                });
            }

            await SubmissionModel.delete(id);

            return res.status(200).json({
                success: true,
                message: `Submission with ID ${id} deleted successfully.`
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SubmissionController;
