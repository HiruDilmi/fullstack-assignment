const UserModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/tokenUtils');

class AuthController {
    // Admin Login
    // POST /api/auth/admin/login
    static async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email.'
                });
            }

            const isPasswordValid = await comparePassword(password, user.password);
            console.log(password);
            console.log(user.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password.'
                });
            }

            if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Only administrators are permitted to log in through this portal.'
                });
            }

            if (user.status !== 1 && user.status !== '1' && user.status !== 'ACTIVE') {
                return res.status(403).json({
                    success: false,
                    message: 'Account is inactive. Please contact a Super Administrator.'
                });
            }

            const payload = {
                userId: user.user_id,
                email: user.email,
                role: user.role
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken({ userId: user.user_id });

            await UserModel.updateRefreshToken(user.user_id, refreshToken);

            return res.status(200).json({
                success: true,
                message: 'Admin logged in successfully.',
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: user.user_id,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Customer Registration
    // POST /api/auth/customer/register
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;

            const hashedPassword = await hashPassword(password);
            const userId = await UserModel.create({
                email,
                password: hashedPassword,
                role: 'CUSTOMER',
                status: 1
            });

            return res.status(201).json({
                success: true,
                message: 'Customer registered successfully.',
                data: {
                    userId,
                    email,
                    role: 'CUSTOMER'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Customer Login
    // POST /api/auth/customer/login
    static async customerLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email.'
                });
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password.'
                });
            }

            if (user.role !== 'CUSTOMER') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Only customers are permitted to log in through this portal.'
                });
            }

            const payload = {
                userId: user.user_id,
                email: user.email,
                role: user.role
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken({ userId: user.user_id });

            await UserModel.updateRefreshToken(user.user_id, refreshToken);

            return res.status(200).json({
                success: true,
                message: 'Customer logged in successfully.',
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: user.user_id,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Token Refresh
    // POST /api/auth/refresh
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;

            let decoded;
            try {
                decoded = verifyRefreshToken(refreshToken);
            } catch (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired refresh token.'
                });
            }

            const user = await UserModel.findById(decoded.userId);
            if (!user || user.refresh_token !== refreshToken) {
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token is invalid or revoked.'
                });
            }

            const newAccessToken = generateAccessToken({
                userId: user.user_id,
                email: user.email,
                role: user.role
            });

            return res.status(200).json({
                success: true,
                message: 'Access token refreshed successfully.',
                data: {
                    accessToken: newAccessToken
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Logout
    // POST /api/auth/logout
    static async logout(req, res, next) {
        try {
            if (req.user && req.user.userId) {
                await UserModel.clearRefreshToken(req.user.userId);
            }

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully.'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;