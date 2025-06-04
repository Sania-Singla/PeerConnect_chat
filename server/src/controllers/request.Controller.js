import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';
import { io, redisClient } from '../socket.js';
import { userObject } from './user.Controller.js';

export const requestObject = getServiceObject('requests');

const sendRequest = tryCatch('send request', async (req, res, next) => {
    const { userId } = req.params;
    const { user_id, user_fullName, user_avatar, user_name } = req.user;

    const result = await requestObject.sendRequest(user_id, userId);

    if (typeof result === 'string') {
        return next(new ErrorHandler(result, BAD_REQUEST));
    } else {
        // emit event
        const request = {
            ...result,
            sender: {
                user_id,
                user_name,
                user_fullName,
                user_avatar,
            },
        };
        const socketId = await redisClient.get(`user:${userId}`);
        io.to(socketId).emit('newRequest', request);
        return res.status(OK).json(request);
    }
});

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

    await requestObject.rejectRequest(requestId);

    // emit event
    const socketId = redisClient.get(`user:${request.sender_id}`);
    io.to(socketId).emit('requestRejected', request);

    return res.status(OK).json({ message: 'request rejected successfully' });
});

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

    const newChat = await requestObject.acceptRequest(requestId);
    const otherMemberId = newChat.members.find(
        (m) => m.user_id !== req.user.user_id
    ).user_id;

    const otherMember = await userObject.getUser(otherMemberId);

    // emit event
    const theirSocketId = await redisClient.get(`user:${request.sender_id}`);
    const ourSocketId = await redisClient.get(`user:${req.user.user_id}`);
    const chat = {
        ...newChat,
        members: newChat.members.map((m) => ({
            ...m,
            isOnline:
                m.user_id === req.user.user_id ||
                (m.user_id === otherMemberId && theirSocketId),
        })),
    };

    const sockets = io.sockets.sockets;

    sockets.get(theirSocketId)?.join(`chat:${chat.chat_id}`);
    sockets.get(ourSocketId)?.join(`chat:${chat.chat_id}`);

    io.to(ourSocketId).emit('requestAccepted', {
        ...chat,
        avatar: otherMember.user_avatar,
        chat_name: otherMember.user_fullName,
    });

    io.to(theirSocketId).emit('requestAccepted', {
        ...chat,
        avatar: req.user.user_avatar,
        chat_name: req.user.user_fullName,
    });

    return res.status(OK).json(chat);
});

const getMyRequests = tryCatch('get my requests', async (req, res) => {
    const requests = await requestObject.getMyRequests(req.user.user_id);
    return res.status(OK).json(requests);
});

const getRequest = tryCatch('get request', async (req, res) => {
    const myId = req.user.user_id;
    const { userId } = req.params;

    const request = await requestObject.getRequest(userId, myId);

    if (request) return res.status(OK).json(request);
    else {
        return res.status(OK).json({ message: 'no request or chat found' });
    }
});

export { sendRequest, acceptRequest, rejectRequest, getMyRequests, getRequest };
