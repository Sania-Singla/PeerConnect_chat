import express from 'express';
import {
    verifyJwt,
    validateUUID,
    doesResourceExist,
} from '../middlewares/index.js';
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getMyRequests,
    getRequest,
} from '../controllers/request.Controller.js';

export const requestRouter = express.Router();

const doesRequestExist = doesResourceExist('request', 'requestId', 'request');

requestRouter.use(verifyJwt);

requestRouter.route('/send/:userId').post(validateUUID('userId'), sendRequest);

requestRouter
    .route('/accept/:requestId')
    .patch(doesRequestExist, acceptRequest);

requestRouter
    .route('/reject/:requestId')
    .patch(doesRequestExist, rejectRequest);

requestRouter.route('/:userId').get(getRequest);

requestRouter.route('/').get(getMyRequests);
