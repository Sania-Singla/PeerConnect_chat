function getPipeline1(orderBy, sortBy) {
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
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        user_id: 1,
                                        user_name: 1,
                                        user_avatar: 1,
                                        user_fullName: 1,
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: '$owner' },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'post_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'post_id',
                            foreignField: 'post_id',
                            as: 'views',
                        },
                    },
                    { $addFields: { totalViews: { $size: '$views' } } },
                    { $project: { post_category: 0, views: 0 } },
                ],
            },
        },
        { $unwind: '$post' },
        { $sort: { [sortBy]: orderBy === 'DESC' ? -1 : 1 } },
    ];
}

// for chats
function getPipeline2() {
    return [
        {
            $lookup: {
                from: 'users',
                localField: 'creator',
                foreignField: 'user_id',
                as: 'creator',
                pipeline: [
                    {
                        $project: {
                            user_id: 1,
                            user_name: 1,
                            user_avatar: 1,
                            user_fullName: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: '$creator' },
        {
            $lookup: {
                from: 'users',
                localField: 'members.user_id',
                foreignField: 'user_id',
                as: 'populatedMembers',
            },
        },
        // Replace the `members` array with populated details
        {
            $addFields: {
                members: {
                    $map: {
                        input: '$populatedMembers',
                        as: 'user',
                        in: {
                            user_id: '$$user.user_id',
                            user_bio: '$$user.user_bio',
                            user_name: '$$user.user_name',
                            user_fullName: '$$user.user_fullName',
                            user_avatar: '$$user.user_avatar',
                            role: {
                                $let: {
                                    vars: {
                                        memberData: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: '$members',
                                                        as: 'originalMember',
                                                        cond: {
                                                            $eq: [
                                                                '$$originalMember.user_id',
                                                                '$$user.user_id',
                                                            ],
                                                        },
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                    in: '$$memberData.role',
                                },
                            },
                        },
                    },
                },
            },
        },
        // Remove temporary `populatedMembers` field
        { $unset: 'populatedMembers' },
    ];
}

export { getPipeline1, getPipeline2 };
