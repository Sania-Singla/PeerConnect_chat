import express from 'express';
import {
    getResume,
    createResume,
    getResumes,
    saveSection,
    deleteResume,
} from '../controllers/resume.Controller.js';
export const resumeRouter = express.Router();

resumeRouter.route('/new').post(createResume);

resumeRouter
    .route('/:resumeId')
    .get(getResume)
    .post(saveSection)
    .delete(deleteResume);

resumeRouter.route('/').get(getResumes);
