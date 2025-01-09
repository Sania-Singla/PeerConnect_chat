import getServiceObject from '../../db/serviceObjects.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/index.js';
import { BAD_REQUEST, OK, SERVER_ERROR } from '../../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import { io, getSocketIdByUserId } from '../../socket.js';

const messageObject = getServiceObject('messages');
import { chatObject } from './chat.Controller.js';

const sendMessage = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { chatId } = req.params;
        const chat = req.chat;
        const { text } = req.body;
        console.log(req.body);
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
            attachment
        );

        if (text) {
            await chatObject.updateLastMessage(chatId, text);
        } else {
            await chatObject.updateLastMessage(chatId, req.file.fileName);
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

        const messages = await messageObject.getMessages(chatId);

        if (messages.length) {
            return res.status(OK).json(messages);
        } else {
            return res.status(OK).json({ message: 'no messages found' });
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
