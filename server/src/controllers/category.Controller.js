import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { tryCatch, ErrorHandler } from '../utils/index.js';

export const categoryObject = getServiceObject('categories');

const getCategories = tryCatch('get categories', async (req, res) => {
    const categories = await categoryObject.getCategories();
    if (categories.length) {
        return res.status(OK).json(categories);
    } else {
        return res.status(OK).json({ message: 'no categories found' });
    }
});

const addCategory = tryCatch('add category', async (req, res, next) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const category = await categoryObject.addCategory(categoryName);
    return res.status(OK).json(category);
});

const deleteCategory = tryCatch('delete category', async (req, res, next) => {
    const category = await categoryObject.deleteCategory(
        req.category?.category_id
    );
    if (!category) {
        return next(new ErrorHandler('category not found', BAD_REQUEST));
    }
    return res.status(OK).json({ message: 'category deleted successfully' });
});

const updateCategory = tryCatch('update category', async (req, res, next) => {
    const { categoryName } = req.body;
    const { categoryId } = req.params;

    if (!categoryName) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const updatedCategory = await categoryObject.editCategory(
        categoryId,
        categoryName
    );
    if (!updatedCategory) {
        return next(new ErrorHandler('category not found', BAD_REQUEST));
    }
    return res.status(OK).json(updatedCategory);
});

export { getCategories, addCategory, deleteCategory, updateCategory };
