import { v4 as uuid } from 'uuid';
import { Category } from '../schemas/index.js';

export async function seedDatabase() {
    try {
        // Clear existing collections
        await Category.deleteMany({});
        console.log('Existing collections cleared.');

        // Seed categories
        await Category.insertMany([
            { category_id: uuid(), category_name: 'Art' },
            { category_id: uuid(), category_name: 'Science' },
            { category_id: uuid(), category_name: 'Technology' },
            { category_id: uuid(), category_name: 'Health' },
            { category_id: uuid(), category_name: 'Sports' },
            { category_id: uuid(), category_name: 'FinTech' },
            { category_id: uuid(), category_name: 'EdTech' },
        ]);

        console.log('Database seeding completed.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding the database:', err);
        process.exit(1);
    }
}
