export class Icategories {
    async getCategories() {
        throw new Error('Method getCategories is not overwritten');
    }

    async getCategory(categoryId) {
        throw new Error('Method getCategory is not overwritten');
    }

    async createCategory(categoryId, categoryName) {
        throw new Error('Method createCategory is not overwritten');
    }

    async deleteCategory(categoryId) {
        throw new Error('Method deleteCategory is not overwritten');
    }

    async editCategory(categoryId, categoryName) {
        throw new Error('Method editCategory is not overwritten');
    }
}
