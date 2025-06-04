import { ErrorHandler, tryCatch } from '../utils/index.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { BAD_REQUEST, OK } from '../constants/errorCodes.js';
import { uploadOnCloudinary } from '../helpers/index.js';
import { io } from '../socket.js';

export const messageObject = getServiceObject('messages');

const getMessages = tryCatch('get messages', async (req, res, next) => {
    const { chatId } = req.params;
    const { limit = 30, page = 1 } = req.query;
    const chat = req.chat;

    if (!chat.members.find(({ user_id }) => user_id === req.user.user_id)) {
        return next(
            new ErrorHandler('you are not a member of this chat', BAD_REQUEST)
        );
    }

    const messages = await messageObject.getMessages(chatId, limit, page);

    if (messages.docs.length) {
        return res.status(OK).json({
            messages: messages.docs,
            messagesInfo: {
                totalMessages: messages.totalDocs,
                hasPrevPage: messages.hasPrevPage,
                hasNextPage: messages.hasNextPage,
            },
        });
    } else {
        return res.status(OK).json({ message: 'No messages found' });
    }
});

const sendMessage = tryCatch('send message', async (req, res, next) => {
    const { chatId } = req.params;
    const { text = '' } = req.body;
    const attachments = req.files || []; // undefined if no file
    const chat = req.chat;
    const me = req.user;

    if (!chat.members.find(({ user_id }) => user_id === me.user_id)) {
        return next(
            new ErrorHandler('you are not a member of this chat', BAD_REQUEST)
        );
    }

    if (!text && !attachments.length) {
        return next(new ErrorHandler('message can not be empty', BAD_REQUEST));
    }

    const detailedAttachments = await Promise.all(
        attachments.map(async ({ path, size, mimetype, originalname }) => {
            const { public_id, secure_url } = await uploadOnCloudinary(path);
            return {
                publicId: public_id,
                url: secure_url,
                type: mimetype,
                name: originalname,
                size,
            };
        })
    );

    const message = await messageObject.sendMessage(
        chatId,
        me.user_id,
        text,
        detailedAttachments
    );

    const transformedMessage = {
        ...message,
        sender: {
            user_id: me.user_id,
            user_name: me.user_name,
            user_fullName: me.user_fullName,
            user_avatar: me.user_avatar,
        },
        attachments: detailedAttachments,
    };

    io.to(`chat:${chatId}`).emit('newMessage', {
        chatId,
        message: transformedMessage,
    });

    return res.status(OK).json(transformedMessage);
});

//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING

const deleteMessage = tryCatch('delete message', async (req, res, next) => {
    const { messageId } = req.params;
    const message = req.message;
    const myId = req.user.user_id;

    if (!message.sender_id === myId) {
        return next(
            new ErrorHandler('you can only delete your messages', BAD_REQUEST)
        );
    }

    const deletedMessage = await messageObject.deleteMessage(messageId);

    // todo: might emit socket event

    return res.status(OK).json({ message: 'message deleted successfully' });
});

const editMessage = tryCatch('edit message', async (req, res, next) => {
    const { messageId } = req.params;
    const { newText } = req.body;
    const message = req.message;
    const myId = req.user.user_id;

    if (!message.sender_id === myId) {
        return next(
            new ErrorHandler('you can only edit your messages', BAD_REQUEST)
        );
    }

    if (Date.now() - message.message_createdAt.getTime() > 60000) {
        return next(
            new ErrorHandler(
                'you can only edit messages within 1min',
                BAD_REQUEST
            )
        );
    }

    const editedMessage = await messageObject.editMessage(messageId, newText);

    // todo: might emit socket event

    return res.status(OK).json({ message: 'message edited successfully' });
});

export { getMessages, sendMessage, deleteMessage, editMessage };
