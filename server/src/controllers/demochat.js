import { BAD_REQUEST } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { uploadOnCloudinary } from '../utils/index.js';

const messageObject = getServiceObject('individualChats');

const sendMessage = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.user_id;
        const { text } = req.body;
        let attachment = req.file?.path;

        if (!text && !attachment) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        if (attachment) {
            attachment = await uploadOnCloudinary(attachment);
        }

        const result = await messageObject.sendMessage(
            uuid(), // messageId
            myId,
            userId,
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
        const { userId } = req.params;
        const myId = req.user.user_id;

        const result = await messageObject.getMessages(myId, userId);

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

export { getMessages, sendMessage };
