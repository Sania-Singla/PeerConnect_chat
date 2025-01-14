import { Server } from 'socket.io';
import { httpServer, redisClient } from './server.js';
import { getSocketIds, getOtherMembers } from './helpers/index.js';
import { chatObject } from './controllers/chat.Controller.js';
import { onlineUserObject } from './controllers/onlineUser.Controller.js';
import { ErrorHandler } from './utils/errorHandler.js';

const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];

const io = new Server(httpServer, {
    cors: {
        origin: whitelist,
    },
});

io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    if (!userId) {
        return next(new ErrorHandler('Authentication error'));
    }
    socket.userId = userId;
    next();
});

io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log('User connected:', socket.id);

    // mark us online
    try {
        await Promise.all([
            redisClient.setEx(userId, 86400, socket.id), // 24hr exp
            onlineUserObject.markUserOnline(userId, socket.id),
        ]);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        return console.error('Error marking user as online:', err);
    }

    // get user chats
    const chats = await chatObject.getMyChats(userId);

    // Join rooms for user's chats
    chats.forEach(({ chat_id }) => socket.join(`chat:${chat_id}`));
    console.log(`User ${userId} joined rooms for his/her chats.`);

    // Notify others in rooms about user being online
    chats.forEach(({ chat_id }) => {
        socket.to(`chat:${chat_id}`).emit('userStatusChange', {
            userId,
            isOnline: true,
        });
    });

    // initial online users fetch
    socket.on('onlineUsers', async () => {
        const onlineUsers = await Promise.all(
            chats.map(async ({ members, chat_id }) => {
                const otherMembers = getOtherMembers(members, userId);
                const socketIds = await getSocketIds(otherMembers);
                return {
                    chatId: chat_id,
                    onlineUsers: otherMembers.filter((_, i) => socketIds[i]),
                };
            })
        );
        socket.emit('onlineUsers', onlineUsers);
    });

    // typing status
    socket.on('typing', ({ chatId }) => {
        socket.to(`chat:${chatId}`).emit('typing', { chatId, userId });
    });

    socket.on('stoppedTyping', ({ chatId }) => {
        socket.to(`chat:${chatId}`).emit('stoppedTyping', { chatId, userId });
    });

    // leaving or joining a chat
    socket.on('leaveChat', (chatId) => {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${userId} left chat ${chatId}`);
    });

    socket.on('joinChat', (chatId) => {
        socket.join(`chat:${chatId}`);
        console.log(`User ${userId} joined chat ${chatId}`);
    });

    // disconnection
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        // mark us offline
        try {
            await Promise.all([
                redisClient.del(userId),
                onlineUserObject.markUserOffline(userId),
            ]);
            console.log(`User ${userId} marked as offline`);
        } catch (err) {
            return console.error('Error marking user offline:', err);
        }

        // Although when a user disconnects, they automatically leave all the rooms they were part of
        chats.forEach(({ chat_id }) => {
            socket.leave(`chat:${chat_id}`);
        });

        // Notify others in rooms about user being offline
        chats.forEach(({ chat_id }) => {
            socket.to(`chat:${chat_id}`).emit('userStatusChange', {
                userId,
                isOnline: false,
            });
        });
    });
});

export { io };
