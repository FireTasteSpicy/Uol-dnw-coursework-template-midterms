/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up session management
app.use(session({
    secret: 'yourSecretKey', // Change this to a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if HTTPS is enabled
}));

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Middleware to protect author routes
function authMiddleware(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/author/login');
    }
}

// Handle requests to the home page 
app.get('/', (req, res) => {
    res.render('main-home');
});

// Add route handlers with middleware
const loginRoutes = require('./routes/login');
app.use('/author/login', loginRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const authorRoutes = require('./routes/author');
app.use('/author', authMiddleware, authorRoutes);

const readerRoutes = require('./routes/reader');
app.use('/reader', readerRoutes);




// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

