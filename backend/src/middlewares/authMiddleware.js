const { verifyAccessToken } = require('../utils/tokenUtils');

// Authenticate requests using JWT access token in Authorization header
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide a valid Bearer token.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_EXPIRED',
                message: 'Access token has expired. Please refresh your token.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid access token.'
        });
    }
};

// Role-based access control for routes
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] role(s).`
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorizeRoles
};
