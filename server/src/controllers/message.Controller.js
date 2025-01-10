import getServiceObject from '../db/serviceObjects.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/index.js';
import { BAD_REQUEST, OK, SERVER_ERROR } from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import { io, getSocketIdByUserId } from '../socket.js';

const messageObject = getServiceObject('messages');
import { chatObject } from './chat.Controller.js';

const sendMessage = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { chatId } = req.params;
        const chat = req.chat;
        const { text } = req.body;
        let attachment = req.file?.path;

        if (!text && !attachment) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (attachment) {
            attachment = await uploadOnCloudinary(attachment);
        }

        const message = await messageObject.sendMessage(
            uuid(), // messageId
            chatId,
            myId,
            text,
            attachment?.secure_url,
            req.file?.originalname
        );

        if (text) {
            await chatObject.updateLastMessage(chatId, text);
        } else {
            await chatObject.updateLastMessage(chatId, req.file?.originalname);
        }

        // socket.io
        const reciverId = chat.participants.find((userId) => userId !== myId);

        const recieverSocketId = await getSocketIdByUserId(reciverId);

        io.to(recieverSocketId).emit('newMessage', message);

        return res.status(OK).json(message);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while sending the message.',
            error: err.message,
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        // just the db part right now
        const { messageId } = req.params;

        const { attachement } = req.message;

        await messageObject.deleteMessage(messageId);

        if (attachement) await deleteFromCloudinary(attachement);

        return res.status(OK).json({ message: 'message deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while sending the message.',
            error: err.message,
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const result = await messageObject.getMessages(chatId, limit, page);

        if (result?.docs.length) {
            const data = {
                messages: result.docs,
                messagesInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalMessages: result.totalDocs,
                },
            };
            setTimeout(() => {
                return res.status(OK).json(data);
            }, 3000);
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

export { deleteMessage, sendMessage, getMessages };
