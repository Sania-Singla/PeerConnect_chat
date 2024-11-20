create table posts (
    post_id varchar(40) PRIMARY KEY,
    post_image varchar(300) NOT NULL,
    post_title varchar(100) NOT NULL,
    post_content text NOT NULL,
    post_ownerId varchar(40),
    post_visibility boolean DEFAULT TRUE,
    post_category varchar(40),
    post_createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    post_updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT post_category_fk FOREIGN KEY(post_category) REFERENCES categories(category_id) ON DELETE CASCADE,
    CONSTRAINT posts_post_ownerId_fk FOREIGN KEY(post_ownerId) REFERENCES users(user_id) ON DELETE CASCADE
);
create table post_views (
    post_id varchar(40),
    user_identifier varchar(40),
    CONSTRAINT post_views_pk PRIMARY KEY(user_identifier, post_id),
    CONSTRAINT post_views_post_id_fk FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);