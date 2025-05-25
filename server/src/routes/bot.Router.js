import express from 'express';
import { quickBot } from '../controllers/bot.controller.js';
export const botRouter = express.Router();

botRouter.route('/quick-bot').post(quickBot);
