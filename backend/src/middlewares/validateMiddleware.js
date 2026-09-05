const { validationResult } = require('express-validator');

// Check for express-validator errors and return formatted response
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
};

module.exports = validate;
