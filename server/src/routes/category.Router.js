import express from 'express';
export const categoryRouter = express.Router();
import { verifyJwt } from '../middlewares/index.js';

import {
    addCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../controllers/category.Controller.js';

categoryRouter
    .route('/category/:categoryId')
    .all(verifyJwt)
    .delete(deleteCategory)
    .patch(updateCategory);

categoryRouter.route('/').get(getCategories).post(verifyJwt, addCategory);
