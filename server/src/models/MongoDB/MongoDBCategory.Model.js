import { NOT_FOUND } from '../../constants/errorCodes.js';
import { Icategories } from '../../interfaces/category.Interface.js';
import { Category } from '../../schemas/MongoDB/index.js';

export class MongoDBcategories extends Icategories {
    async getCategories() {
        try {
            const categories = await Category.find();

            if (!categories.length) {
                return { message: 'CATEGORIES_NOT_FOUND' };
            }

            return categories;
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            const category = await Category.findOne({
                category_id: categoryId,
            });

            return category;
        } catch (err) {
            throw err;
        }
    }

    async createCategory(categoryId, categoryName) {
        try {
            const category = await Category.create({
                category_id: categoryId,
                category_name: categoryName,
            });

            return category;
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(categoryId) {
        try {
            const category = await Category.findOneAndDelete({
                category_id: categoryId,
            });

            return { message: 'CATEGORY_DELETED_SUCCESSFULLY' };
        } catch (err) {
            throw err;
        }
    }

    async editCategory(categoryId, categoryName) {
        try {
            const category = await Category.updateOne(
                { category_id: categoryId },
                { $set: { category_name: categoryName } },
                { new: true }
            );
            return category;
        } catch (err) {
            throw err;
        }
    }
}
