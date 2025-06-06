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
        const user = socket.user,
            userId = user?.user_id,
            socketId = socket.id;
        const coderKey = JSON.stringify({ ...user, socketId });

        console.log('[USER CONNECTED]', { username: user.user_name, socketId });

        // # ======================= register events first ========================

        socket.on('typing', (chatId) =>
            socket.to(chatId).emit('typing', { chatId, targetUser: user })
        );

        socket.on('stoppedTyping', (chatId) =>
            socket
                .to(chatId)
                .emit('stoppedTyping', { chatId, targetUser: user })
        );

        // Editor events
        socket.on('syncCode', ({ socketId, code }) =>
            socket.to(socketId).emit('syncCode', { code })
        );

        socket.on('codeChange', ({ roomId, code }) =>
            socket.to(`code:${roomId}`).emit('codeChange', { code })
        );

        socket.on('leaveCode', async (roomId) => {
            socket.to(`code:${roomId}`).emit('userLeftCode', user);
            await redisClient.sRem(`code:${roomId}`, coderKey);
            socket.leave(`code:${roomId}`);
        });

        socket.on('joinCode', async (roomId) => {
            await socket.join(`code:${roomId}`);
            await redisClient.sAdd(`code:${roomId}`, coderKey);

            console.log('[JOINED CODE ROOM]', {
                username: user.user_name,
                roomId,
                socketId,
            });

            // get the coders in the room
            const members = await redisClient.sMembers(`code:${roomId}`);
            const coders = members.map((m) => JSON.parse(m));

            socket.emit('userJoinedCode', { user, coders }); // Send to joining user
            socket
                .to(`code:${roomId}`)
                .emit('userJoinedCode', { user, coders }); // Send to others
        });

        // disconnection
        socket.on('disconnect', async () => {
            console.log('[USER DISCONNECTED]', {
                username: user.user_name,
                socketId,
            });

            // mark user offline
            await Promise.all([
                redisClient.del(userId),
                onlineUserObject.markUserOffline(userId),
            ]);
            console.log('[MARKED OFFLINE]', { username: user.user_name });

            // Notify others in rooms about us being offline in both chats and code rooms
            const rooms = [...socket.rooms];

            rooms.forEach(async (room) => {
                if (room.startsWith('code:')) {
                    socket.to(room).emit('userLeftCode', user);
                    await redisClient.sRem(room, coderKey);
                } else {
                    socket.to(room).emit('userStatusChange', {
                        userId,
                        targetUser: user,
                        isOnline: false,
                    });
                }
            });
        });

        // # ======================= now start other async logic ========================

        // mark user online
        await Promise.all([
            redisClient.setEx(userId, 3600, socketId), // 1hr exp
            onlineUserObject.markUserOnline(userId, socketId),
        ]);
        console.log('[MARKED ONLINE]', { username: user.user_name });

        // notify my chats
        const chats = await chatObject.getMyChats(userId);

        chats.forEach(async ({ chat_id }) => {
            await socket.join(chat_id);
            socket.to(chat_id).emit('userStatusChange', {
                userId,
                targetUser: user,
                isOnline: true,
            });
            console.log('[JOINED CHAT]', {
                username: user.user_name,
                chatId: chat_id,
            });
        });
    } catch (err) {
        console.error('Error in socket:', err.message);
        socket.disconnect();
    }
});

export { io, redisClient, http };
