-- user table
CREATE UNIQUE INDEX idx_user_name ON users(user_name);
CREATE UNIQUE INDEX idx_user_email ON users(user_email);

-- post table
CREATE INDEX idx_post_ownerId ON posts(post_ownerId);
CREATE INDEX idx_post_category ON posts(post_category);
CREATE INDEX idx_post_title ON posts(post_title);



--CREATE INDEX idx_post_visibility ON posts(post_visibility); --dropped

-- post_likes table
CREATE INDEX idx_post_likes_post_id_is_liked ON post_likes(post_id, is_liked);
CREATE INDEX idx_post_likes_user_isliked ON post_likes (user_id, is_liked);

-- comment_likes table
CREATE INDEX idx_comment_likes_user_isliked ON comment_likes (user_id, is_liked);
CREATE INDEX idx_comment_likes_comment_id_is_liked ON comment_likes(comment_id, is_liked);

-- followers table
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_followers_follower_id ON followers(follower_id);

-- saved_posts table
CREATE INDEX idx_saved_posts_user_id ON saved_posts (user_id);

-- watch_history table
CREATE INDEX idx_watch_history_user_id ON watch_history (user_id);

-- post_views table
CREATE INDEX idx_post_views_post_id ON post_views(post_id);

-- comments table
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- categories table
CREATE UNIQUE INDEX idx_category_name ON categories(category_name);


-- Command to list all the indexes defined on the table
SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE,
    INDEX_TYPE
FROM 
    information_schema.STATISTICS
WHERE 
    TABLE_SCHEMA = 'insight_manager'
    AND TABLE_NAME = 'followers';


-- Command to list all the constraints on a specific table 
SELECT 
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM 
    information_schema.TABLE_CONSTRAINTS
WHERE 
    TABLE_SCHEMA = 'insight_manager'
    AND TABLE_NAME = 'followers';