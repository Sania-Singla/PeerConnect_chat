import express from 'express';
export const categoryRouter = express.Router();
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';

import {
    addCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../controllers/category.Controller.js';

const doesCategoryExist = doesResourceExist(
    'category',
    'categoryId',
    'category'
);

categoryRouter
    .route('/category/:categoryId')
    .delete(verifyJwt, doesCategoryExist, deleteCategory)
    .patch(verifyJwt, doesCategoryExist, updateCategory);

categoryRouter.route('/').get(getCategories).post(verifyJwt, addCategory);
