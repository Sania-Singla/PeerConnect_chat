import { app } from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import { connectRedis } from './db/connectRedis.js';
import { getSocketIds, getOtherMembers } from './helpers/index.js';
import { chatObject } from './controllers/chat.Controller.js';
import { onlineUserObject } from './controllers/onlineUser.Controller.js';
import { CORS_OPTIONS } from './constants/options.js';
import { socketAuthenticator } from './middlewares/index.js';

// Connect to Redis
const redisClient = await connectRedis();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: CORS_OPTIONS,
});

// middleware for extracting user from socket
io.use((socket, next) => {
    const req = socket.request;
    const res = {};

    cookieParser()(
        req,
        res,
        async (err) => await socketAuthenticator(req, err, socket, next)
    );
});

io.on('connection', async (socket) => {
    const user = socket.user;
    const userId = user.user_id;

    console.log('User connected:', socket.id);

    // mark us online
    try {
        await Promise.all([
            redisClient.setEx(`user:${userId}`, 3600, socket.id), // 1hr exp
            onlineUserObject.markUserOnline(userId, socket.id),
        ]);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        return console.error('Error marking user as online:', err);
    }

    // get user chats
    const chats = await chatObject.getMyChats(userId); // todo: take care of changes in chats (new chat, leaving chat, deleting chat)

    // Join rooms for user's chats
    chats.forEach(({ chat_id }) => socket.join(`chat:${chat_id}`));
    console.log(`User ${userId} joined rooms for his/her chats.`);

    // Notify others in rooms about user being online
    chats.forEach(({ chat_id }) => {
        socket.to(`chat:${chat_id}`).emit('userStatusChange', {
            userId: userId,
            completeUser: user,
            isOnline: true,
        });
    });

    // initial online users fetch
    socket.on('onlineUsers', async (chats) => {
        const onlineUsers = await Promise.all(
            chats.map(async ({ members, chat_id }) => {
                const otherMembers = getOtherMembers(members, userId);
                const otherMemberIds = otherMembers.map(
                    ({ user_id }) => user_id
                );
                const socketIds = await getSocketIds(otherMemberIds);
                return {
                    chatId: chat_id,
                    onlineUserIds: otherMemberIds.filter(
                        (_, i) => socketIds[i]
                    ),
                };
            })
        );

        // add isOnline property for each member
        const modifiedChats = chats.map((chat) => {
            const onlineUserIds = onlineUsers.find(
                (c) => c.chatId === chat.chat_id
            )?.onlineUserIds;

            return {
                ...chat,
                members: chat.members.map((m) => ({
                    ...m,
                    isOnline: onlineUserIds.includes(m.user_id),
                })),
            };
        });

        socket.emit('onlineUsers', modifiedChats);
    });

    // typing status
    socket.on('typing', (chatId) => {
        socket.to(`chat:${chatId}`).emit('typing', {
            chatId,
            userId: userId,
            completeUser: user,
        });
    });

    socket.on('stoppedTyping', (chatId) => {
        socket.to(`chat:${chatId}`).emit('stoppedTyping', {
            chatId,
            userId: userId,
            completeUser: user,
        });
    });

    // leaving or joining a chat (new chat creation/deletion/leaving)
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
                redisClient.del(`user:${userId}`),
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
                userId: userId,
                completeUser: user,
                isOnline: false,
            });
        });
    });
});

export { io, redisClient, httpServer };
