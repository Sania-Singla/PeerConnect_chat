import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST, NOT_FOUND } from '../constants/errorCodes.js';
import { verifyOrderBy, tryCatch, ErrorHandler } from '../utils/index.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../helpers/index.js';
import { userObject } from './user.Controller.js';
import { categoryObject } from './category.Controller.js';
import validator from 'validator';

export const postObject = getServiceObject('posts');

// pending searchTerm (query)
const getRandomPosts = tryCatch('get random posts', async (req, res, next) => {
    const {
        limit = 10,
        orderBy = 'desc',
        page = 1,
        categoryId,
        query = '',
    } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    if (categoryId) {
        if (!validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        } else {
            const category = await categoryObject.getCategory(categoryId);
            if (!category) {
                return next(new ErrorHandler('category not found', NOT_FOUND));
            }
        }
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
});

const getPosts = tryCatch('get posts', async (req, res, next) => {
    const channelId = req.channel.user_id;
    const {
        orderBy = 'desc',
        limit = 10,
        page = 1,
        categoryId = '',
    } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    if (categoryId) {
        if (!validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        } else {
            const category = await categoryObject.getCategory(categoryId);
            if (!category) {
                return next(new ErrorHandler('category not found', NOT_FOUND));
            }
        }
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
            postsInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalPosts: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no posts found' });
    }
});

const getPost = tryCatch('get post', async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user?.user_id;

    const post = await postObject.getPost(postId, userId);
    if (!post) {
        return next(new ErrorHandler('post not found', NOT_FOUND));
    }

    let userIdentifier = userId || req.ip;

    // update user's watch history
    if (userId) {
        await userObject.updateWatchHistory(postId, userId);
    }

    // update post views
    await postObject.updatePostViews(postId, userIdentifier);

    return res.status(OK).json(post);
});

const addPost = tryCatch('add post', async (req, res, next) => {
    let postImage;
    try {
        const { title, content, categoryId } = req.body;

        if (!title || !content || !req.file)
            return next(new ErrorHandler('missing fields', BAD_REQUEST));

        if (!categoryId || !validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return next(new ErrorHandler('category not found', NOT_FOUND));
        }

        const result = await uploadOnCloudinary(req.file.path);
        postImage = result.secure_url;

        const post = await postObject.createPost({
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
        throw err;
    }
});

const deletePost = tryCatch('delete post', async (req, res) => {
    const { post_image, post_id } = req.post;
    await postObject.deletePost(post_id);
    await deleteFromCloudinary(post_image);
    return res.status(OK).json({ message: 'post deleted successfully' });
});

const updatePostDetails = tryCatch(
    'update post details',
    async (req, res, next) => {
        const { post_id } = req.post;
        const { title, content, categoryId } = req.body;

        if (!title || !content) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        if (!categoryId || !validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return next(new ErrorHandler('category not found', NOT_FOUND));
        }

        const updatedPost = await postObject.updatePostDetails({
            postId: post_id,
            title,
            content,
            categoryId: category.category_id,
        });

        return res.status(OK).json(updatedPost);
    }
);

const updateThumbnail = tryCatch(
    'update post thumbnail',
    async (req, res, next) => {
        let postImage;
        try {
            const { post_id, post_image } = req.post;

            if (!req.file) {
                return next(new ErrorHandler('missing thumbnail', BAD_REQUEST));
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
            throw err;
        }
    }
);

const togglePostVisibility = tryCatch(
    'toggle post visibility',
    async (req, res) => {
        const { post_id, post_visibility } = req.post;
        await postObject.togglePostVisibility(post_id, !post_visibility);
        return res
            .status(OK)
            .json({ message: 'post visibility toggled successfully' });
    }
);

const toggleSavePost = tryCatch('toggle save post', async (req, res) => {
    const { user_id } = req.user;
    const { post_id } = req.post;
    await postObject.toggleSavePost(user_id, post_id);
    return res.status(OK).json({ message: 'post save toggled successfully' });
});

const getSavedPosts = tryCatch('get saved posts', async (req, res, next) => {
    const { user_id } = req.user;
    const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
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
});

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
