import express from 'express';
import { getFeedback } from '../controllers/interview.Controller.js';
export const interviewRouter = express.Router();

interviewRouter.route('/feedback').post(getFeedback);
