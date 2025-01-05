import { BAD_REQUEST } from '../constants/errorCodes';
import getServiceObject from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';

const messageObject = getServiceObject('SQLmessages');
export const sendMessage = async (req, res) => {
    try {
        const { recieverId } = req.params;
        const { message } = req.body;
        if (!recieverId) {
            return res.status(BAD_REQUEST).json({
                message: 'reciever not found',
            });
        }
        if (!message) {
            return;
        }
        const result = await messageObject.sendMessage({
            message_id: uuid(),
            sender_id: req.user.user_id,
            reciever_id: recieverId,
            message,
        });
        return res.status(OK).json(result);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while sending the message.',
            error: err.message,
        });
    }
};

export const getChats = async (req, res) => {
    try {
        const { recieverId } = req.params;
        if (!recieverId) {
            return res.status(BAD_REQUEST).json({
                message: 'reciever not found',
            });
        }
        const result = await messageObject.getMessages({
            senderId: req.user.user_id,
            recieverId,
        });

        if (result.length) {
            return res.status(OK).json(result);
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
