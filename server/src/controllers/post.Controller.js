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
    verifyOrderBy,
} from '../utils/index.js';
import { userObject } from './user.Controller.js';
import { categoryObject } from './category.Controller.js';
import validator from 'validator';

export const postObject = getServiceObject('posts');

// pending searchTerm (query)
const getRandomPosts = async (req, res) => {
    try {
        const {
            limit = 10,
            orderBy = 'desc',
            page = 1,
            categoryId = '',
            query = '',
        } = req.query;

        if (categoryId) {
            if (!validator.isUUID(categoryId)) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'missing or invalid categoryId' });
            } else {
                const category = await categoryObject.getCategory(categoryId);
                if (!category) {
                    return res
                        .status(NOT_FOUND)
                        .json({ message: 'category not found' });
                }
            }
        }

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
        }

        const result = await postObject.getRandomPosts(
            Number(limit),
            orderBy.toUpperCase(),
            Number(page),
            categoryId
        );

        if (result.docs.length) {
            const data = {
                posts: result.docs,
                postaInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalPosts: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res.status(OK).json({ message: 'no posts found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting random posts',
            error: err.message,
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const channelId = req.channel.user_id;
        const {
            orderBy = 'desc',
            limit = 10,
            page = 1,
            categoryId = '',
        } = req.query;

        if (categoryId) {
            if (!validator.isUUID(categoryId)) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'missing or invalid categoryId' });
            } else {
                const category = await categoryObject.getCategory(categoryId);
                if (!category) {
                    return res
                        .status(NOT_FOUND)
                        .json({ message: 'category not found' });
                }
            }
        }

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
        }

        const result = await postObject.getPosts(
            channelId,
            Number(limit),
            orderBy.toUpperCase(),
            Number(page),
            categoryId
        );

        if (result.docs.length) {
            const data = {
                posts: result.docs,
                postaInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalPosts: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res.status(OK).json({ message: 'no posts found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting user posts',
            error: err.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.user_id;

        let userIdentifier = userId || req.ip;

        // update user's watch history
        if (userId) {
            await userObject.updateWatchHistory(postId, userId);
        }

        // update post views
        await postObject.updatePostViews(postId, userIdentifier);

        const post = await postObject.getPost(postId, userId);

        return res.status(OK).json(post);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the post',
            error: err.message,
        });
    }
};

const addPost = async (req, res) => {
    let postImage;
    try {
        const { title, content, categoryId } = req.body;

        if (!title || !content || !req.file)
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });

        if (!categoryId || !validator.isUUID(categoryId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid categoryId' });
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return res
                .status(NOT_FOUND)
                .json({ message: 'category not found' });
        }

        const result = await uploadOnCloudinary(req.file.path);
        postImage = result.secure_url;

        const post = await postObject.createPost({
            postId: uuid(),
            userId: req.user.user_id,
            title,
            content,
            categoryId: category.category_id,
            postImage,
        });
        return res.status(OK).json(post);
    } catch (err) {
        if (postImage) {
            await deleteFromCloudinary(postImage);
        }
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while adding a post',
            error: err.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { post_image, post_id } = req.post;
        await postObject.deletePost(post_id);
        await deleteFromCloudinary(post_image);
        return res.status(OK).json({ message: 'post deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the post',
            error: err.message,
        });
    }
};

const updatePostDetails = async (req, res) => {
    try {
        const { post_id } = req.post;
        const { title, content, categoryId } = req.body;

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (!categoryId || !validator.isUUID(categoryId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing or invalid categoryId' });
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return res
                .status(NOT_FOUND)
                .json({ message: 'category not found' });
        }

        const updatedPost = await postObject.updatePostDetails({
            postId: post_id,
            title,
            content,
            categoryId: category.category_id,
        });

        return res.status(OK).json(updatedPost);
    } catch (err) {
        console.log(err);
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

        const result = await uploadOnCloudinary(req.file?.path);
        postImage = result.secure_url;

        // delete old thumbnail
        await deleteFromCloudinary(post_image);

        const updatedPost = await postObject.updatePostImage(
            post_id,
            postImage
        );

        return res.status(OK).json(updatedPost);
    } catch (err) {
        if (postImage) {
            await deleteFromCloudinary(postImage);
        }
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something wrong happened while updating post image',
            error: err.message,
        });
    }
};

const togglePostVisibility = async (req, res) => {
    try {
        const { post_id, post_visibility } = req.post;
        await postObject.togglePostVisibility(post_id, !post_visibility);
        return res
            .status(OK)
            .json({ message: 'post visibility toggled successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something happened wrong while updating post visibility',
            error: err.message,
        });
    }
};

const toggleSavePost = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { post_id } = req.post;

        await postObject.toggleSavePost(user_id, post_id);

        return res
            .status(OK)
            .json({ message: 'post save toggled successfully' });
    } catch (err) {
        console.log(err);
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

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
        }

        const result = await postObject.getSavedPosts(
            user_id,
            orderBy.toUpperCase(),
            Number(limit),
            Number(page)
        );

        if (result.docs.length) {
            const data = {
                posts: result.docs,
                postaInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalPosts: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res.status(OK).json({ message: 'no saved posts' });
        }
    } catch (err) {
        console.log(err);
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
