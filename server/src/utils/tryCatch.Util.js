import { ErrorHandler } from './index.js';

/**
 * try catch wrapper
 * @param {string} task - description of the operation to perform
 * @param {function} func - actual function to execute
 * @returns function wrapped in try catch
 */
export const tryCatch = (task, func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (err) {
        console.log(`[Error in: ${task}]`, err);
        next(new ErrorHandler(err.message));
    }
};
