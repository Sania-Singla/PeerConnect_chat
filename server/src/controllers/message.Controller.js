import getServiceObject from '../db/serviceObjects.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/index.js';
import { BAD_REQUEST, OK, SERVER_ERROR } from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';

const messageObject = getServiceObject('messages');

const sendMessage = async (req, res) => {
    try {
        // just the db part right now
        const myId = req.user.user_id;
        const { chatId } = req.params;
        const { text } = req.body;
        let attachement = req.file?.path;

        if (!text && !attachement) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (attachement) {
            attachement = await uploadOnCloudinary(attachement);
        }

        const message = await messageObject.sendMessage(
            uuid(), // messageId
            chatId,
            myId,
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

        await messageObject.deleteMessage(messageId);

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
        const { chatId } = req.params;

        // check if chat exists

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
