import { BAD_REQUEST } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { uploadOnCloudinary } from '../utils/index.js';

const messageObject = getServiceObject('messages');

const sendMessage = async (req, res) => {
    try {
        const recieverId = req.reciever.user_id;
        const senderId = req.user.user_id; // my ID
        const { text } = req.body;
        let attachment = req.file?.path;

        if (!content && !attachment) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (attachment) {
            attachment = await uploadOnCloudinary(attachment);
        }

        const result = await messageObject.sendMessage(
            uuid(), // messageId
            senderId,
            recieverId,
            text,
            attachment
        );

        return res.status(OK).json(result);
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
        const recieverId = req.reciever.reciever_id;
        const senderId = req.user.user_id; // my ID

        const result = await messageObject.getMessages(senderId, recieverId);

        if (result.length) {
            return res.status(OK).json(result);
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

const 

export { getMessages, sendMessage };
