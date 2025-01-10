-- procedure for toggle follow
DELIMITER $$
CREATE PROCEDURE toggleFollow (IN p_following_id CHAR(40),IN p_follower_id CHAR(40))
BEGIN
    DECLARE isFollowed BOOLEAN DEFAULT FALSE;

    SET isFollowed := EXISTS(SELECT 1 FROM followers WHERE follower_id = p_follower_id AND following_id = p_following_id);

    IF isFollowed THEN
        DELETE FROM followers WHERE follower_id = p_follower_id AND following_id = p_following_id;
    ELSE
        INSERT INTO followers (follower_id, following_id) VALUES (p_follower_id, p_following_id);
    END IF;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'TOGGLE_FOLLOW_DB_ISSUE';
    ELSE
        SELECT 'FOLLOW_TOGGLED_SUCCESSFULLY' AS message;
    END IF;
END$$
DELIMITER ;

-- procedure for updating watch history
DELIMITER $$
CREATE PROCEDURE updateWatchHistory (IN postId CHAR(40), IN userId CHAR(40)) 
BEGIN
	DECLARE isWatched BOOLEAN DEFAULT FALSE;
    
    SET isWatched := EXISTS(SELECT 1 FROM watch_history WHERE post_id = postId AND user_id = userId);
    
    IF isWatched THEN 
		UPDATE watch_history w SET watchedAt = NOW() WHERE w.post_id = postId AND w.user_id = userId;
	ELSE 
		INSERT INTO watch_history (post_id, user_id) values (postId, userId);
	END IF;
    
    IF ROW_COUNT() = 0 THEN 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'WATCH_HISTORY_UPDATION_DB_ISSUE';
	ELSE 
		SELECT 'WATCH_HISTORY_UPDATED_SUCCESSFULLY' AS message;
	END IF;
END$$
DELIMITER ;


-- procedure for toggling save post
DELIMITER $$
CREATE PROCEDURE toggleSavePost(IN userId CHAR(40), IN postId CHAR(40))
BEGIN
	DECLARE isSaved BOOLEAN DEFAULT FALSE;

    SET isSaved := EXISTS(SELECT 1 FROM saved_posts s WHERE s.post_id = postId AND s.user_id = userId);

    IF isSaved THEN 
		DELETE FROM saved_posts s WHERE s.post_id = postId AND s.user_id = userId; 
	ELSE
		INSERT INTO saved_posts (user_id, post_id) VALUES (userId, postId); 
	END IF;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "TOGGLING_SAVEDPOSTS_DB_ISSUE"; 
    ELSE 
        SELECT "POST_SAVE_TOGGLED_SUCCESSFULLY" AS message; 
    END IF;
END $$
DELIMITER ;


-- procedure for toggling post like
DELIMITER $$
CREATE PROCEDURE togglePostLike(IN userId CHAR(40), IN postId CHAR(40), IN likedStatus INT) 
BEGIN
	DECLARE isLiked INT DEFAULT 0;
    
    SELECT is_liked INTO isLiked              
    FROM post_likes p
    WHERE p.post_id = postId AND p.user_id = userId;
	
    IF ROW_COUNT() = 0 THEN 
		INSERT INTO post_likes(post_id,user_id,is_liked) VALUES(postId, userId, likedStatus);
	ELSEIF isLiked = likedStatus THEN 
        DELETE FROM post_likes p WHERE p.post_id = postId AND p.user_id = userId;
    ELSE  
        UPDATE post_likes p SET p.is_liked = likedStatus WHERE p.post_id = postId AND p.user_id = userId;
    END IF;
    
    IF ROW_COUNT() = 0 THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "LIKE_TOGGLING_DB_ISSUE";
	ELSE 
        SELECT "POST_LIKE_TOGGLED_SUCCESSFULLY" AS message;
	END IF;
END $$
DELIMITER ;

-- procedure for toggling comment like
DELIMITER $$
CREATE PROCEDURE toggleCommentLike(IN userId CHAR(40), IN commentId CHAR(40), IN likedStatus INT) 
BEGIN
	DECLARE isLiked INT DEFAULT 0;
    
    SELECT is_liked INTO isLiked              
    FROM comment_likes c
    WHERE c.comment_id = commentId AND c.user_id = userId;
	
    IF ROW_COUNT() = 0 THEN 
		INSERT INTO comment_likes(comment_id,user_id,is_liked) VALUES(commentId, userId, likedStatus); 
	ELSEIF isLiked = likedStatus THEN 
        DELETE FROM comment_likes c WHERE c.comment_id = commentId AND c.user_id = userId;    
    ELSE  
        UPDATE comment_likes c SET c.is_liked = likedStatus WHERE c.comment_id = commentId AND c.user_id = userId;
    END IF;
    
    IF ROW_COUNT() = 0 THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "LIKE_TOGGLING_DB_ISSUE";
	ELSE 
        SELECT "COMMENT_LIKE_TOGGLED_SUCCESSFULLY" AS message;
	END IF;
END $$
DELIMITER ;
