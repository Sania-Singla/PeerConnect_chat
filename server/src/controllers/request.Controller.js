import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';

export const requestObject = getServiceObject('requests');

const sendRequest = tryCatch('send request', async (req, res, next) => {
    const { userId } = req.params;
    const myId = req.user.user_id;

    const result = await requestObject.sendRequest(myId, userId);

    if (typeof result === 'string') {
        return next(new ErrorHandler(result, BAD_REQUEST));
    } else {
        return res.status(OK).json(result);
    }
});

// could remove the request as well for cleanup
const rejectRequest = tryCatch('reject request', async (req, res, next) => {
    const { requestId } = req.params;
    const request = req.request; // resource exist middleware

    if (request.receiver_id !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'we are not authorized to reject the request',
                BAD_REQUEST
            )
        );
    }

    if (request.status !== 'pending') {
        return next(
            new ErrorHandler(
                "you've already responded to the request",
                BAD_REQUEST
            )
        );
    }

    await requestObject.rejectRequest(requestId);
    return res.status(OK).json({ message: 'request has been rejected' });
});

// could remove the request as well for cleanup if dont want to show on frontend
const acceptRequest = tryCatch('accept request', async (req, res, next) => {
    const { requestId } = req.params;
    const request = req.request; // middleware

    if (request.receiver_id !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'you are not authorized to accept the request',
                BAD_REQUEST
            )
        );
    }

    if (request.status !== 'pending') {
        return next(
            new ErrorHandler(
                "you've already responded to the request",
                BAD_REQUEST
            )
        );
    }

    const newChat = await requestObject.acceptRequest(requestId);

    // todo: emit event to refetch chats because new 1-1 chat has been created

    return res.status(OK).json(newChat);
});

const getMyRequests = tryCatch('get my requests', async (req, res) => {
    const myId = req.user.user_id;
    const { status = '' } = req.query;

    const requests = await requestObject.getMyRequests(myId, status);
    if (requests.length) {
        return res.status(OK).json(requests);
    } else {
        return res.status(OK).json({ message: 'no requests found' });
    }
});

export { sendRequest, acceptRequest, rejectRequest, getMyRequests };
