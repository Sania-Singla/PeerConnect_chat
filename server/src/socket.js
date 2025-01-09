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
            await redisClient.setEx(userId, 86400, socketId); // 24hr exp // set it in redis again
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
        await redisClient.setEx(userId, 86400, socket.id); // 24hr exp
        await onlineUserObject.markUserOnline(userId, socket.id);
        console.log(`User ${userId} marked as online.`);
    } catch (err) {
        return console.error('Error marking user as online:', err);
    }

    try {
        // get the chats of the connectec user
        const chats = await chatObject.getChats(userId);
        const onlineChatIds = [];

        // Notify chats when the user goes online
        for (const chat of chats) {
            const participantSocketId = await getSocketIdByUserId(chat.user_id);

            if (participantSocketId) {
                onlineChatIds.push(chat.chat_id);

                io.to(participantSocketId).emit('chatStatusChange', {
                    chatId: chat.chat_id,
                    isOnline: true,
                });
            }
        }

        socket.emit('chats', { onlineChatIds, allChats: chats });
    } catch (err) {
        return console.error(
            'Error notifying other participants of connection:',
            err
        );
    }

    socket.on('typing', async ({ chatId, participantId }) => {
        const participantSocketId = await getSocketIdByUserId(participantId);
        io.to(participantSocketId).emit('typing', chatId);
    });

    socket.on('stoppedTyping', async ({ chatId, participantId }) => {
        const participantSocketId = await getSocketIdByUserId(participantId);
        io.to(participantSocketId).emit('stoppedTyping', chatId);
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

        try {
            // Notify chats that the user is offline
            const chats = await chatObject.getChats(userId);

            for (const chat of chats) {
                const participantSocketId = await getSocketIdByUserId(
                    chat.user_id
                );

                if (participantSocketId) {
                    io.to(participantSocketId).emit('chatStatusChange', {
                        chatId: chat.chat_id,
                        isOnline: false,
                    });
                }
            }
        } catch (err) {
            return console.error(
                'Error notifying other participants of disconnection:',
                err
            );
        }
    });
});

export { io, httpServer, getSocketIdByUserId };
