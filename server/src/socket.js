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

// Map to track which socket is waiting for code in each room
const waitingForCode = new Map();

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
    const userId = user?.user_id;

    console.log('User connected:', socket.id);

    try {
        await Promise.all([
            redisClient.setEx(userId, 3600, socket.id),
            onlineUserObject.markUserOnline(userId, socket.id),
        ]);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        console.error('Error marking user as online:', err);
    }

    const chats = await chatObject.getMyChats(userId);
    chats.forEach(({ chat_id }) => socket.join(chat_id));
    console.log(`User ${userId} joined rooms for chats.`);

    chats.forEach(({ chat_id }) =>
        socket.to(chat_id).emit('userStatusChange', {
            userId,
            targetUser: user,
            isOnline: true,
        })
    );

    socket.on('typing', (chatId) =>
        socket.to(chatId).emit('typing', { chatId, targetUser: user })
    );

    socket.on('stoppedTyping', (chatId) =>
        socket.to(chatId).emit('stoppedTyping', { chatId, targetUser: user })
    );

    // ========== CODE EDITOR EVENTS ==========

    socket.on('joinCode', async (roomId) => {
        console.log('joinCode event received:', roomId);

        socket.join(`code:${roomId}`);

        await redisClient.sAdd(
            `code:${roomId}`,
            JSON.stringify({ ...user, socketId: socket.id })
        );

        const members = await redisClient.sMembers(`code:${roomId}`);
        const coders = members.map((m) => JSON.parse(m));

        const otherCoders = coders.filter((c) => c.user_id !== userId);

        if (otherCoders.length > 0) {
            const targetCoder = otherCoders[0];
            console.log(`Requesting code from coder: ${targetCoder.user_id}`);

            // Store joining socket ID waiting for code
            waitingForCode.set(roomId, socket.id);

            // Ask other coder for the code
            socket.to(targetCoder.socketId).emit('giveCode');
        } else {
            // No other coders, send immediately
            io.to(socket.id).emit('joinedCode', { coders, code: '' });
            socket.to(`code:${roomId}`).emit('userJoinedCode', user);
        }
    });

    // Listen for 'takeCode' from *any* socket (the coder sending current code)
    socket.on('takeCode', async ({ roomId, currentCode }) => {
        console.log(`Received takeCode from ${userId} for room ${roomId}`);

        const joiningSocketId = waitingForCode.get(roomId);
        if (joiningSocketId) {
            const members = await redisClient.sMembers(`code:${roomId}`);
            const coders = members.map((m) => JSON.parse(m));

            // Send joinedCode event to the joining socket with the code
            io.to(joiningSocketId).emit('joinedCode', {
                coders,
                code: currentCode,
            });

            // Notify all in room that a user joined (the one who sent code)
            io.to(`code:${roomId}`).emit('userJoinedCode', user);

            waitingForCode.delete(roomId);
        } else {
            console.warn(
                `No waiting socket for room ${roomId} when takeCode received.`
            );
        }
    });

    socket.on('codeChange', ({ roomId, code }) => {
        if (roomId) socket.to(`code:${roomId}`).emit('codeChange', { code });
    });

    socket.on('leaveCode', (roomId) => {
        socket.to(`code:${roomId}`).emit('userLeftCode', user);
        socket.leave(`code:${roomId}`);
        // Also remove from Redis set if needed
        redisClient
            .sRem(
                `code:${roomId}`,
                JSON.stringify({ ...user, socketId: socket.id })
            )
            .catch(console.error);
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        try {
            await Promise.all([
                redisClient.del(userId),
                onlineUserObject.markUserOffline(userId),
            ]);
            console.log(`User ${userId} marked as offline`);
        } catch (err) {
            console.error('Error marking user offline:', err);
        }

        // Notify others about disconnect
        socket.rooms.forEach((room) => {
            if (room.startsWith('code:')) {
                socket.to(room).emit('userLeftCode', user);
            } else {
                socket.to(room).emit('userStatusChange', {
                    userId,
                    targetUser: user,
                    isOnline: false,
                });
            }
        });
    });
});

export { io, redisClient, http };
