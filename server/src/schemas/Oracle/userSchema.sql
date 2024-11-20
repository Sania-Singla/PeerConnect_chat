CREATE DATABASE insight_manager;
USE insight_manager;
create table users (
    user_id varchar(40) PRIMARY KEY,
    user_name varchar(20) NOT NULL UNIQUE,
    user_firstName varchar(15) NOT NULL,
    user_lastName varchar(15),
    user_bio varchar(100) DEFAULT '',
    user_avatar varchar(300) NOT NULL,
    user_coverImage varchar(300) NOT NULL,
    user_email varchar(100) NOT NULL UNIQUE,
    user_password varchar(70) NOT NULL,
    user_createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    refresh_token varchar(200) DEFAULT '' -- or NULL
);
CREATE TABLE saved_posts(
    post_id varchar(40),
    user_id varchar(40),
    CONSTRAINT saved_posts_pk PRIMARY KEY(user_id, post_id),
    CONSTRAINT saved_posts_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT saved_posts_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

create table watch_history (
    post_id varchar(40),
    user_id varchar(40),
    watchedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT watch_history_pk PRIMARY KEY(user_id, post_id),
    CONSTRAINT watch_history_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT watch_history_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);