
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

-- CREATE TABLE IF NOT EXISTS users (
--     user_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_name TEXT NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS email_accounts (
--     email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     email_address TEXT NOT NULL,
--     user_id  INT, --the user that the email account belongs to
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    published_at DATETIME,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INT,
    commenter_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
);

CREATE TABLE IF NOT EXISTS likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    blog_title TEXT NOT NULL,
    author_name TEXT NOT NULL
);

INSERT INTO settings (id, blog_title, author_name) VALUES (1, 'My Blog', 'Author Name');

-- Insert default data (if necessary here)

-- INSERT INTO users ('user_name') VALUES ('Simon Star');
-- INSERT INTO users ('user_name') VALUES ('Dianne Dean');
-- INSERT INTO users ('user_name') VALUES ('Harry Hilbert');

-- INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@gmail.com', 1); 
-- INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
-- INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

COMMIT;

