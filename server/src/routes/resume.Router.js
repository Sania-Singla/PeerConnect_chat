import express from 'express';
import {
    getResume,
    createResume,
    getResumes,
    saveSection,
    deleteResume,
    updateTheme,
} from '../controllers/resume.Controller.js';
import { verifyJwt } from '../middlewares/auth.Middleware.js';
export const resumeRouter = express.Router();

resumeRouter.use(verifyJwt);

resumeRouter.route('/new').post(createResume);

resumeRouter
    .route('/:resumeId')
    .get(getResume)
    .patch(updateTheme)
    .post(saveSection)
    .delete(deleteResume);

resumeRouter.route('/').get(getResumes);
