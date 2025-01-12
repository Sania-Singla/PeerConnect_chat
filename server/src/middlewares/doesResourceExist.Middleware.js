import {
    BAD_REQUEST,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import validator from 'validator';

/**
 * Generic middleware to check does the resource exists or not.
 * @param {string} service - The Service name, ex: 'post', ' comment'.
 * @param {string} idParam - The name of the request parameter containing the resource ID.
 * @param {string} reqKey - The name of key in request object for direct access.
 * @returns {Function} Middleware function specific to that service.
 */
export const doesResourceExist = (service, idParam, reqKey) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];

            if (!resourceId || !validator.isUUID(resourceId)) {
                return res.status(BAD_REQUEST).json({
                    message: `missing or invalid ${idParam}`,
                });
            }

            const serviceObject = getServiceObject(service + 's');
            const resource =
                await serviceObject[`${service}Existance`](resourceId);

            if (!resource) {
                return res
                    .status(NOT_FOUND)
                    .json({ message: `${service} not found` });
            }

            if (reqKey) req[reqKey] = resource;
            next();
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: `Something went wrong while checking resource existance for ${idParam}`,
                err: err.message,
            });
        }
    };
};
