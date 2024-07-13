const express = require('express');
const router = express.Router();

// Mock author password stored in an environment variable
const AUTHOR_PASSWORD = process.env.AUTHOR_PASSWORD || 'authorPassword';

/**
 * @desc Display the login page
 */
router.get('/', (req, res) => {
    res.render('login');
});

/**
 * @desc Handle login form submission
 */
router.post('/', (req, res) => {
    const { password } = req.body;

    if (password === AUTHOR_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/author/home');
    } else {
        res.render('login', { error: 'Invalid password' });
    }
});

module.exports = router;
