import { Icomments } from '../../interfaces/comment.Interface.js';
import { Comment } from '../../schemas/MongoDB/index.js';

export class MongoDBcomments extends Icomments {
    async getComments(postId, userId, orderBy) {
        try {
            if (orderBy === 'DESC') orderBy = -1;
            else orderBy = 1;

            const pipeline = [
                {
                    $match: {
                        post_id: postId,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'user',
                        pipeline: [
                            {
                                $project: {
                                    user_name: 1,
                                    user_firstName: 1,
                                    user_lastName: 1,
                                    user_avatar: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'commentlikes',
                        localField: 'comment_id',
                        foreignField: 'comment_id',
                        as: 'comment_likes',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $addFields: {
                        user_name: '$user.user_name',
                        user_firstName: '$user.user_firstName',
                        user_lastName: '$user.user_lastName',
                        user_avatar: '$user.user_avatar',
                        likes: {
                            $size: {
                                $filter: {
                                    input: '$comment_likes',
                                    as: 'like',
                                    cond: { $eq: ['$$like.is_liked', 1] },
                                },
                            },
                        },
                        dislikes: {
                            $size: {
                                $filter: {
                                    input: '$comment_likes',
                                    as: 'dislike',
                                    cond: { $eq: ['$$dislike.is_liked', 0] },
                                },
                            },
                        },
                        isLiked: {},
                    },
                },
            ];

            return await Comment.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async getComment(commentId, userId) {
        try {
            const pipeline = [
                {
                    $match: {
                        comment_id: commentId,
                    },
                },
                {
                    $lookup: {
                        from: 'commentlikes',
                        localField: 'comment_id',
                        foreignField: 'comment_id',
                        as: 'comment_likes',
                        pipeline: [
                            {
                                $match: {
                                    user_id: userId,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        isLiked: {
                            $cond: {
                                if: { $gt: [{ $size: '$comment_likes' }, 0] },
                                then: {
                                    $arrayElemAt: [
                                        '$comment_likes.is_liked', // will have only one value as [.]
                                        0,
                                    ],
                                },
                                else: -1,
                            },
                        },
                    },
                },
            ];

            const [comment] = await Comment.aggregate(pipeline);
            return comment;
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            return await Comment.create({
                comment_id: commentId,
                user_id: userId,
                post_id: postId,
                comment_content: commentContent,
            });
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            return await Comment.findOneAndDelete({
                comment_id: commentId,
            });
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            return await Comment.findOneAndUpdate(
                { comment_id: commentId },
                {
                    $set: {
                        comment_content: commentContent,
                    },
                },
                { new: true }
            );
        } catch (err) {
            throw err;
        }
    }
}
