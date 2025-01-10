create table comments (
    comment_id varchar(40) PRIMARY KEY,
    user_id varchar(40),
    post_id varchar(40),
    comment_content varchar(256) NOT NULL,
    comment_createdAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT comments_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT comments_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);