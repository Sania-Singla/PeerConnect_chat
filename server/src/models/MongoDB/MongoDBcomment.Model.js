import { Icomments } from '../../interfaces/comment.Interface.js';
import { Comment } from '../../schemas/MongoDB/index.js';

export class MongoDBcomments extends Icomments {
    async getComments(postId, userId, orderBy) {
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
                    $unwind: '$user',
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
                                    is_liked: true,
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
                        as: 'comment_dislikes',
                        pipeline: [
                            {
                                $match: {
                                    is_liked: false,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        user_name: '$user.user_name',
                        user_firstName: '$user.user_firstName',
                        user_lastName: '$user.user_lastName',
                        user_avatar: '$user.user_avatar',
                        likes: {
                            $size: '$comment_likes',
                        },
                        dislikes: {
                            $size: '$comment_dislikes',
                        },
                        isLiked: userId
                            ? {
                                  $cond: {
                                      if: {
                                          $in: [
                                              userId,
                                              '$comment_likes.user_id',
                                          ],
                                      },
                                      then: 1,
                                      else: {
                                          $cond: {
                                              if: {
                                                  $in: [
                                                      userId,
                                                      '$comment_dislikes.user_id',
                                                  ],
                                              },
                                              then: 0,
                                              else: -1,
                                          },
                                      },
                                  },
                              }
                            : -1,
                    },
                },
                {
                    $project: {
                        user: 0,
                    },
                },
                {
                    $sort: {
                        comment_createdAt: orderBy === 'DESC' ? -1 : 1,
                    },
                },
            ];

            return await Comment.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async commentExistance(commentId) {
        try {
            return await Comment.findOne({ comment_id: commentId }).lean();
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
                        from: 'users',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'comment_owner',
                    },
                },
                {
                    $unwind: '$comment_owner',
                },
                {
                    $addFields: {
                        user_name: '$comment_owner.user_name',
                        user_avatar: '$comment_owner.user_avatar',
                        user_lastName: '$comment_owner.user_lastName',
                        user_firstName: '$comment_owner.user_firstName',
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
                                    is_liked: true,
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
                        as: 'comment_dislikes',
                        pipeline: [
                            {
                                $match: {
                                    is_liked: false,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        isLiked: userId
                            ? {
                                  $cond: {
                                      if: {
                                          $in: [
                                              userId,
                                              '$comment_likes.user_id',
                                          ],
                                      },
                                      then: 1,
                                      else: {
                                          $cond: {
                                              if: {
                                                  $in: [
                                                      userId,
                                                      '$comment_dislikes.user_id',
                                                  ],
                                              },
                                              then: 0,
                                              else: -1,
                                          },
                                      },
                                  },
                              }
                            : -1,
                    },
                },
                {
                    $addFields: {
                        likes: {
                            $size: '$comment_likes',
                        },
                        dislikes: {
                            $size: '$comment_dislikes',
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

    async createComment(userId, postId, commentContent) {
        try {
            const comment = await Comment.create({
                user_id: userId,
                post_id: postId,
                comment_content: commentContent,
            });
            return await this.getComment(commentId);
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            return await Comment.findOneAndDelete({
                comment_id: commentId,
            }).lean();
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
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
