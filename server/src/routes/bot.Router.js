import express from 'express';
import { quickBot, feedback } from '../controllers/bot.Controller.js';
export const botRouter = express.Router();

botRouter.route('/').post(quickBot);

botRouter.route('/feedback').post(feedback);
