CREATE TABLE posts (	
	post_id varchar(40) PRIMARY KEY,
    post_image varchar(300) NOT NULL,
    post_title varchar(100) NOT NULL,
    post_content text NOT NULL,
    post_ownerId varchar(40),
    post_createdAt timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT posts_post_ownerId_fk FOREIGN KEY(post_ownerId) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE posts
ADD COLUMN post_isVisible boolean DEFAULT true NOT NULL;

-- alter table posts RENAME post_isVisible to post_visibility; 

CREATE TABLE saved_posts(
    post_id varchar(40),
	user_id varchar(40),
    CONSTRAINT saved_posts_pk PRIMARY KEY(user_id,post_id),
    CONSTRAINT saved_posts_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT saved_posts_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);