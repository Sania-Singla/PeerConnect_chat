import { BAD_REQUEST } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { uploadOnCloudinary } from '../utils/index.js';

const individualChatObject = getServiceObject('individualChats');

const sendMessage = async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

export { getMessages, sendMessage };
