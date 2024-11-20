import getServiceObject from '../db/serviceObjects.js';
import { OK, BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    getCurrentTimestamp,
} from '../utils/index.js';
import validator from 'validator';
import { userObject } from './userController.js';

export const postObject = getServiceObject('posts');

// pending searchTerm (query)
const getRandomPosts = async (req, res) => {
    try {
        const {
            limit = 10,
            orderBy = 'desc',
            page = 1,
            category = '',
            query = '',
        } = req.query;
        const randomPosts = await postObject.getRandomPosts(
            Number(limit),
            orderBy.toUpperCase(),
            Number(page),
            category
        );
        return res.status(OK).json(randomPosts);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting random posts',
            error: err.message,
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const { channelId } = req.params;
        const {orderBy = 'desc', limit = 10, page = 1, category = ''} = req.query;
        if (!channelId || !validator.isUUID(channelId)) {
            return res.status(BAD_REQUEST).json({
                message: 'CHANNELID_MISSING_OR_INVALID',
            });
        }
        const posts = await postObject.getPosts(
            channelId,
            Number(limit),
            orderBy.toUpperCase(),
            Number(page),
            category
        );
        return res.status(OK).json(posts);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting user posts',
            error: err.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId || !validator.isUUID(postId)) {
            return res.status(BAD_REQUEST).json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        let userIdentifier = req.ip;
        if (req.user) {
            const { user_id } = req.user;
            if (!user_id) {
                return res.status(BAD_REQUEST).json({ message: 'MISSING_USERID' });
            }
            await userObject.updateWatchHistory(postId, user_id);
            userIdentifier = user_id;
        }

        await postObject.updatePostViews(postId, userIdentifier);

        const post = await postObject.getPost(postId, req.user?.user_id);
        return res.status(OK).json(post);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: 'something wrong happened while getting the post',
            error: err.message,
        });
    }
};

const addPost = async (req, res) => {
    let postImage;
    try {
        const { user_id } = req.user;
        const { title, content, category } = req.body;
        const postId = uuid();

        if (!postId) throw new Error('POSTID_CREATION_UUID_ISSUE');
        if (!user_id) return res.status(BAD_REQUEST).json({ message: 'MISSING_USERID' });
        if (!title || !content || !category) return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        if (!req.file) return res.status(BAD_REQUEST).json({ message: 'MISSING_POSTIMAGE' });

        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath) throw new Error('POSTIMAGE_LOCALPATH_MULTER_ISSUE');

        postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) throw new Error('POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE');
        const postImageURL = postImage.url;

        const post = await postObject.createPost(
            postId,
            user_id,
            title,
            content,
            category,
            postImageURL
        );

        return res.status(OK).json(post);
    } catch (err) {
        if (postImage) await deleteFromCloudinary(postImage.url);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while adding a post',
            error: err.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({
                message: 'NOT_THE_OWNER_TO_DELETE_POST',
            });
        }

        const response = await deleteFromCloudinary(post.post_image);
        if (response.result !== 'ok') {
            throw new Error(
                'POSTIMAGE_DELETION_IMAGE_DELETION_CLOUDINARY_ISSUE'
            );
        }

        await postObject.deletePost(postId);
        return res.status(OK).json({ message: 'DELETION_SUCCESSFULL' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the post',
            error: err.message,
        });
    }
};

const updatePostDetails = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        const { title, content, category } = req.body;

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        if (!title || !content || !category) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({
                message: 'NOT_THE_OWNER_TO_UPDATE_POSTDETAILS',
            });
        }

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);

        const updatedPost = await postObject.updatePostDetails(
            postId,
            title,
            content,
            category,
            updatedAt
        );

        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something wrong happened while updating post details',
            error: err.message,
        });
    }
};

const updatePostImage = async (req, res) => {
    let postImage;
    try {
        const { postId } = req.params;
        const { user_id } = req.user;

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({
                message: 'NOT_THE_OWNER_TO_UPDATE_POSTIMAGE',
            });
        }

        if (!req.file) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_POSTIMAGE' });
        }

        const postImageLocalPath = req.file?.path;
        if (!postImageLocalPath) {
            throw new Error('POSTIMAGE_LOCALPATH_MULTER_ISSUE');
        }

        postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
            throw new Error('POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE');
        }

        const response = await deleteFromCloudinary(post.post_image);
        if (response.result !== 'ok') {
            throw new Error('OLD_POSTIMAGE_DELETION_CLODUINARY_ISSUE');
        }

        const postImageURL = postImage?.url;

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);

        const updatedPost = await postObject.updatePostImage(
            postId,
            postImageURL,
            updatedAt
        );

        return res.status(OK).json(updatedPost);
    } catch (err) {
        if (postImage) {
            await deleteFromCloudinary(postImage.url);
        }
        return res.status(SERVER_ERROR).json({
            message: 'something wrong happened while updating post image',
            error: err.message,
        });
    }
};

const togglePostVisibility = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({
                message: 'NOT_THE_OWNER_TO_TOGGLE_POSTVISIBILITY',
            });
        }

        const updatedPost = await postObject.togglePostVisibility(
            postId,
            !post.post_visibility
        );
        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something happened wrong while updating post visibility',
            error: err.message,
        });
    }
};

const toggleSavePost = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { postId } = req.params;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_USERID' });
        }

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'POSTID_MISSING_OR_INVALID' });
        }

        const post = postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json({ message: 'POST_NOT_FOUND' });
        }

        const response = await postObject.toggleSavePost(postId, user_id);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something happened wrong while toggling saved post',
            error: err.message,
        });
    }
};

const getSavedPosts = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { orderBy = 'desc', limit = 10, page = 1 } = req.query;
        if (!user_id) {
            return res.status(BAD_REQUEST).json('MISSING_USERID');
        }
        const savedPosts = await postObject.getSavedPosts(
            user_id,
            orderBy.toUpperCase(),
            Number(limit),
            Number(page)
        );
        return res.status(OK).json(savedPosts);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something happened wrong while getting saved posts',
            error: err.message,
        });
    }
};

export {
    getRandomPosts,
    getPosts,
    getPost,
    addPost,
    updatePostDetails,
    updatePostImage,
    deletePost,
    togglePostVisibility,
    toggleSavePost,
    getSavedPosts,
};
