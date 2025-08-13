import cookieParser from 'cookie-parser';
import { app } from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { connectRedis } from './config/redis.config.js';
import { chatObject } from './controllers/chat.Controller.js';
import { onlineUserObject } from './controllers/onlineUser.Controller.js';
import { CORS_OPTIONS } from './constants/index.js';
import { socketAuthenticator } from './middlewares/index.js';

const redisClient = await connectRedis();
const http = createServer(app);
const io = new Server(http, { cors: CORS_OPTIONS });

// middleware for extracting user from socket
io.use((socket, next) => {
    const req = socket.request;
    const res = {};

    cookieParser()(req, res, async (err) => {
        await socketAuthenticator(req, err, socket, next);
    });
});

io.on('connection', async (socket) => {
    try {
        const user = socket.user;
        const userId = user?.user_id;
        const socketId = socket.id;

        console.log('[CONNECTED]', { username: user.user_name, socketId });

        // # ======================= register events first ========================

        socket.on('typing', (chatId) => {
            socket.to(`chat:${chatId}`).emit('typing', {
                chatId,
                targetUser: user,
            });
        });

        socket.on('stoppedTyping', (chatId) => {
            socket.to(`chat:${chatId}`).emit('stoppedTyping', {
                chatId,
                targetUser: user,
            });
        });

        // Editor events
        socket.on('codeChange', async ({ roomId, code }) => {
            socket.to(`code:${roomId}`).emit('codeChange', { code });

            await redisClient.setEx(
                `script:${roomId}`,
                86400, // 1 day
                JSON.stringify(code || '')
            );
        });

        socket.on('cursorChange', ({ roomId, cursor }) => {
            socket.to(`code:${roomId}`).emit('cursorChange', {
                cursor,
                userId,
                name: user.user_fullName,
            });
        });

        socket.on('leaveCode', async (roomId) => {
            socket.to(`code:${roomId}`).emit('userLeftCode', user);
            await redisClient.sRem(`code:${roomId}`, JSON.stringify(user));
            await socket.leave(`code:${roomId}`);
        });

        socket.on('joinCode', async (roomId) => {
            await Promise.all([
                socket.join(`code:${roomId}`),
                redisClient.sAdd(`code:${roomId}`, JSON.stringify(user)),
            ]);

            let [members, code] = await Promise.all([
                redisClient.sMembers(`code:${roomId}`),
                redisClient.get(`script:${roomId}`),
            ]);

            if (!code) {
                await redisClient.setEx(`script:${roomId}`, 86400, '');
                code = '';
            } else {
                code = JSON.parse(code);
            }
            const coders = members.map((m) => JSON.parse(m));

            // Emit to current user only
            socket.emit('syncCode', { code, coders });

            // Emit to others in the room
            socket.to(`code:${roomId}`).emit('userJoinedCode', user);
        });

        // disconnection
        socket.on('disconnect', async () => {
            console.log('[DISCONNECTED]', {
                username: user.user_name,
                socketId,
            });

            await Promise.all([
                redisClient.del(userId),
                onlineUserObject.markUserOffline(userId),
            ]);

            console.log('[OFFLINE]', { username: user.user_name });

            const [chats, rooms] = await Promise.all([
                chatObject.getMyChats(userId),
                redisClient.keys('code:*'),
            ]);

            await Promise.all([
                ...chats.map(async ({ chat_id }) => {
                    socket.to(`chat:${chat_id}`).emit('userStatusChange', {
                        userId,
                        targetUser: user,
                        isOnline: false,
                    });
                }),
                ...rooms.map(async (room) => {
                    socket.to(room).emit('userLeftCode', user);
                    await redisClient.sRem(room, JSON.stringify(user));
                }),
            ]);
        });

        // # ======================= now start other async logic ========================

        await Promise.all([
            redisClient.setEx(userId, 3600, socketId),
            onlineUserObject.markUserOnline(userId, socketId),
        ]);
        console.log('[ONLINE]', { username: user.user_name });

        const chats = await chatObject.getMyChats(userId);

        for (const { chat_id } of chats) {
            await socket.join(`chat:${chat_id}`);
            socket.to(`chat:${chat_id}`).emit('userStatusChange', {
                userId,
                targetUser: user,
                isOnline: true,
            });
        }
    } catch (err) {
        console.error('Error in socket:', err);
        process.exit(1);
    }
});

export { io, redisClient, http };
