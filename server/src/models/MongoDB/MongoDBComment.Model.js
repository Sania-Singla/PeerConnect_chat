import { Icomments } from '../../interfaces/comment.Interface.js';
import { Comment } from '../../schemas/MongoDB/index.js';

export class MongoDBcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
            const pipeline = [
                {
                    $match: {
                        post_id: postId,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localFields: 'user_id',
                        foreignFields: 'user_id',
                        as: 'comment_owner',
                    },
                },

                {
                    $unwind: '$comment_owner',
                },
                {
                    $lookup: {
                        from: 'commentlikes',
                        localFields: 'post_id',
                        foreignFields: 'post_id',
                        as: 'comment_likeDislikes',
                    },
                },
                {
                    $lookup: {
                        from: 'commentlikes',
                        localFields: 'post_id',
                        foreignFields: 'post_id',
                        as: 'comment_likes',
                        pipeline: [
                            {
                                $match: {
                                    is_liked: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'commentlikes',
                        localFields: 'post_id',
                        foreignFields: 'post_id',
                        as: 'comment_dislikes',
                        pipeline: [
                            {
                                $match: {
                                    is_liked: 0,
                                },
                            },
                        ],
                    },
                },

                {
                    $sort: {
                        comment_createdAt: orderBy === 'DESC' ? -1 : 1,
                    },
                },
                {
                    $addFields: {
                        isLiked: currentUserId
                            ? {
                                  $in: [
                                      currentUserId,
                                      {
                                          $map: {
                                              input: '$post_likeDislikes',
                                              as: 'like',
                                              in: '$$like.user_id',
                                              $match: {
                                                  '$$ilike.is_liked': 1,//but no -1 case handled
                                              },
                                          },
                                      },
                                  ],
                              }
                            : false,
                        likes: {
                            $size: '$comment_likes',
                        },
                        dislikes: {
                            $size: '$comment_dislikes',
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        __v: 0,
                        comment_owner: 0,
                        comment_likes: 0,
                        comment_dislikes: 0,
                        'comment_owner.user_name': 1,
                        'comment_owner.user_firstName': 1,
                        'comment_owner.user_lastName': 1,
                        'comment_owner.user_avatar': 1,
                    },
                },
            ];
            return await Comment.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async getComment(commentId, currentUserId) {
        try {
            return await Comment.findOne({
                comment_id: commentId,
                user_id: currentUserId,
            });
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const comment = await Comment.create({
                comment_id: commentId,
                user_id: userId,
                post_id: postId,
                comment_content: commentContent,
            });

            if (!comment) {
                return { message: 'COMMENT_NOT_FOUND' };
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const deletedComment = await Comment.deleteOne({
                comment_id: commentId,
            });

            //msg same as in frontend
            return { message: 'COMMENT_DELETED_SUCCESSFULLY DELETED' };
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const updatedComment = await Comment.updateOne(
                { comment_id: commentId },
                {
                    $set: {
                        comment_content: commentContent,
                    },
                },
                { new: true }
            );

            return updatedComment;
        } catch (err) {
            throw err;
        }
    }
}
