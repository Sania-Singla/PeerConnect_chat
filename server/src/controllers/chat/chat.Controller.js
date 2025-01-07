import getServiceObject from '../../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../../constants/errorCodes.js';

export const chatObject = getServiceObject('chats');

const addChat = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { userId } = req.params;

        // check if chat between these two already exists
        let chat = await chatObject.getChat([myId, userId]);
        if (chat) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'chat already exists' });
        }

        chat = await chatObject.addChat(uuid(), [myId, userId]);

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

export { addChat, deleteChat, getChats };
