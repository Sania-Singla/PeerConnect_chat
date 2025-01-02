import { upload } from './multer.Middleware.js';
import { verifyJwt, optionalVerifyJwt } from './auth.Middleware.js';
import { isOwner } from './isOwner.Middleware.js';
import { doesResourceExist } from './doesResourceExist.Middleware.js';

const isPostOwner = isOwner('post', 'post_ownerId');
const isCommentOwner = isOwner('comment', 'user_id');

const doesPostExist = doesResourceExist('post', 'postId', 'post');
const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');
const doesCommentExist = doesResourceExist('comment', 'commentId', 'comment');
const doesCategoryExist = doesResourceExist(
    'category',
    'categoryId',
    'category'
);

export {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    isOwner,
    doesResourceExist,
    isPostOwner,
    isCommentOwner,
    doesPostExist,
    doesChannelExist,
    doesCommentExist,
    doesCategoryExist,
};
