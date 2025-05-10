import { app } from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import { connectRedis } from './db/connectRedis.js';
import { chatObject } from './controllers/chat.Controller.js';
import { onlineUserObject } from './controllers/onlineUser.Controller.js';
import { CORS_OPTIONS } from './constants/options.js';
import { socketAuthenticator } from './middlewares/index.js';

const redisClient = await connectRedis();
const http = createServer(app);
const io = new Server(http, { cors: CORS_OPTIONS });

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

    // mark yourself online
    try {
        await Promise.all([
            redisClient.setEx(`user:${userId}`, 3600, socket.id), // 1hr exp
            onlineUserObject.markUserOnline(userId, socket.id),
        ]);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        return console.error('Error marking user as online:', err);
    }

    // notify others about you being online

    // get your chats
    const chats = await chatObject.getMyChats(userId);

    // Join rooms for your chats
    chats.forEach(({ chat_id }) => socket.join(`chat:${chat_id}`));
    console.log(`User ${userId} joined rooms for his/her chats.`);

    // Notify in rooms now
    chats.forEach(({ chat_id }) =>
        socket.to(`chat:${chat_id}`).emit('userStatusChange', {
            userId,
            targetUser: user,
            isOnline: true,
        })
    );

    socket.on('typing', (chatId) =>
        socket.to(`chat:${chatId}`).emit('typing', { chatId, targetUser: user })
    );

    socket.on('stoppedTyping', (chatId) =>
        socket
            .to(`chat:${chatId}`)
            .emit('stoppedTyping', { chatId, targetUser: user })
    );

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

        const chats = await chatObject.getMyChats(userId);

        // Although when a user disconnects, he automatically leave all the rooms he were part of
        chats.forEach(({ chat_id }) => socket.leave(`chat:${chat_id}`));

        // Notify others in rooms about us being offline
        chats.forEach(({ chat_id }) =>
            socket.to(`chat:${chat_id}`).emit('userStatusChange', {
                userId,
                targetUser: user,
                isOnline: false,
            })
        );
    });
});

export { io, redisClient, http };
