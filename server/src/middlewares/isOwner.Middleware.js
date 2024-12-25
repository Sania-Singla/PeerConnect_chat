import {
    BAD_REQUEST,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import validator from 'validator';

const postObject = getServiceObject('posts');

const isOwner = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { postId } = req.params;

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid postId' });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(NOT_FOUND).json({ message: 'post not found' });
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({
                message: 'not the owner',
            });
        }

        // post under operation
        req.post = post;
        next();
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while checking for the post owner',
            err: err.message,
        });
    }
};

export { isOwner };
