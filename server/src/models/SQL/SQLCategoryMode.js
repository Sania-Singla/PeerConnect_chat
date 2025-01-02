import { Icategories } from '../../interfaces/category.Interface.js';
import { connection } from '../../server.js';

export class SQLcategories extends Icategories {
    async getCategories() {
        try {
            const q = `SELECT * FROM categories`;
            const [categories] = await connection.query(q);
            return categories;
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            const q = `SELECT * FROM categories WHERE category_id = ?`;
            const [[category]] = await connection.query(q, [categoryId]);
            return category;
        } catch (err) {
            throw err;
        }
    }

    async createCategory(categoryId, categoryName) {
        try {
            const q =
                'INSERT INTO categories(category_id, category_name) VALUES (?, ?)';
            await connection.query(q, [categoryId, categoryName]);
            return await this.getCategory(categoryId);
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(categoryId) {
        try {
            const q = 'DELETE FROM categories WHERE category_id = ?';
            const [response] = await connection.query(q, [categoryId]);
            return { message: 'category deleted' };
        } catch (err) {
            throw err;
        }
    }

    async editCategory(categoryId, categoryName) {
        try {
            const q =
                'UPDATE categories SET category_name = ? WHERE category_id = ?';
            await connection.query(q, [categoryName, categoryId]);
            return await this.getCategory(categoryId);
        } catch (err) {
            throw err;
        }
    }
}
