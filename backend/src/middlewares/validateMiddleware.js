const { validationResult } = require('express-validator');

// Check for express-validator errors and return formatted response
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg
        }));

        // Provide the specific validation message as the primary message
        const primaryMessage = formattedErrors.length > 0 
            ? formattedErrors[0].message 
            : 'Validation failed';

        return res.status(400).json({
            success: false,
            message: primaryMessage,
            errors: formattedErrors
        });
    }
    next();
};

module.exports = validate;
