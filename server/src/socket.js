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
// ! commented for editor demonstration
// io.use((socket, next) => {
//     const req = socket.request;
//     const res = {};

//     cookieParser()(
//         req,
//         res,
//         async (err) => await socketAuthenticator(req, err, socket, next)
//     );
// });

// ! for editor ********************
const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
};
// ! ******************************

io.on('connection', async (socket) => {
    const user = socket.user;
    const userId = user?.user_id;

    console.log('User connected:', socket.id);

    if (user) {
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
            socket
                .to(`chat:${chatId}`)
                .emit('typing', { chatId, targetUser: user })
        );

        socket.on('stoppedTyping', (chatId) =>
            socket
                .to(`chat:${chatId}`)
                .emit('stoppedTyping', { chatId, targetUser: user })
        );
    }

    // ! editor **************************
    socket.on('join', ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // notify that new user join
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // sync the code
    socket.on('codeChange', ({ roomId, code }) => {
        socket.in(roomId).emit('codeChange', { code });
    });
    // when new user join the room all the code which are there are also shows on that persons editor
    socket.on('syncCode', ({ socketId, code }) => {
        io.to(socketId).emit('codeChange', { code });
    });

    socket.on('disconnected', ({ socketId, username }) => {
        console.log('User disconnected:', socketId);
        const rooms = [...socket.rooms];
        // leave all the room
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username,
            });
        });

        delete userSocketMap[socket.id];
    });
    // ! **************************

    // disconnection
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        if (user) {
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
        }
    });
});

export { io, redisClient, http };
