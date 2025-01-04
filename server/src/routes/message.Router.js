import express from 'express';
import { verifyJwt } from '../middlewares/index.js';

export const messageRouter = express.Router();

messageRouter.use(verifyJwt);
