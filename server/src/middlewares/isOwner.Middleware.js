import {
    BAD_REQUEST,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import validator from 'validator';

/**
 * Generic middleware to check if the authenticated user is the owner of the resource.
 * @param {string} service - The Service to create the serviceObject from ex: 'post', ' comment'.
 * @param {string} idParam - The name of the request parameter containing the resource ID.
 * @param {string} fieldToMatchWith - The field in the model to match with the authenticated user's ID.
 * @param {string} requestKey - The key to attach the resource to on the request object.
 * @returns {Function} Express middleware function specific for that model.
 */

const isOwner = (service, idParam, fieldToMatchWith, requestKey) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];
            const { user_id } = req.user;

            if (!resourceId || !validator.isUUID(resourceId)) {
                return res.status(BAD_REQUEST).json({
                    message: `missing or invalid ${idParam}`,
                });
            }

            const serviceObject = getServiceObject(service);
            let resource;

            switch (service) {
                case 'post': {
                    resource = await serviceObject.getPost(resourceId, user_id);
                    break;
                }
                case 'comment': {
                    resource = await serviceObject.getComment(
                        resourceId,
                        user_id
                    );
                    break;
                }
                default: {
                    console.log('invalid service type');
                }
            }

            if (!resource) {
                return res
                    .status(NOT_FOUND)
                    .json({ message: `${service} not found` });
            }

            if (!resource[fieldToMatchWith].equals(user_id)) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'not the owner' });
            }

            // Attach the resource to the request object
            req[requestKey] = resource;
            next();
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: `Something went wrong while checking ownership for ${idParam}`,
                err: err.message,
            });
        }
    };
};

const isPostOwner = isOwner('post', 'postId', 'post_ownerId', 'post');
const isCommentOwner = isOwner('comment', 'commentId', 'user_id', 'comment');

export { isOwner, isPostOwner, isCommentOwner };
