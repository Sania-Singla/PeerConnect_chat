import { Ilikes } from '../../interfaces/like.Interface.js';
import { CommentLike, PostLike } from '../../schemas/MongoDB/index.js';

export class MongoDBlikes extends Ilikes {
    async getLikedPosts(userId, orderBy, limit, page) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(userId, postId, likedStatus) {
        try {
            const existingRecord = await PostLike.findOne({
                post_id: postId,
                user_id: userId,
            });

            if (existingRecord) {
                if (existingRecord.is_liked === likedStatus) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                return await PostLike.create({
                    post_id: postId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
            }
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(userId, commentId, likedStatus) {
        try {
            const existingRecord = await CommentLike.findOne({
                comment_id: commentId,
                user_id: userId,
            });

            if (existingRecord) {
                if (existingRecord.is_liked === likedStatus) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                return await CommentLike.create({
                    comment_id: commentId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
            }
        } catch (err) {
            throw err;
        }
    }
}
