import { Iposts } from "../interfaces/postInterface.js";
import { connection } from "../server.js";

export class SQLposts extends Iposts {
    // pending search query & views
    async getRandomPosts(limit, orderBy) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }

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
                LEFT JOIN users u                             -- can't use natural join since no columns are compatable(same type but not name) so either use simple join(inner join) or left/right
                ON p.post_ownerId = u.user_id
                WHERE p.post_visibility = 1
                ORDER BY p.post_updatedAt ${orderBy}
                LIMIT ?
                `;
            const [posts] = await connection.query(q, [limit]);
            if (!posts) {
                return { message: "NO_POSTS_FOUND" };
            }
            return posts;
        } catch (err) {
            throw new Error(err);
        }
    }

    // pending views
    async getPosts(userId, limit, orderBy) {
        try {
            const validOrderBy = ["ASC", "DESC"];
            if (!validOrderBy.includes(orderBy.toUpperCase())) {
                throw new Error("INVALID_ORDERBY_VALUE");
            }
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
                FROM users u
                JOIN posts p                                    -- same thing just interchange the tables so interchange left & right
                ON p.post_ownerId = u.user_id
                WHERE p.post_ownerId = ? AND p.post_visibility = 1
                ORDER BY p.post_updatedAt ${orderBy}
                LIMIT ?
                `;
            const [posts] = await connection.query(q, [userId, limit]);
            if (!posts) {
                return { message: "NO_POSTS_FOUND" };
            }
            return posts;
        } catch (err) {
            throw new Error(err);
        }
    }

    // pending
    async getPost(postId) {
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
                    p.post_image,
                FROM posts p
                INNER JOIN users u                                -- same as default join with a condn.
                ON p.post_ownerId = u.user_id
                WHERE p.post_id= ?
                `;
            const [[post]] = await connection.query(q, [postId]);
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
            const q = "DELETE FROM posts WHERE post_id = ?";
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
            const q = "UPDATE posts SET post_title = ?, post_content = ?, post_updatedAt = ? WHERE post_id = ?";
            await connection.query(q, [title, content, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTDETAILS_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePostImage(postId, image, updatedAt) {
        try {
            const q = "UPDATE posts SET post_image = ?, post_updatedAt = ? WHERE post_id = ?";
            await connection.query(q, [image, updatedAt, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTIMAGE_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            const q = "UPDATE posts SET post_visibility = ? WHERE post_id = ?";
            await connection.query(q, [visibility, postId]);
            const post = await this.getPost(postId);
            if (post?.message) {
                throw new Error("POSTVISIBILITY_UPDATION_DB_ISSUE");
            }
            return post;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createPost(postId, ownerId, title, content, image) {
        try {
            const q = "INSERT INTO posts (post_id, post_ownerId, post_title, post_content, post_image) VALUES (?, ?, ?, ?, ?)";
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
