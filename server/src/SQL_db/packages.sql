-- Specification
CREATE OR REPLACE PACKAGE User_package AS
    PROCEDURE toggleFollow(
        p_following_id IN VARCHAR2,
        p_follower_id IN VARCHAR2,
        message OUT VARCHAR2
    );

    PROCEDURE getUser(
        identifier IN VARCHAR2,
        input IN VARCHAR2,
        message OUT VARCHAR2
    );
END User_package;

-- Body
CREATE OR REPLACE PACKAGE BODY User_package AS

    PROCEDURE toggleFollow(
        p_following_id IN VARCHAR2,
        p_follower_id IN VARCHAR2,
        message OUT VARCHAR2
    ) AS
        isFollowed INTEGER := 0;
    BEGIN
        SELECT COUNT(*) INTO isFollowed 
        FROM followers 
        WHERE follower_id = p_follower_id AND following_id = p_following_id;

        IF isFollowed > 0 THEN
            DELETE FROM followers 
            WHERE follower_id = p_follower_id AND following_id = p_following_id;

            IF SQL%ROWCOUNT = 0 THEN
                RAISE_APPLICATION_ERROR(-20001, 'DELETION_FOLLOWER_RECORD_DB_ISSUE');
            ELSE
                message := 'UNFOLLOWED_SUCCESSFULLY';
            END IF;
        ELSE
            INSERT INTO followers (follower_id, following_id) VALUES (p_follower_id, p_following_id);
            message := 'FOLLOWED_SUCCESSFULLY';
        END IF;
    END toggleFollow;

    PROCEDURE getUser(
        identifier IN VARCHAR2,
        input IN VARCHAR2,
        message OUT VARCHAR2
    ) AS
        usercount INTEGER := 0;
        userid VARCHAR2(40);
    BEGIN
        IF identifier = 'email' THEN 
            SELECT COUNT(*), user_id INTO usercount, userid
            FROM users
            WHERE user_email = input
            GROUP BY user_id;
        ELSIF identifier = 'username' THEN 
            SELECT COUNT(*), user_id INTO usercount, userid 
            FROM users
            WHERE user_name = input
            GROUP BY user_id;
        ELSE 
            SELECT COUNT(*), user_id INTO usercount, userid
            FROM users
            WHERE user_id = input
            GROUP BY user_id;
        END IF;

        IF usercount <> 0 THEN 
            SELECT * FROM users WHERE user_id = userid;
        ELSE 
            message := 'USER_NOT_FOUND';
        END IF;
    END getUser;

END User_package;



-- Specification
CREATE OR REPLACE PACKAGE Post_package AS
    PROCEDURE toggleSavePost(
        userId IN VARCHAR2,
        postId IN VARCHAR2,
        message OUT VARCHAR2
    );

    PROCEDURE togglePostLike(
        userId IN VARCHAR2,
        postId IN VARCHAR2,
        likedStatus IN INTEGER,
        message OUT VARCHAR2
    );

    PROCEDURE updateWatchHistory(
        postId IN VARCHAR2,
        userId IN VARCHAR2,
        message OUT VARCHAR2
    );
END Post_package;


