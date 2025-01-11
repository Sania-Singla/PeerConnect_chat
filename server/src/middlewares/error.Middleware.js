import { SERVER_ERROR } from '../constants/errorCodes.js';

export const errorMiddleware = (err, req, res, next) => {
    err.message ||= 'Undefined Error Occured';
    err.status ||= SERVER_ERROR;

    return res.status(err.status).json({ message: err.message });
};
