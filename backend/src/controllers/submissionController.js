const SubmissionModel = require('../models/submissionModel');

class SubmissionController {
    /**
     * Submit a form (Customer Protected)
     * POST /api/submissions
     */
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

    /**
     * Get all submissions with search and filter (Admin Protected)
     * GET /api/submissions?gender=MALE&search=john
     */
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

    /**
     * Get single submission by ID
     * GET /api/submissions/:id
     */
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

    /**
     * Update a submission (Admin Protected)
     * PUT /api/submissions/:id
     */
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

            await SubmissionModel.update(id, {
                firstName: firstName ?? existing.first_name,
                lastName: lastName ?? existing.last_name,
                email: email ?? existing.email,
                gender: gender ?? existing.gender,
                mobileNumber: mobileNumber ?? existing.mobile_number,
                address: address ?? existing.address,
                feedback: feedback !== undefined ? feedback : existing.feedback,
                userModified
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

    /**
     * Delete a submission (Admin Protected)
     * DELETE /api/submissions/:id
     */
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
