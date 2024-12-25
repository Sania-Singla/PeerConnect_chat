import { OK, BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import getServiceObject from '../db/serviceObjects.js';

export const commentObject = getServiceObject('comments');

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { orderBy = 'desc' } = req.query;
        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        const comments = await commentObject.getComments(
            postId,
            req.user?.user_id,
            orderBy.toUpperCase()
        );
        return res.status(OK).json(comments);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the post comments',
            error: err.message,
        });
    }
};

const getComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId || !validator.isUUID(commentId)) {
            return res.status(BAD_REQUEST).json({
                message: 'COMMENTID_MISSING_OR_INVALID',
            });
        }

        const comment = await commentObject.getComment(
            commentId,
            req.user?.user_id
        );
        return res.status(OK).json(comment);
    } catch (err) {
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

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid postId' });
        }

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
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while creating the comment',
            error: err.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!commentId || !validator.isUUID(commentId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid commentId',
            });
        }

        const comment = await commentObject.getComment(
            commentId,
            req.user?.user_id
        );
        if (!comment) {
            return res.status(NOT_FOUND).json({ message: 'comment not found' });
        }

        const result = await commentObject.deleteComment(commentId);
        return res.status(OK).json(result);
    } catch (err) {
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
        if (!commentId || !validator.isUUID(commentId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid commentId',
            });
        }

        const comment = await commentObject.getComment(
            commentId,
            req.user?.user_id
        );
        if (!comment) {
            return res.status(NOT_FOUND).json({ message: 'comment not found' });
        }

        const updatedComment = await commentObject.editComment(
            commentId,
            commentContent
        );
        res.status(OK).json(updatedComment);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while editing the comment',
            error: err.message,
        });
    }
};

export { getComments, getComment, addComment, deleteComment, updateComment };
