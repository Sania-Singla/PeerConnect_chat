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

// Routing

import {
    userRouter,
    postRouter,
    followerRouter,
    commentRouter,
    likeRouter,
    categoryRouter,
} from './routes/index.js';

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/followers', followerRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/categories', categoryRouter);

// production mode
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '..', 'client', 'dist', 'index.html')
        );
    });
}