-- Body
CREATE OR REPLACE PACKAGE BODY Post_package AS
    PROCEDURE toggleSavePost(
        userId IN VARCHAR2,
        postId IN VARCHAR2,
        message OUT VARCHAR2
    ) AS
        is_saved INTEGER := 0;
    BEGIN
        SELECT COUNT(*) INTO is_saved 
        FROM saved_posts 
        WHERE post_id = postId AND user_id = userId;

        IF is_saved > 0 THEN 
            DELETE FROM saved_posts
            WHERE post_id = postId AND user_id = userId;

            IF SQL%ROWCOUNT = 0 THEN
                RAISE_APPLICATION_ERROR(-20002, 'REMOVED_FROM_SAVEDPOSTS_DB_ISSUE');
            ELSE 
                message := 'POST_UNSAVED_SUCCESSFULLY';
            END IF;
        ELSE
            INSERT INTO saved_posts (user_id, post_id) VALUES (userId, postId);

            IF SQL%ROWCOUNT = 0 THEN
                RAISE_APPLICATION_ERROR(-20003, 'INSERT_TO_SAVEDPOSTS_DB_ISSUE');
            ELSE 
                message := 'POST_SAVED_SUCCESSFULLY';
            END IF;
        END IF;
    END toggleSavePost;

    PROCEDURE togglePostLike(
        userId IN VARCHAR2,
        postId IN VARCHAR2,
        likedStatus IN INTEGER,
        message OUT VARCHAR2
    ) AS
        isLiked INTEGER := 0;
    BEGIN
        SELECT is_liked INTO isLiked 
        FROM post_likes 
        WHERE post_id = postId AND user_id = userId;

        IF SQL%ROWCOUNT = 0 THEN 
            INSERT INTO post_likes(post_id, user_id, is_liked) 
            VALUES(postId, userId, likedStatus);
        ELSE
            IF isLiked = likedStatus THEN 
                DELETE FROM post_likes 
                WHERE post_id = postId AND user_id = userId;
                message := 'POST_LIKE_REMOVED';
            ELSE
                UPDATE post_likes 
                SET is_liked = likedStatus 
                WHERE post_id = postId AND user_id = userId;
                message := 'POST_LIKE_TOGGLED';
            END IF;
        END IF;
    END togglePostLike;

    PROCEDURE updateWatchHistory(
        postId IN VARCHAR2,
        userId IN VARCHAR2,
        message OUT VARCHAR2
    ) AS
        post_count INTEGER := 0;
    BEGIN
        SELECT COUNT(*) INTO post_count
        FROM watch_history
        WHERE post_id = postId AND user_id = userId;

        IF post_count > 0 THEN
            UPDATE watch_history 
            SET watchedAt = CURRENT_TIMESTAMP
            WHERE post_id = postId AND user_id = userId;
        ELSE
            INSERT INTO watch_history (post_id, user_id) 
            VALUES (postId, userId);
        END IF;

        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'WATCH_HISTORY_UPDATION_DB_ISSUE');
            -- message := 'WATCH_HISTORY_UPDATION_DB_ISSUE';
        ELSE
            message := 'WATCH_HISTORY_UPDATED_SUCCESSFULLY';
        END IF;
    END updateWatchHistory;
    
END Post_package; 



-- Specification
CREATE OR REPLACE PACKAGE Comment_package AS
    PROCEDURE toggleCommentLike(
        userId IN VARCHAR2,
        commentId IN VARCHAR2,
        likedStatus IN INTEGER,
        message OUT VARCHAR2
    );
END Comment_package;


-- Body
CREATE OR REPLACE PACKAGE BODY Comment_package AS
    PROCEDURE toggleCommentLike(userId IN VARCHAR2, commentId IN VARCHAR2, likedStatus IN INTEGER) AS
        isLiked INTEGER := 0;
    BEGIN
        SELECT is_liked INTO isLiked              
        FROM comment_likes
        WHERE comment_id = commentId AND user_id = userId;
        
        IF isLiked IS NULL THEN 
            INSERT INTO comment_likes (comment_id, user_id, is_liked) VALUES (commentId, userId, likedStatus);
        ELSIF isLiked = 1 THEN 
            IF likedStatus = 1 THEN 
                DELETE FROM comment_likes WHERE comment_id = commentId AND user_id = userId;
            ELSE  
                UPDATE comment_likes SET is_liked = 0 WHERE comment_id = commentId AND user_id = userId;
            END IF;
        ELSE
            IF likedStatus = 0 THEN 
                DELETE FROM comment_likes WHERE comment_id = commentId AND user_id = userId;
            ELSE 
                UPDATE comment_likes SET is_liked = 1 WHERE comment_id = commentId AND user_id = userId;
            END IF;
        END IF;

        IF SQL%ROWCOUNT = 0 THEN 
            RAISE_APPLICATION_ERROR(-20006, 'LIKE_TOGGLING_DB_ISSUE');
        ELSE 
            DBMS_OUTPUT.PUT_LINE('COMMENT_LIKE_TOGGLED_SUCCESSFULLY');
        END IF;
    END toggleCommentLike;
END CommentTasks;


CREATE OR REPLACE PACKAGE BODY comments_pkg AS
    PROCEDURE toggleCommentLike(
        userId IN VARCHAR2,
        commentId IN VARCHAR2,
        likedStatus IN INTEGER,
        message OUT VARCHAR2
    ) AS
        isLiked INTEGER := 0;
    BEGIN
        SELECT is_liked INTO isLiked 
        FROM comment_likes 
        WHERE comment_id = commentId AND user_id = userId;

        IF SQL%ROWCOUNT = 0 THEN
            INSERT INTO comment_likes(comment_id, user_id, is_liked) 
            VALUES(commentId, userId, likedStatus);
        ELSE
            IF isLiked = likedStatus THEN
                DELETE FROM comment_likes 
                WHERE comment_id = commentId AND user_id = userId;
                message := 'COMMENT_LIKE_REMOVED';
            ELSE
                UPDATE comment_likes 
                SET is_liked = likedStatus 
                WHERE comment_id = commentId AND user_id = userId;
                message := 'COMMENT_LIKE_TOGGLED';
            END IF;
        END IF;
    END;
END comments_pkg;