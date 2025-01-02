import { BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';

/**
 * Generic middleware to check if the authenticated user is the owner of the resource.
 * @param {string} service - The Service name, ex: 'post', ' comment'.
 * @param {string} fieldToMatchWith - The field in the db to match with the user's ID.
 * @returns {Function} Middleware function specific to that service.
 */
export const isOwner = (service, fieldToMatchWith) => {
    return async (req, res, next) => {
        try {
            const resource = req[service];

            if (!resource[fieldToMatchWith] === req.user.user_id) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'not the owner' });
            }

            next();
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: `Something went wrong while checking ownership for ${service}`,
                err: err.message,
            });
        }
    };
};
