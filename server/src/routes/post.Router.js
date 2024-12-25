import express from 'express';
export const postRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    isOwner,
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

postRouter.route('/channel/:channelId').get(getPosts);

postRouter.route('/post/:postId').get(optionalVerifyJwt, getPost);

postRouter.use(verifyJwt);

postRouter.route('/saved').get(getSavedPosts);

postRouter.route('/toggle-save/:postId').post(toggleSavePost);

postRouter.route('/add').post(upload.single('postImage'), addPost);

postRouter.use(isOwner);

postRouter.route('/delete/:postId').delete(deletePost);

postRouter.route('/details/:postId').patch(updatePostDetails);

postRouter
    .route('/image/:postId')
    .patch(upload.single('postImage'), updateThumbnail);

postRouter.route('/visibility/:postId').patch(togglePostVisibility);
