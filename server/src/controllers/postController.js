import getServiceObject from "../db/serviceObjects.js";
import { OK, BAD_REQUEST, SERVER_ERROR, FORBIDDEN, COOKIE_OPTIONS } from "../constants/errorCodes.js";
import { v4 as uuid } from "uuid";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postObject = getServiceObject("posts");

const getRandomPosts = async (req, res) => {
    try {
        const randomPosts = await postObject.getRandomPosts();
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
        const { user_id } = req.user; //if login show diff and if logout show diff, so verify jwt first
        const {isLiked}= req.params;
        if(!user_id){
            return { message : "USERID_MISSING"}
        }
        const posts = await postObject.getChannelPosts(user_id, isLiked);
        return res.status(OK).json(posts);
    } catch (err) {
        // res.status(SERVER_ERROR).json( {message : `something went wrong while getting posts of user with user_id = ${user_id}`})
        res.status(SERVER_ERROR).json({
            message: "something went wrong while getting posts of user",
        });
    }
};

const getPost = async (req, res) => {
    try {
        const {user_id} = req.user;
        if(!user_id){
            return { message : "USERID_MISSING"}
        }
        const { postId , isLiked} = req.params;
        const post = await postObject.getPost(postId, isLiked);
        return res.status(OK).json(post);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: "something wrong happened while getting the post",
        });
    }
};

const addPost = async (req, res) => {
    try {
        const postId = uuid();
        if (!postId) {
            return res.status(SERVER_ERROR).json({ message: "POSTID_CREATION_UUID_ISSUE" });
        }

        const { user_id } = req.user; //from middle ware verify jwt
        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "OWNERID_MISSINIG" });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(BAD_REQUEST).json({ message: "FIELDS_MISSING" });
        }
        //post already exists or not?
        
        if (!req.files?.postImage) {
            res.status(BAD_REQUEST).json({
                message: "POSTIMAGE_MISSING",
            });
        }

        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath) {
            throw new Error("POSTIMAGE_LOCALPATH_MULTER_ISSUE"); //2 verifications??
        }

        const postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
            return res.status(SERVER_ERROR).json({
                message: "POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE",
            });
        }

        const postImageURL = postImage.url;

        await postObject.createPost(postId, user_id, title, content, postImageURL);
        const post = await postObject.getPost(postId);

        return res.status(OK).json(post);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while adding a post",
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        await postObject.deletePost(post_id);
        return res.status(OK).json({
            message: "DELETION_SUCCESSFULL",
        });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while deleting",
        });
    }
};

const updatePostDetails = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(BAD_REQUEST).json({
                message: "POSTID_MISSING",
            });
        }
        const { postTitle, postContent, postUpdatedAt } = req.body;
        if(!postTitle || postContent){
            return res.status(BAD_REQUEST).json({
                message : "FIELDS_MISSING"
            })
        }
        await postObject.updatePostDetails(postId, postTitle, postContent, postUpdatedAt);
        const updatedPost = await getPost(postId);
        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something wrong happened while updating post details",
        });
    }
};

const updatePostImage = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(BAD_REQUEST).json({
                message: "POSTID_MISSING",
            });
        }
        // const post = await postObject.getPost(post_id);
        if (!req.file?.postImage) {
            return res.status(BAD_REQUEST).json({
                message: "POSTIMAGE_MISSING",
            });
        }
        const postImageLocalPath = req.file.path;
        if (!postImageLocalPath) {
            return { message: "POSTIMAGE_LOCALPATH_MULTER_ISSUE" };
        }

        const postImage = await uploadOnCloudinary(postImageLocalPath);
        if (!postImage) {
            return { message: "POSTIMAGE_UPLOAD_CLOUDINARY_ISSUE" };
        }

        const postImageURL = postImage.url;
        await postObject.updatePostImage(postId, postImageURL);

        const updatedPost = await postObject.getPost(postId);

        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something wrong happened while updating post image",
        });
    }
};

const togglePostVisibility = async (req, res) => {
    try {
        const { postId } = req.params;
        const { isVisible } = req.body;
        await postObject.togglePostVisibility(postId, isVisible);
        const updatedPost = await postObject.getPost(postId);
        return res.status(OK).json(updatedPost);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something happened wrong while updating postVisibility",
        });
    }
};

export { getRandomPosts, getPosts, getPost, addPost, updatePostDetails, updatePostImage, deletePost, togglePostVisibility };
