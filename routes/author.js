/**
 * author.js
 * Routes for the author's home page and related actions
 * This file includes routes for displaying the author home page,
 * creating new drafts, editing, publishing, and deleting articles.
 */

const express = require('express');
const router = express.Router();

/**
 * @desc Display the author home page with lists of published and draft articles
 */
router.get('/home', (req, res, next) => {
    const queryPublished = "SELECT * FROM articles WHERE published_at IS NOT NULL";
    const queryDrafts = "SELECT * FROM articles WHERE published_at IS NULL";
    const settingsQuery = "SELECT * FROM settings WHERE id = 1"; // Assuming single row settings table

    global.db.get(settingsQuery, (err, settings) => {
        if (err) {
            next(err);
        } else {
            global.db.all(queryPublished, (errPublished, publishedArticles) => {
                if (errPublished) {
                    next(errPublished);
                } else {
                    global.db.all(queryDrafts, (errDrafts, draftArticles) => {
                        if (errDrafts) {
                            next(errDrafts);
                        } else {
                            res.render('author-home', {
                                authorName: settings.author_name,
                                blogTitle: settings.blog_title,
                                publishedArticles: publishedArticles,
                                draftArticles: draftArticles
                            });
                        }
                    });
                }
            });
        }
    });
});

/**
 * @desc Create a new draft article and redirect to the edit page
 */
router.post('/create-draft', (req, res, next) => {
    const query = "INSERT INTO articles (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)";
    const now = new Date().toISOString();
    const queryParameters = ["New Draft", "", now, now];

    global.db.run(query, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/author/edit/${this.lastID}`);
        }
    });
});

/**
 * @desc Delete an article from the database
 */
router.post('/delete-article/:id', (req, res, next) => {
    const query = "DELETE FROM articles WHERE article_id = ?";
    const queryParameters = [req.params.id];

    global.db.run(query, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/author/home');
        }
    });
});

/**
 * @desc Publish a draft article
 */
router.post('/publish-article/:id', (req, res, next) => {
    const query = "UPDATE articles SET published_at = ?, updated_at = ? WHERE article_id = ?";
    const now = new Date().toISOString();
    const queryParameters = [now, now, req.params.id];

    global.db.run(query, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/author/home');
        }
    });
});

/**
 * @desc Display the settings page
 */
router.get('/settings', (req, res, next) => {
    const query = "SELECT * FROM settings WHERE id = 1"; // Assuming a single settings row with id 1

    global.db.get(query, (err, settings) => {
        if (err) {
            next(err);
        } else {
            res.render('author-settings', {
                authorName: settings.author_name,
                blogTitle: settings.blog_title
            });
        }
    });
});

/**
 * @desc Update the blog title and author name
 */
router.post('/settings', (req, res, next) => {
    const query = "UPDATE settings SET blog_title = ?, author_name = ? WHERE id = 1";
    const queryParameters = [req.body.blog_title, req.body.author_name];

    global.db.run(query, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/author/home');
        }
    });
});

/**
 * @desc Display the edit article page with the current article data
 */
router.get('/edit/:id', (req, res, next) => {
    const query = "SELECT * FROM articles WHERE article_id = ?";
    const queryParameters = [req.params.id];

    global.db.get(query, queryParameters, (err, article) => {
        if (err) {
            next(err);
        } else {
            res.render('edit-article', {
                article: article
            });
        }
    });
});

/**
 * @desc Update the article with new data
 */
router.post('/edit/:id', (req, res, next) => {
    const query = "UPDATE articles SET title = ?, content = ?, updated_at = ? WHERE article_id = ?";
    const now = new Date().toISOString();
    const queryParameters = [req.body.title, req.body.content, now, req.params.id];

    global.db.run(query, queryParameters, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/author/home');
        }
    });
});

module.exports = router;
