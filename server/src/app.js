import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
export const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));
app.use(cookieParser());
const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

// Deployment
const dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(dirname, '..', 'client', 'dist', 'index.html')
        );
    });
}

// Routes
import {
    userRouter,
    postRouter,
    followerRouter,
    commentRouter,
    likeRouter,
    categoryRouter,
    chatRouter,
    messageRouter,
    requestRouter,
} from './routes/index.js';
import { errorMiddleware } from './middlewares/index.js';

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/followers', followerRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use('/api/requests', requestRouter);
app.use(errorMiddleware);
