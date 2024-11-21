import { Iposts } from '../../interfaces/postInterface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class Oracleposts extends Iposts {
    async getRandomPosts(limit, orderBy, page, category) {
        try {
            if (orderBy !== 'ASC' && orderBy !== 'DESC') {
                throw new Error('Invalid order direction. Use ASC or DESC.');
            }

            const q = `BEGIN
                            :result := POSTS_PACKAGE.getRandomPosts(:limit, :orderBy, :page, :category);
                        END;`;

            const result = await connection.execute(q, {
                limit: { val: limit, type: connection.NUMBER },
                orderBy: { val: orderBy, type: connection.STRING },
                page: { val: page, type: connection.NUMBER },
                category: { val: category, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });

            const cursor = result.outBinds.result;
            const posts = await cursor.getRows();
            cursor.close();

            if (posts.length === 0) {
                throw new Error('No posts found');
            }

            return posts; // Returning the fetched posts data
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, category) {
        try {
            if (orderBy !== 'ASC' && orderBy !== 'DESC') {
                throw new Error('Invalid order direction. Use ASC or DESC.');
            }
            const q = `BEGIN
                        :result := POSTS_PACKAGE.getPosts(:channelId, :limit, :orderBy, :page, :category);
                    END;`;
            const result = await connection.execute(q, {
                channelId: { val: channelId, type: connection.STRING },
                limit: { val: limit, type: connection.NUMBER },
                orderBy: { val: orderBy, type: connection.STRING },
                page: { val: page, type: connection.NUMBER },
                category: { val: category, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });
            const cursor = result.outBinds.result;
            const posts = await cursor.getRows();
            cursor.close();
            if (posts.length === 0) throw new Error('No posts found')
            return posts; 
        } catch (err) {throw err;}
    }

    async getPost(postId, userId) {
        try {
            const q = `BEGIN
                        :result := POSTS_PACKAGE.getPost(:postId, :userId);
                    END;`;
            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.STRING },
                userId: { val: userId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });
            if (!result.outBinds.result) throw new Error('Post not found')
            return JSON.parse(result.outBinds.result); 
        } catch (err) {
            throw err;
        }
    }

    async createPost(postId, ownerId, title, content, category, image) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.createPost(:postId, :ownerId, :title, :content, :category, :image);
                        END;`;

            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.STRING },
                ownerId: { val: ownerId, type: connection.STRING },
                title: { val: title, type: connection.STRING },
                content: { val: content, type: connection.STRING },
                category: { val: category, type: connection.STRING },
                image: { val: image, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the post creation process
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails(postId, title, content, category) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.updatePostDetails(:postId, :title, :content, :category);
                        END;`;

            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.STRING },
                title: { val: title, type: connection.STRING },
                content: { val: content, type: connection.STRING },
                category: { val: category, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the update process
        } catch (err) {
            throw err;
        }
    }

    async deletePost(postId) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.deletePost(:postId);
                        END;`;

            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the delete process
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, image) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.updatePostImage(:postId, :image);
                        END;`;

            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.STRING },
                image: { val: image, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the image update process
        } catch (err) {
            throw err;
        }
    }

    async savePost(userId, postId) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.savePost(:userId, :postId);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                postId: { val: postId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the save process
        } catch (err) {
            throw err;
        }
    }

    async getSavedPosts(userId, limit, orderBy, page) {
        try {
            if (orderBy !== 'ASC' && orderBy !== 'DESC') {
                throw new Error('Invalid order direction. Use ASC or DESC.');
            }

            const q = `BEGIN
                            :result := POSTS_PACKAGE.getSavedPosts(:userId, :limit, :orderBy, :page);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                limit: { val: limit, type: connection.NUMBER },
                orderBy: { val: orderBy, type: connection.STRING },
                page: { val: page, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });

            const cursor = result.outBinds.result;
            const savedPosts = await cursor.getRows();
            cursor.close();

            if (savedPosts.length === 0) {
                throw new Error('No saved posts found');
            }

            return savedPosts; // Return the list of saved posts
        } catch (err) {
            throw err;
        }
    }

    async removeSavedPost(userId, postId) {
        try {
            const q = `BEGIN
                            :result := POSTS_PACKAGE.removeSavedPost(:userId, :postId);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                postId: { val: postId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result; // Return the result of the removal process
        } catch (err) {
            throw err;
        }
    }
}
