import getServiceObject from "../db/serviceObjects.js";
import { OK, BAD_REQUEST, SERVER_ERROR } from "../constants/errorCodes.js";
import { v4 as uuid } from "uuid";
import { uploadOnCloudinary, deleteFromCloudinary, getCurrentTimestamp } from "../utils/index.js";

const postObject = getServiceObject("posts");

// pending searchTerm (query)
const getRandomPosts = async (req, res) => {
    try {
        const { limit = 10, orderBy = "desc" } = req.query;
        const randomPosts = await postObject.getRandomPosts(limit, orderBy);
        return res.status(OK).json(randomPosts);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wromg while getting random posts",
            error: err.message,
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { orderBy = "desc", limit = 10 } = req.query;
        if (!userId) {
            return { message: "MISSING_USERID" };
        }
        const posts = await postObject.getPosts(userId, limit, orderBy);
        return res.status(OK).json(posts);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: "something went wrong while getting user posts",
            error: err.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTID" });
        }

        let userIdentifier = req.ip;
        if (req.user) {
            const { user_id } = req.user;
            if (!user_id) {
                return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
            }
            await postObject.updateWatchHistory(postId, user_id);
            userIdentifier = user_id;
        }

        await postObject.updatePostViews(postId, userIdentifier);

        const post = await postObject.getPost(postId, req.user?.user_id);
        return res.status(OK).json(post);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: "something wrong happened while getting the post",
            error: err.message,
        });
    }
};

const getWatchHistory = async (req, res) => {
    try {
        const { orderBy = "desc", limit = 10 } = req.query;
        const { user_id } = req.user;
        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }
        const response = await postObject.getWatchHistory(user_id, orderBy, Number(limit));
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting the watch history",
            error: err.message,
        });
    }
};

const clearWatchHistory = async (req, res) => {
    try {
        const { user_id } = req.user;
        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }
        const response = await postObject.clearWatchHistory(user_id);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while clearing the watch history",
            error: err.message,
        });
    }
};

const addPost = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { title, content } = req.body;
        const postId = uuid();

        if (!postId) {
            throw new Error({ message: "POSTID_CREATION_UUID_ISSUE" });
        }

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        if (!req.file) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTIMAGE" });
        }

        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath) {
            throw new Error("POSTIMAGE_LOCALPATH_MULTER_ISSUE");
        }

        const postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
            throw new Error({ message: "POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE" });
        }

        const postImageURL = postImage.url;

        const post = await postObject.createPost(postId, user_id, title, content, postImageURL);

        return res.status(OK).json(post);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while adding a post",
            error: err.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        if (!postId) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTID" });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_TO_DELETE_POST" });
        }

        const response = await deleteFromCloudinary(post.post_image);
        if (response.result !== "ok") {
            throw new Error({ message: "POSTIMAGE_DELETION_IMAGE_DELETION_CLOUDINARY_ISSUE" });
        }

        await postObject.deletePost(postId);
        return res.status(OK).json({ message: "DELETION_SUCCESSFULL" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while deleting the post",
            error: err.message,
        });
    }
};

const updatePostDetails = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        const { title, content } = req.body;

        if (!postId) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTID" });
        }

        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }
        // console.log(post);
        // console.log(post.post_ownerId, "\n", user_id);

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_TO_UPDATE_POSTDETAILS" });
        }

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);

        const updatedPost = await postObject.updatePostDetails(postId, title, content, updatedAt);

        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something wrong happened while updating post details",
            error: err.message,
        });
    }
};

const updatePostImage = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;

        if (!postId) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTID" });
        }

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_TO_UPDATE_POSTIMAGE" });
        }

        if (!req.file) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_POSTIMAGE" });
        }

        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath) {
            throw new Error({ message: "POSTIMAGE_LOCALPATH_MULTER_ISSUE" });
        }

        const postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
            throw new Error({ message: "POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE" });
        }

        const response = await deleteFromCloudinary(post.post_image);
        if (response.result !== "ok") {
            throw new Error({ message: "OLD_POSTIMAGE_DELETION_CLODUINARY_ISSUE" });
        }

        const postImageURL = postImage.url;

        const now = new Date();
        const updatedAt = getCurrentTimestamp(now);
        const updatedPost = await postObject.updatePostImage(postId, postImageURL, updatedAt);

        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something wrong happened while updating post image",
            error: err.message,
        });
    }
};

const togglePostVisibility = async (req, res) => {
    try {
        // const { visibility } = req.query;
        const { postId } = req.params;
        const { user_id } = req.user;

        const post = await postObject.getPost(postId);
        if (!post) {
            return res.status(BAD_REQUEST).json(post);
        }

        if (post.post_ownerId !== user_id) {
            return res.status(BAD_REQUEST).json({ message: "NOT_THE_OWNER_TO_TOGGLE_POSTVISIBILITY" });
        }

        const updatedPost = await postObject.togglePostVisibility(postId, !post.post_visibility);
        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something happened wrong while updating post visibility",
            error: err.message,
        });
    }
};

const toggleSavePost = async (req, res) => {
    try {
        const {user_id} = req.user;
        const {postId} = req.body;

        if(!user_id){
            return res.status(BAD_REQUEST).json({ message : "MISSING_USERID"})
        }

        if(!postId){
            return res.status(BAD_REQUEST).json({ message : "MISSING_POSTID"})
        }
        
        const post = postObject.getPost(postId);
        if (!post){
            return res.status(BAD_REQUEST).json({ message : "POST_NOT_FOUND"})
        }

        const response = await postObject.toggleSavePost(postId, user_id);
        return res.status(BAD_REQUEST).json(response);
        
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something happened wrong while toggling post saving",
            error: err.message,
        });
    }
};

const getSavedPosts = async (req, res) => {
    try {
        const {user_id}= req.user;
        if(!user_id){
            return res.status(BAD_REQUEST).json("MISSING_USERID");
        }
        const [savedPosts]= await postObject.getSavedPosts(user_id);
        return res.status(OK).json(savedPosts);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something happened wrong while getting saved posts",
            error: err.message,
        });
    }
};

export {
    getRandomPosts,
    getPosts,
    getPost,
    clearWatchHistory,
    getWatchHistory,
    addPost,
    updatePostDetails,
    updatePostImage,
    deletePost,
    togglePostVisibility,
    toggleSavePost,
    getSavedPosts,
};
