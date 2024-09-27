const express = require('express');
const router = express.Router();

// Handle GET request for the registration form
router.get('/register', (req, res) => {
    res.send('Registration form goes here'); // Render your registration form here
});

// Handle POST request for registration
router.post('/register', (req, res) => {
    // Handle registration logic
    const { username, password } = req.body;
    // Save user to database logic here
    res.send('Registration successful!');
});

// Export the router
module.exports = router;
