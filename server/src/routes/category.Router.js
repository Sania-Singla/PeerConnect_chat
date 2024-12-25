import express from 'express';
export const categoryRouter = express.Router();
import { verifyJwt } from '../middlewares/auth.Middleware.js';

import {
    addCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../controllers/category.Controller.js';

categoryRouter.route('/').get(getCategories).post(verifyJwt, addCategory);

categoryRouter
    .route('/categoryId')
    .delete(verifyJwt, deleteCategory)
    .patch(verifyJwt, updateCategory);
