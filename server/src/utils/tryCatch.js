import { ErrorHandler } from './errorHandler.js';

/**
 * try catch wrapper
 * @param {string} task - description of the operation to perform
 * @param {function} passedFunction - actual function to execute
 * @returns function wrapped in try catch
 */
export const tryCatch = (task, passedFunction) => async (req, res, next) => {
    try {
        await passedFunction(req, res, next);
    } catch (err) {
        console.log(`error in operation: ${task}`, err);
        next(new ErrorHandler(err.message));
    }
};
