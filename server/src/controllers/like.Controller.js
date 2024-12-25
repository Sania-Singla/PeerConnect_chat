import validator from 'validator';
import { OK, BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { postObject } from './post.Controller.js';
import { commentObject } from './comment.Controller.js';

export const likeObject = getServiceObject('likes');

const getLikedPosts = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

        const likedPosts = await likeObject.getLikedPosts(
            user_id,
            orderBy.toUpperCase(),
            Number(limit),
            Number(page)
        );
        return res.status(OK).json(likedPosts);
    } catch (err) {
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

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid postId' });
        }

        const post = await postObject.getPost(postId, user_id);
        if (post?.message) {
            return res.status(BAD_REQUEST).json(post);
        }

        const response = await likeObject.togglePostLike(
            postId,
            user_id,
            likedStatus
        );
        return res.status(OK).json(response);
    } catch (err) {
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

        if (!commentId || !validator.isUUID(commentId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid commentId' });
        }

        const comment = await commentObject.getComment(commentId);
        if (comment?.message) {
            return res.status(BAD_REQUEST).json(comment);
        }

        const response = await likeObject.toggleCommentLike(
            commentId,
            user_id,
            likedStatus
        );
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while toggling comment like.',
            error: err.message,
        });
    }
};
export { getLikedPosts, togglePostLike, toggleCommentLike };
