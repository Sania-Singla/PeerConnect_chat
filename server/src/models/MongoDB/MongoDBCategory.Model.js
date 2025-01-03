import { NOT_FOUND } from '../../constants/errorCodes.js';
import { Icategories } from '../../interfaces/category.Interface.js';
import { Category } from '../../schemas/MongoDB/index.js';

export class MongoDBcategories extends Icategories {
    async getCategories() {
        try {
            return await Category.find();
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            return await Category.findOne({
                category_id: categoryId,
            });
        } catch (err) {
            throw err;
        }
    }

    async createCategory(categoryId, categoryName) {
        try {
            return await Category.create({
                category_id: categoryId,
                category_name: categoryName,
            });
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(categoryId) {
        try {
            return await Category.findOneAndDelete({
                category_id: categoryId,
            });
        } catch (err) {
            throw err;
        }
    }

    async editCategory(categoryId, categoryName) {
        try {
            return await Category.findOneAndUpdate(
                { category_id: categoryId },
                { $set: { category_name: categoryName } },
                { new: true }
            );
        } catch (err) {
            throw err;
        }
    }
}
