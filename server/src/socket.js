import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectRedis } from './db/connectRedis.js';

import { chatObject } from './controllers/chat/chat.Controller.js';
import { onlineUserObject } from './controllers/chat/onlineUser.Controller.js';

const redisClient = await connectRedis();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'https://peerconnect-wwfk.onrender.com',
        ],
    },
});

async function getSocketIdByUserId(userId) {
    let socketId = await redisClient.get(userId);
    if (!socketId) {
        const user = await onlineUserObject.getOnlineUser(userId);
        if (user) {
            socketId = user.socket_id;
            await redisClient.set(userId, socketId); // set it in redis again
        }
    }
    return socketId;
}

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.log('No userId provided. Disconnecting...');
        return socket.disconnect(true);
    }

    // add user to Redis and mark online in MongoDB
    try {
        await redisClient.set(userId, socket.id);
        await onlineUserObject.markUserOnline(userId, socket.id);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        return console.error('Error marking user as online:', err);
    }

    // Send online chats to the user
    try {
        const chats = await chatObject.getChats(userId);

        const onlineChatIds = [];

        for (const chat of chats) {
            const participantSocketId = await getSocketIdByUserId(chat.user_id);

            if (participantSocketId) {
                onlineChatIds.push(chat.chat_id);
            }
        }

        socket.emit('onlineChats', { onlineChatIds, allChats: chats });
    } catch (err) {
        return console.error('Error fetching online participants:', err);
    }

    // Notify chats when the user goes online
    socket.on('notify', async (chats) => {
        for (const chat of chats) {
            const participantSocketId = await getSocketIdByUserId(chat.user_id);

            if (participantSocketId) {
                io.to(participantSocketId).emit('chatStatusChange', {
                    chatId: chat.chat_id,
                    isOnline: true,
                });
            }
        }
    });

    // disconnection
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        // Remove the user from redis and make offline in db
        try {
            await redisClient.del(userId);
            await onlineUserObject.markUserOffline(userId);
            console.log(`User ${userId} marked as offline`);
        } catch (err) {
            console.error('Error marking user offline:', err);
        }

        // Notify chats that the user is offline
        const chats = await chatObject.getChats(userId);

        for (const chat of chats) {
            const participantSocketId = await getSocketIdByUserId(chat.user_id);

            if (participantSocketId) {
                io.to(participantSocketId).emit('chatStatusChange', {
                    chatId: chat.chat_id,
                    isOnline: false,
                });
            }
        }
    });
});

export { io, httpServer, getSocketIdByUserId };
