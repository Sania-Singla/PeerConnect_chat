import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { verifyOrderBy, tryCatch, ErrorHandler } from '../utils/index.js';

export const likeObject = getServiceObject('likes');

const getLikedPosts = tryCatch('get liked posts', async (req, res, next) => {
    const { user_id } = req.user;
    const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    const result = await likeObject.getLikedPosts(
        user_id,
        orderBy.toUpperCase(),
        Number(limit),
        Number(page)
    );

    if (result.docs.length) {
        const data = {
            posts: result.docs,
            postaInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalPosts: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no posts liked' });
    }
});

const togglePostLike = tryCatch('toggle post like', async (req, res) => {
    const { user_id } = req.user;
    const { postId } = req.params;
    let { likedStatus } = req.query;

    likedStatus = likedStatus === 'true' ? 1 : 0;

    await likeObject.togglePostLike(user_id, postId, likedStatus);
    return res.status(OK).json({ message: 'post like toggled successfully' });
});

const toggleCommentLike = tryCatch('toggle comment like', async (req, res) => {
    const { user_id } = req.user;
    const { commentId } = req.params;
    let { likedStatus } = req.query;
    likedStatus = likedStatus === 'true' ? 1 : 0;

    await likeObject.toggleCommentLike(user_id, commentId, likedStatus);
    return res
        .status(OK)
        .json({ message: 'comment like toggled successfully' });
});

export { getLikedPosts, togglePostLike, toggleCommentLike };
