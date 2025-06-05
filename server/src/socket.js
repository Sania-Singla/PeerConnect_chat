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
    try {
        const user = socket.user;
        const userId = user?.user_id;
        const socketId = socket.id;

        console.log('User connected:', socketId);

        // ✨ register events first

        socket.on('typing', (chatId) =>
            socket.to(chatId).emit('typing', { chatId, targetUser: user })
        );

        socket.on('stoppedTyping', (chatId) =>
            socket
                .to(chatId)
                .emit('stoppedTyping', { chatId, targetUser: user })
        );

        // Editor events
        socket.on('joinCode', async (roomId) => {
            socket.join(`code:${roomId}`);
            console.log(`User ${userId} joined code room: ${roomId}`);

            // Add user to the coders set in redis
            await redisClient.sAdd(
                `code:${roomId}`,
                JSON.stringify({ ...user, socketId })
            );

            // get the coders in the room
            const members = await redisClient.sMembers(`code:${roomId}`);
            const coders = members.map((m) => JSON.parse(m));

            let code = '';
            if (coders.length > 1) {
                const targetCoder = coders.filter(
                    (c) => c.user_id === userId
                )[0];
                socket.to(targetCoder?.socketId).emit('giveCode');
                socket.on('takeCode', (currentCode) => (code = currentCode));
            }

            io.to(socketId).emit('joinedCode', { coders, code });
            socket.to(`code:${roomId}`).emit('userJoinedCode', user);
        });

        socket.on('codeChange', ({ roomId, code }) => {
            if (roomId)
                socket.to(`code:${roomId}`).emit('codeChange', { code });
        });

        socket.on('leaveCode', async (roomId) => {
            socket.to(`code:${roomId}`).emit('userLeftCode', user);
            await redisClient.sRem(
                `code:${roomId}`,
                JSON.stringify({ ...user, socketId })
            );
            socket.leave(`code:${roomId}`);
        });

        // ✨ now start other login (async)

        // mark me online
        try {
            await Promise.all([
                redisClient.setEx(userId, 3600, socketId), // 1hr exp
                onlineUserObject.markUserOnline(userId, socketId),
            ]);
            console.log(`User ${userId} marked as online.`);
        } catch (err) {
            console.error('Error marking user as online:', err);
            throw err;
        }

        // notify others about you being online
        const chats = await chatObject.getMyChats(userId);

        // Join rooms for your chats
        chats.forEach(({ chat_id }) => socket.join(chat_id));
        console.log(`User ${userId} joined rooms for his/her chats.`);

        // Notify in rooms now
        chats.forEach(({ chat_id }) =>
            socket.to(chat_id).emit('userStatusChange', {
                userId,
                targetUser: user,
                isOnline: true,
            })
        );

        // disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socketId);

            // mark me offline
            try {
                await Promise.all([
                    redisClient.del(userId),
                    onlineUserObject.markUserOffline(userId),
                ]);
                console.log(`User ${userId} marked as offline`);
            } catch (err) {
                console.error('Error marking user offline:', err);
                throw err;
            }

            // Notify others in rooms about us being offline in both chats and code rooms
            const rooms = [...socket.rooms];
            rooms.forEach(async (room) => {
                if (room.startsWith('code:')) {
                    socket.to(room).emit('userLeftCode', user);
                    await redisClient.sRem(
                        room,
                        JSON.stringify({ ...user, socketId })
                    );
                } else {
                    socket.to(room).emit('userStatusChange', {
                        userId,
                        targetUser: user,
                        isOnline: false,
                    });
                }
            });
        });
    } catch (err) {
        console.error('Error in socket:', err);
        socket.disconnect();
    }
});

export { io, redisClient, http };
