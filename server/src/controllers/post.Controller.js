import getServiceObject from '../db/serviceObjects.js';
import {
    OK,
    BAD_REQUEST,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    getCurrentTimestamp,
} from '../utils/index.js';
import validator from 'validator';
import { userObject } from './user.Controller.js';

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
        const {
            orderBy = 'desc',
            limit = 10,
            page = 1,
            category = '',
        } = req.query;

        if (!channelId || !validator.isUUID(channelId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid channelId' });
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
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid postId' });
        }

        let userIdentifier = req.ip;

        if (req.user) {
            const { user_id } = req.user;
            await userObject.updateWatchHistory(postId, user_id);
            userIdentifier = user_id;
        }

        await postObject.updatePostViews(postId, userIdentifier);

        const post = await postObject.getPost(postId, req.user?.user_id);
        return res.status(OK).json(post);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the post',
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

        if (!title || !content || !category)
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });

        if (!req.file)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing thumbnail' });

        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath)
            throw new Error('thumbnail local path multer issue');
        postImage = await uploadOnCloudinary(postImageLocalPath);

        const post = await postObject.createPost({
            postId,
            user_id,
            title,
            content,
            category,
            postImageURL: postImage.url,
        });
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
        const { post_image, post_id } = req.post;

        await deleteFromCloudinary(post_image);

        await postObject.deletePost(post_id);
        return res.status(OK).json({ message: 'post deleted' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the post',
            error: err.message,
        });
    }
};

const updatePostDetails = async (req, res) => {
    try {
        const { post_id } = req.post;
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);

        const updatedPost = await postObject.updatePostDetails({
            postId: post_id,
            title,
            content,
            category,
            updatedAt,
        });

        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something wrong happened while updating post details',
            error: err.message,
        });
    }
};

const updateThumbnail = async (req, res) => {
    let postImage;
    try {
        const { post_id, post_image } = req.post;

        if (!req.file) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing thumbnail' });
        }

        const postImageLocalPath = req.file?.path;
        if (!postImageLocalPath) {
            throw new Error('thumbnail local path multer issue');
        }

        postImage = await uploadOnCloudinary(postImageLocalPath);
       
        // delete old thumbnail
        await deleteFromCloudinary(post_image);

        const postImageURL = postImage?.url;

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);

        const updatedPost = await postObject.updatePostImage(
            post_id,
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
        const { post_id, post_visibility } = req.post;

        const updatedPost = await postObject.togglePostVisibility(
            post_id,
            !post_visibility
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

        if (!postId || !validator.isUUID(postId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid postId' });
        }

        const post = postObject.getPost(postId);
        if (!post) {
            return res.status(NOT_FOUND).json({ message: 'post not found' });
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
    updateThumbnail,
    deletePost,
    togglePostVisibility,
    toggleSavePost,
    getSavedPosts,
};
