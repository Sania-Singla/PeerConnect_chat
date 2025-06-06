import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { CORS_OPTIONS } from './constants/options.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

import {
    userRouter,
    postRouter,
    followerRouter,
    commentRouter,
    likeRouter,
    chatRouter,
    messageRouter,
    requestRouter,
    editorRouter,
    resumeRouter,
    interviewRouter,
} from './routes/index.js';
import { errorMiddleware } from './middlewares/index.js';

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/followers', followerRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use('/api/requests', requestRouter);
app.use('/api/editors', editorRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/interviews', interviewRouter);

app.get('/', (req, res) => res.send('Welcome to PeerConnect Server'));

app.use(errorMiddleware);
