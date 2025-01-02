import express from 'express';
export const postRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    isPostOwner,
    doesChannelExist,
    doesPostExist,
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

postRouter.route('/all').get(getRandomPosts);

postRouter.route('/channel/:channelId').get(doesChannelExist, getPosts);

postRouter
    .route('/post/:postId')
    .get(optionalVerifyJwt, doesPostExist, getPost);

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
