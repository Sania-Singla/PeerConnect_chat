// import { app } from './app.js';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: [
//             'http://localhost:5173',
//             'http://localhost:5174',
//             'http://localhost:3000',
//             'https://peerconnect-wwfk.onrender.com',
//         ],
//     },
// });

// const onlineUsersMapping = new Map(); // Using a Map for efficency // {userId: socketId}

// function getSocketIdByUserId(userId) {
//     return onlineUsersMapping.get(userId) || null;
// }

// io.on('connection', (socket) => {
//     console.log('a user connected', socket.id);

//     const userId = socket.handshake.query.userId;

//     if (!userId) {
//         return socket.disconnect(true);
//     }

//     onlineUsersMapping.set(userId, socket.id);

//     console.log('socket mapping set', onlineUsersMapping);

//     socket.on('sendOnlineChats', (chats) => {
//         console.log('sending online chats...');
//         const onlineChatIds = chats
//             .filter((chat) => onlineUsersMapping.has(chat.user_id))
//             .map((chat) => chat.chat_id);

//         console.log('online chats', onlineChatIds);
//         socket.to(socket.id).emit('onlineChats', onlineChatIds);
//     });

//     socket.on('disconnect', () => {
//         console.log('a user disconnected', socket.id);

//         onlineUsersMapping.delete(userId);
//         console.log('socket mapping updated', onlineUsersMapping);
//         socket.on('sendOnlineChats', (chats) => {
//             const onlineChatIds = chats
//                 .filter((chat) => onlineUsersMapping.has(chat.user_id))
//                 .map((chat) => chat.chat_id);

//             console.log('online chats', onlineChatIds);
//             socket.to(socket.id).emit('onlineChats', onlineChatIds);
//         });
//     });
// });

// export { io, httpServer, getSocketIdByUserId };
