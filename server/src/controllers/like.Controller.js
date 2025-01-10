import { OK, SERVER_ERROR } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { verifyOrderBy } from '../utils/index.js';

export const likeObject = getServiceObject('likes');

const getLikedPosts = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
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
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting liked posts.',
            error: err.message,
        });
    }
};

const togglePostLike = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { postId } = req.params;
        let { likedStatus } = req.query;

        likedStatus = likedStatus === 'true' ? 1 : 0;

        await likeObject.togglePostLike(user_id, postId, likedStatus);
        return res
            .status(OK)
            .json({ message: 'post like toggled successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while toggling post like.',
            error: err.message,
        });
    }
};

const toggleCommentLike = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { commentId } = req.params;
        let { likedStatus } = req.query;
        likedStatus = likedStatus === 'true' ? 1 : 0;

        await likeObject.toggleCommentLike(user_id, commentId, likedStatus);
        return res
            .status(OK)
            .json({ message: 'comment like toggled successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while toggling comment like.',
            error: err.message,
        });
    }
};
export { getLikedPosts, togglePostLike, toggleCommentLike };
