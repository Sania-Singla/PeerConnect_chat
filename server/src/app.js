import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { CORS_OPTIONS } from './constants/options.js';
export const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

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
    editorRouter,
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
app.use('/api/codes', editorRouter);

app.use(errorMiddleware);
