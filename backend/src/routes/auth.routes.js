const express = require('express');
const router = express.Router();

// Placeholder auth routes
router.get('/', (req, res) => {
    res.json({ message: 'Auth routes initialized' });
});

module.exports = router;
