const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock author password stored in an environment variable
const AUTHOR_PASSWORD = process.env.AUTHOR_PASSWORD || 'authorPassword';

/**
 * @desc Display the login page 
 * @returns {void} Renders the login.ejs template
 */
router.get('/', (req, res) => {
    res.render('login');
});

/**
 * @desc Handle login form submission
 * @param {string} req.body.password - Password submitted by the user
 * @returns {void} Redirects to the author home page if authenticated, else renders the login page with an error message
 */
router.post('/',
    body('password').isString().trim().escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { password } = req.body;

        if (password === AUTHOR_PASSWORD) {
            req.session.isAuthenticated = true;
            res.redirect('/author/home');
        } else {
            res.render('login', { error: 'Invalid password' });
        }
    }
);
module.exports = router;
