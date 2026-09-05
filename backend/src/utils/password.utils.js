const bcrypt = require('bcryptjs');

// Hash a password using bcrypt (used by seedAdmin)
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


module.exports = {
    hashPassword
};
