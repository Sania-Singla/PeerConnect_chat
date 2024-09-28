import { Ilikes } from "../interfaces/likeInterface.js";

class SQLlikes {
    async toggleLikedPost(postId) {
        //if liked 
        
    }
    async addLikedPost(){
        
    }
    async getLikedPost(postId, userId) {
        try {
            const q = `
                    SELECT 
                        u.user_id AS post_ownerId, 
                        u.user_avatar AS post_ownerAvatar, 
                        u.user_name AS post_ownerUserName, 
                        u.user_firstName AS post_ownerFirstName, 
                        u.user_lastName AS post_ownerLastName, 
                        p.post_id, 
                        p.post_visibility, 
                        p.post_updatedAt,
                        p.post_title, 
                        p.post_content, 
                        p.post_image 
                    FROM posts p
                    INNER JOIN users u                                -- same as default join with a condn.
                    ON p.post_ownerId = u.user_id
                    WHERE p.post_id= ? AND u.userId= ? AND is_liked= ?
                    `;
            const [[post]] = await connection.query(q, [postId, userId, true]);
            if (!post) {
                return { message: "LIKEDPOST_NOT_FOUND" };
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }
}
