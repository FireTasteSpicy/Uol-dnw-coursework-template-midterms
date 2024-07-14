/**
 * reader.js
 * Routes for the reader's home page and individual article pages
 * This file includes routes for displaying the reader home page,
 * reading individual articles, liking articles, and adding comments.
 */

const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();

/**
 * @desc Display the reader home page with a list of published articles
 * @returns {void} Renders the reader-home.ejs template with a list of published articles
 */
router.get('/home', (req, res, next) => {
    const settingsQuery = "SELECT * FROM settings WHERE id = 1"; // Assuming single row settings table
    const articlesQuery = "SELECT * FROM articles WHERE published_at IS NOT NULL ORDER BY published_at DESC";

    global.db.get(settingsQuery, (err, settings) => {
        if (err) {
            next(err);
        } else {
            global.db.all(articlesQuery, (err, articles) => {
                if (err) {
                    next(err);
                } else {
                    res.render('reader-home', {
                        blogTitle: settings.blog_title,
                        authorName: settings.author_name,
                        articles: articles
                    });
                }
            });
        }
    });
});

/**
 * @desc Display an individual article with comments and like functionality
 * @param {string} req.params.id - ID of the article to be displayed
 * @returns {void} Renders the reader-article.ejs template with the article data and comments
 */
router.get('/article/:id', 
    param('id').isInt().toInt(), 
    (req, res, next) => {
        const articleQuery = "SELECT * FROM articles WHERE article_id = ?";
        const commentsQuery = "SELECT * FROM comments WHERE article_id = ? ORDER BY created_at ASC";
        const updateViewsQuery = "UPDATE articles SET views = views + 1 WHERE article_id = ?";
        const queryParameters = [req.params.id];

        // Increment the view count for the specified article
        global.db.run(updateViewsQuery, queryParameters, function(err) {
            if (err) {
                next(err);
            } else {
                // Retrieve the specified article and its comments from the database
                global.db.get(articleQuery, queryParameters, (err, article) => {
                    if (err) {
                        next(err);
                    } else {
                        global.db.all(commentsQuery, queryParameters, (err, comments) => {
                            if (err) {
                                next(err);
                            } else {
                                // Render the reader-article template with the retrieved data
                                res.render('reader-article', {
                                    article: article,
                                    comments: comments
                                });
                            }
                        });
                    }
                });
            }
        });
    }
);

/**
 * @desc Handle liking an article
 * @param {string} req.params.id - ID of the article to be liked
 * @returns {void} Redirects to the article page
 */
router.post('/article/:id/like', (req, res, next) => {
    const likeQuery = "UPDATE articles SET likes = likes + 1 WHERE article_id = ?";
    const queryParameters = [req.params.id];

    global.db.run(likeQuery, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/reader/article/${req.params.id}`);
        }
    });
});

/**
 * @desc Handle adding a comment to an article
 * @param {string} req.params.id - ID of the article to be commented on
 * @param {string} req.body.commenter_name - Name of the commenter
 * @param {string} req.body.comment_text - Text of the comment
 * @returns {void} Redirects to the article page
 */
router.post('/article/:id/comment',
    body('commenter_name').isString().trim().escape(),
    body('comment_text').isString().trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const commentQuery = "INSERT INTO comments (article_id, commenter_name, comment_text, created_at) VALUES (?, ?, ?, ?)";
        const now = new Date().toISOString();
        const queryParameters = [req.params.id, req.body.commenter_name, req.body.comment_text, now];

        global.db.run(commentQuery, queryParameters, function(err) {
            if (err) {
                next(err);
            } else {
                res.redirect(`/reader/article/${req.params.id}`);
            }
        });
    }
);

module.exports = router;
