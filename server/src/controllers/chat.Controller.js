import { BAD_REQUEST } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/index.js';

const chatObject = getServiceObject('chats');

const addChat = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const otherUserId = req.params.userId;

        // check if both users exists

        const chat = await chatObject.addChat(uuid(), [myId, otherUserId]);

        return res.status(OK).json(chat);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        // check if chat exists

        await chatObject.deleteChat(chatId);

        return res.status(OK).json({ message: 'chat deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

// the collaborated users basically
const getChats = async (req, res) => {
    try {
        const myId = req.user.user_id;

        const chats = await chatObject.getChats(myId);

        if (chats.length) {
            return res.status(OK).json(chats);
        } else {
            return res.status(OK).json({ message: 'no chats found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the chats.',
            error: err.message,
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        // just the db part right now
        const myId = req.user.user_id;
        const otherUserId = req.params.userId;
        const { text } = req.body;
        let attachement = req.file?.path;

        if (!text && !attachement) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (attachement) {
            attachement = await uploadOnCloudinary(attachement);
        }

        const message = await chatObject.sendMessage(
            uuid(), // messageId
            myId,
            otherUserId,
            text,
            attachement
        );

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

        // check if that message exist
        const { attachement } = req.message;

        await chatObject.deleteMessage(messageId);

        await deleteFromCloudinary(attachement);

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
        const chatId = req.params;

        // check if chat exists

        const messages = await chatObject.getMessages(chatId);

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

export {
    addChat,
    deleteChat,
    deleteMessage,
    sendMessage,
    getMessages,
    getChats,
};
