import express from 'express';
import { getFeedback } from '../controllers/resume.Controller.js';
export const resumeRouter = express.Router();

resumeRouter.route('/feedback').post(getFeedback);
