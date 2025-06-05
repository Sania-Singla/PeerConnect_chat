import express from 'express';
import {
    getFeedback,
    getResume,
    getResumes,
    saveSection,
} from '../controllers/resume.Controller.js';
export const resumeRouter = express.Router();

resumeRouter.route('/save/:resumeId').post(saveSection);

resumeRouter.route('/feedback').post(getFeedback);

resumeRouter.route('/:resumeId').get(getResume);

resumeRouter.route('/').get(getResumes);
