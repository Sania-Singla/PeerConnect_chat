import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { ErrorHandler, tryCatch, verifyOrderBy } from '../utils/index.js';

export const commentObject = getServiceObject('comments');

const getComments = tryCatch('get comments', async (req, res, next) => {
    const { postId } = req.params;
    const { orderBy = 'desc' } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
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
});

const addComment = tryCatch('add comment', async (req, res, next) => {
    const user = req.user;
    const { postId } = req.params;
    const { commentContent } = req.body;

    if (!commentContent) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const comment = await commentObject.createComment(
        user.user_id,
        postId,
        commentContent
    );

    const modifiedComment = {
        ...comment,
        user_name: user.user_name,
        user_firstName: user.user_firstName,
        user_lastName: user.user_lastName,
        user_avatar: user.user_avatar,
    };

    return res.status(OK).json(modifiedComment);
});

const deleteComment = tryCatch('delete comment', async (req, res) => {
    const { commentId } = req.params;
    await commentObject.deleteComment(commentId);
    return res.status(OK).json({ message: 'comment deleted successfully' });
});

const updateComment = tryCatch('update comment', async (req, res, next) => {
    const { commentContent } = req.body;
    const { commentId } = req.params;

    if (!commentContent) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const updatedComment = await commentObject.editComment(
        commentId,
        commentContent
    );
    return res.status(OK).json(updatedComment);
});

export { getComments, addComment, deleteComment, updateComment };
