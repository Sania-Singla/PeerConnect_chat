import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // todo: update online users ****** for the current user ******

    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
        // todo: update online users ****** for the current user ******
    });
});

export { io, httpServer };
