import express from 'express';
import { compileGeneralCode } from '../controllers/editorController.js';
export const editorRouter = express.Router();

editorRouter.route('/compile').post(compileGeneralCode);
