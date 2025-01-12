import express from 'express';
export const postRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    doesResourceExist,
    isOwner,
    validateUUID,
} from '../middlewares/index.js';

import {
    getPost,
    getPosts,
    getRandomPosts,
    addPost,
    deletePost,
    updatePostDetails,
    updateThumbnail,
    togglePostVisibility,
    getSavedPosts,
    toggleSavePost,
} from '../controllers/post.Controller.js';

const isPostOwner = isOwner('post', 'post_ownerId');
const doesPostExist = doesResourceExist('post', 'postId', 'post');
const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');

postRouter.route('/all').get(getRandomPosts);

postRouter.route('/channel/:channelId').get(doesChannelExist, getPosts);

postRouter
    .route('/post/:postId')
    .get(validateUUID('postId'), optionalVerifyJwt, getPost);

postRouter.use(verifyJwt);

postRouter.route('/saved').get(getSavedPosts);

postRouter.route('/toggle-save/:postId').post(doesPostExist, toggleSavePost);

postRouter.route('/add').post(upload.single('postImage'), addPost);

postRouter
    .route('/delete/:postId')
    .delete(doesPostExist, isPostOwner, deletePost);

postRouter
    .route('/details/:postId')
    .patch(doesPostExist, isPostOwner, updatePostDetails);

postRouter
    .route('/image/:postId')
    .patch(
        doesPostExist,
        isPostOwner,
        upload.single('postImage'),
        updateThumbnail
    );

postRouter
    .route('/visibility/:postId')
    .patch(doesPostExist, isPostOwner, togglePostVisibility);
