function getPipeline1(categoryId, orderBy) {
    return [
        {
            $lookup: {
                from: 'categories',
                localField: 'post_category',
                foreignField: 'category_id',
                as: 'category_name',
                pipeline: categoryId
                    ? [
                          {
                              $match: {
                                  category_id: categoryId,
                              },
                          },
                      ]
                    : [],
            },
        },
        {
            $unwind: '$category_name',
        },
        {
            $addFields: {
                category_name: '$category_name.category_name',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'post_ownerId',
                foreignField: 'user_id',
                as: 'post_owner',
            },
        },
        {
            $unwind: '$post_owner',
        },
        {
            $lookup: {
                from: 'postlikes',
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'post_likes',
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
                from: 'postlikes',
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'post_dislikes',
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
            $lookup: {
                from: 'postviews',
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'post_views',
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'post_comments',
            },
        },
        {
            $sort: {
                post_updatedAt: orderBy === 'DESC' ? -1 : 1,
            },
        },
        {
            $addFields: {
                totalLikes: {
                    $size: '$post_likes',
                },
                totalDislikes: {
                    $size: '$post_dislikes',
                },
                totalViews: {
                    $size: '$post_views',
                },
                totalComments: {
                    $size: '$post_comments',
                },
                userName: '$post_owner.user_name',
                firstName: '$post_owner.user_firstName',
                lastName: '$post_owner.user_lastName',
                avatar: '$post_owner.user_avatar',
                coverImage: '$post_owner.user_coverImage',
            },
        },
        {
            $project: {
                post_owner: 0,
                post_likes: 0,
                post_dislikes: 0,
                post_views: 0,
                post_comments: 0,
            },
        },
    ];
}

function getPipeline2(orderBy, sortBy) {
    return [
        {
            $lookup: {
                from: 'posts',
                localField: 'post_id',
                foreignField: 'post_id',
                as: 'post',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'post_ownerId',
                            foreignField: 'user_id',
                            as: 'user',
                        },
                    },
                    {
                        $unwind: '$user',
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'post_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    {
                        $unwind: '$category',
                    },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'post_id',
                            foreignField: 'post_id',
                            as: 'views',
                        },
                    },
                ],
            },
        },
        {
            $unwind: '$post',
        },

        {
            $sort: {
                [sortBy]: orderBy === 'DESC' ? -1 : 1,
            },
        },
        {
            $addFields: {
                post_ownerId: '$post.post_ownerId',
                category_name: '$post.category.category_name',
                post_updatedAt: '$post.post_updatedAt',
                post_createdAt: '$post.post_createdAt',
                post_title: '$post.post_title',
                post_content: '$post.post_content',
                post_image: '$post.post_image',
                userName: '$post.user.user_name',
                firstName: '$post.user.user_firstName',
                lastName: '$post.user.user_lastName',
                avatar: '$post.user.user_avatar',
                coverImage: '$post.user.user_coverImage',
                totalViews: { $size: '$post.views' },
            },
        },
        {
            $project: {
                user: 0,
                post: 0,
                user_id: 0,
                is_liked: 0,
            },
        },
    ];
}

export { getPipeline1, getPipeline2 };
