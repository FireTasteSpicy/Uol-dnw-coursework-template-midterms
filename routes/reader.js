/**
 * reader.js
 * Routes for the reader's home page and individual article pages
 * This file includes routes for displaying the reader home page,
 * reading individual articles, liking articles, and adding comments.
 */

const express = require('express');
const router = express.Router();

/**
 * @desc Display the reader home page with a list of published articles
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
 */
router.get('/article/:id', (req, res, next) => {
    const articleQuery = "SELECT * FROM articles WHERE article_id = ?";
    const commentsQuery = "SELECT * FROM comments WHERE article_id = ? ORDER BY created_at ASC";
    const queryParameters = [req.params.id];

    global.db.get(articleQuery, queryParameters, (err, article) => {
        if (err) {
            next(err);
        } else {
            global.db.all(commentsQuery, queryParameters, (err, comments) => {
                if (err) {
                    next(err);
                } else {
                    res.render('reader-article', {
                        article: article,
                        comments: comments
                    });
                }
            });
        }
    });
});

/**
 * @desc Handle liking an article
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
 */
router.post('/article/:id/comment', (req, res, next) => {
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
});

module.exports = router;
