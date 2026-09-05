const UserModel = require('../models/userModel');
const { hashPassword, generateRandomPassword } = require('../utils/passwordUtils');

class AdminController {

    //  Create a new Admin account (Protected - accessible by existing Admin)
    //   POST /api/admin/create-admin
    static async createAdmin(req, res, next) {
        try {
            const { email } = req.body;

            // Auto-generate a random password
            const plainPassword = generateRandomPassword(12);
            const hashedPassword = await hashPassword(plainPassword);

            const newAdminId = await UserModel.create({
                email,
                password: hashedPassword,
                role: 'ADMIN',
                status: 1
            });

            return res.status(201).json({
                success: true,
                message: 'Admin account created successfully.',
                data: {
                    userId: newAdminId,
                    email,
                    role: 'ADMIN',
                    generatedPassword: plainPassword
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
