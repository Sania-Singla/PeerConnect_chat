import { OK, BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import getServiceObject from '../db/serviceObjects.js';
import { verifyOrderBy } from '../utils/index.js';

export const commentObject = getServiceObject('comments');

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { orderBy = 'desc' } = req.query;

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
        }

        const comments = await commentObject.getComments(
            postId,
            req.user?.user_id,
            orderBy.toUpperCase()
        );

        if (comments.length) {
            return res.status(OK).json(comments);
        } else {
            return res.status(OK).json({ message: 'no comments found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the post comments',
            error: err.message,
        });
    }
};

const getComment = async (req, res) => {
    try {
        return res.status(OK).json(req.comment);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the comment',
            error: err.message,
        });
    }
};

const addComment = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { postId } = req.params;
        const { commentContent } = req.body;
        const commentId = uuid();

        if (!commentContent) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        const comment = await commentObject.createComment(
            commentId,
            user_id,
            postId,
            commentContent
        );
        return res.status(OK).json(comment);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while creating the comment',
            error: err.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const result = await commentObject.deleteComment(commentId);
        return res.status(OK).json({ message: 'comment deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the comment',
            error: err.message,
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentContent } = req.body;
        const { commentId } = req.params;

        if (!commentContent) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        const updatedComment = await commentObject.editComment(
            commentId,
            commentContent
        );
        return res.status(OK).json(updatedComment);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while editing the comment',
            error: err.message,
        });
    }
};

export { getComments, getComment, addComment, deleteComment, updateComment };
