import { Icategories } from '../../interfaces/category.Interface.js';
import { connection } from '../../server.js';

export class SQLcategories extends Icategories {
    async getCategories() {
        try {
            const q = `SELECT * FROM categories`;

            const [categories] = await connection.query(q);
            if (!categories?.length) {
                return { message: 'no categories found' };
            }

            return categories;
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            const q = `SELECT * FROM categories WHERE category_id = ?`;
            const [[category]] = await connection.query(q, [categoryId]);
            if (!category) {
                return { message: 'category not found' };
            }

            return category;
        } catch (err) {
            throw err;
        }
    }

    async createCategory(categoryId, categoryName) {
        try {
            const q =
                'INSERT INTO categories(category_id,category_name) VALUES (?, ?)';
            await connection.query(q, [categoryId, categoryName]);

            const category = await this.getCategory(categoryId);
            if (category?.message) {
                throw new Error('category creation db issue');
            }
            return category;
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(categoryId) {
        try {
            const q = 'DELETE FROM categories WHERE category_id = ?';
            const [response] = await connection.query(q, [categoryId]);
            if (response.affectedRows === 0) {
                throw new Error('category deletion db issue');
            }
            return { message: 'category deleted' };
        } catch (err) {
            throw err;
        }
    }

    async editCategory(categoryId, categoryName) {
        try {
            const q =
                'UPDATE comments SET category_name = ? WHERE category_id = ?';
            await connection.query(q, [categoryName, categoryId]);
            const category = await this.getComment(categoryId);
            if (category?.message) {
                throw new Error('category updation db issue');
            }
            return category;
        } catch (err) {
            throw err;
        }
    }
}
