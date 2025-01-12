import validator from 'validator';
import { BAD_REQUEST } from '../constants/errorCodes.js';

export const validateUUID = (idParam) => {
    return (req, res, next) => {
        const id = req.params[idParam];
        if (!id || !validator.isUUID(id)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: `missing or invalid ${idParam}` });
        } else {
            return next();
        }
    };
};
