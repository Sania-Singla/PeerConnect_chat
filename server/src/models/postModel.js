import { Iposts } from "../interfaces/postInterface.js";
import { connection } from "../server.js";
import validator from "validator";
//views and time left
export class SQLposts extends Iposts {
    async getRandomPosts() {
        try {
            const q =
                "SELECT  u.user_avatar, u.user_name, u.user_firstName, u.user_lastName, p.post_title, p.post_content, p.post_image FROM posts p, users u WHERE p.post_owner_id = u.user_id";
            const [posts] = await connection.query(q);
            if (!posts) {
                return { message: "DB_POST_FETCH_FAILED" };
            }
            return posts;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getPosts(userId) {
        try {
            const q1 = "(SELECT COUNT(*) FROM post_likes p WHERE p.is_liked = ?) AS totalLikes";
            const q2 = "(SELECT COUNT(*) FROM post_likes p WHERE p.is_liked = ?) AS totalDisLikes";
            const q =
                `SELECT  u.user_avatar, u.user_name, u.user_firstName, u.user_lastName, p.post_title, p.post_content, p.post_image, ${q1}, ${q2} FROM posts p, users u WHERE p.post_owner_id = u.user_id AND p.post_owner_id= ?`;

            const [posts] = await connection.query(q, [userId]);
            if (!posts) {
                return { message: "POSTS_NOT_FOUND" };
            }
            return posts;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getPost(postId, isLiked) {
        try {
            const q1 = "(SELECT COUNT(*) FROM post_likes p WHERE p.is_liked = ?) AS totalLikes";
            const q2 = "(SELECT COUNT(*) FROM post_likes p WHERE p.is_liked = ?) AS totalDisLikes";

            const q3 = "(SELECT COUNT(*) FROM comments c WHERE c.post_id = ?) AS totalComments";
            const q = `SELECT  user_avatar, user_name , user_firstName, user_lastName, post_title, post_content, post_image ${q1} , ${q2}, ${q3} FROM posts, users  WHERE  p.post_id = u.user_id AND post_id= ?`;
            const [[post]] = await connection.query(q, isLiked, postId, postId);
            if (!post) {
                return { message: "POST_NOT_FOUND" };
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deletePost(postId) {
        try {
            const q = "DELETE FROM posts WHERE post_id= ?";
            const [result] = await connection.query(q, [postId]);
            if (result.affectedRows == 0) {
                throw new Error("POST_DELETION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostDetails(postId, title, content, updatedAt) {
        try {
            const q = "UPDATE posts SET post_title = ?, post_content= ?, post_updatedAt= ? WHERE post_id = ?";
            await connection.query(q, [title, content, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTDETAILS_UPDATION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostImage(postId, image) {
        try {
            const q = "UPDATE posts SET post_image= ? WHERE post_id = ?";
            await connection.query(q, [image, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTIMAGE_UPDATION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async togglePostVisibility(postId, isVisible) {
        try {
            const q = "UPDATE posts SET post_visibility = ? WHERE post_id = ?";
            await connection.query(q, [!isVisible, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTVISIBILITY_UPDATION_DB_ISSUE");
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async createPost(postId, ownerId, title, content, image) {
        try {
            const q = "INSERT INTO posts (post_id, post_owner_id, post_title, post_content, post_image) VALUES (?, ?, ?, ?, ?)";
            await connection.query(q, [postId, ownerId, title, content, image]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POST_CREATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }
}
