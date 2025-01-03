import { Ilikes } from '../../interfaces/like.Interface.js';
import { CommentLike, PostLike } from '../../schemas/MongoDB/index.js';

export class MongoDBlikes extends Ilikes {
    // pending for testing
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
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                const record = await PostLike.create({
                    post_id: postId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
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
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                const record = await CommentLike.create({
                    comment_id: commentId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }
}
