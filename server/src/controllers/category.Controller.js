import { OK, BAD_REQUEST, SERVER_ERROR } from '../constants/errorCodes.js';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import getServiceObject from '../db/serviceObjects.js';

export const categoryObject = getServiceObject('categories');

const getCategories = async (req, res) => {
    try {
        const categories = await categoryObject.getCategories();
        if (categories.length) {
            return res.status(OK).json(categories);
        } else {
            return res.status(OK).json({ message: 'no categories found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the categories',
            error: err.message,
        });
    }
};

const addCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const categoryId = uuid();

        if (!categoryName) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        const category = await categoryObject.addCategory(
            categoryId,
            categoryName
        );
        return res.status(OK).json(category);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while adding new category',
            error: err.message,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId || !validator.isUUID(categoryId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid categoryId',
            });
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return res
                .status(NOT_FOUND)
                .json({ message: 'category not found' });
        }

        const result = await categoryObject.deleteCategory(categoryId);
        return res.status(OK).json(result);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the category',
            error: err.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const { categoryId } = req.params;

        if (!categoryName) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }
        if (!categoryId || !validator.isUUID(categoryId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid categoryId',
            });
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return res
                .status(NOT_FOUND)
                .json({ message: 'category not found' });
        }

        const updatedCategory = await categoryObject.editCategory(
            categoryId,
            categoryName
        );
        return res.status(OK).json(updatedCategory);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating the category',
            error: err.message,
        });
    }
};

export { getCategories, addCategory, deleteCategory, updateCategory };
