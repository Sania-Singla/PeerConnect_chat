-- channel view
CREATE VIEW channel_view AS 
SELECT 
	u.user_id, 
	u.user_name, 
	u.user_firstName,
	u.user_lastName, 
	u.user_coverImage,  
	u.user_avatar, 
	u.user_bio,
	u.user_createdAt,
	u.user_email,
	(SELECT COUNT(p.post_id) FROM posts p where p.post_ownerId = u.user_id) AS totalPosts, 
	(SELECT COUNT(f1.follower_id) FROM followers f1 WHERE f1.following_id = u.user_id) AS totalFollowers,
	(SELECT COUNT(f2.following_id) FROM followers f2 WHERE f2.follower_id = u.user_id) AS totalFollowings,
    (SELECT COUNT(*) FROM post_likes l NATURAL JOIN posts p WHERE p.post_ownerId = u.user_id AND l.is_liked = 1) AS totalLikes,
	(SELECT IFNULL(COUNT(*), 0) FROM post_views v NATURAL JOIN posts p WHERE p.post_ownerId = u.user_id) AS totalChannelViews
FROM users u;


-- post view
CREATE VIEW post_view AS 
SELECT  
	p.*, 
    c.category_name,
    (SELECT COUNT(*) FROM post_likes l WHERE p.post_id = l.post_id AND is_liked = 1) AS totalLikes,
    (SELECT COUNT(*) FROM post_likes l WHERE p.post_id = l.post_id AND is_liked = 0) AS totalDislikes,
    (SELECT COUNT(*) FROM post_views v WHERE p.post_id = v.post_id) AS totalViews,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS totalComments
FROM posts p
JOIN categories c
ON c.category_id = p.post_category;


-- comment view
CREATE VIEW comment_view AS 
SELECT 
	c.*,
    user_name,
    user_firstName,
    user_lastName,
    user_avatar,
    (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 1) AS likes,
    (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.comment_id AND is_liked = 0) AS dislikes
FROM comments c
NATURAL JOIN users;
