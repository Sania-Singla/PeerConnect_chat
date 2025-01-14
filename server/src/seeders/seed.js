import { v4 as uuid } from 'uuid';
import { User, Chat } from '../schemas/MongoDB/index.js';
import { hashSync } from 'bcrypt';

export const seedDatabase = async () => {
    try {
        // Clear existing collections
        await User.deleteMany({});
        await Chat.deleteMany({});
        console.log('Existing collections cleared.');

        // Seed users
        const users = await Promise.all(
            Array.from({ length: 10 }).map(async (_, i) => ({
                user_id: uuid(),
                user_name: `user${i + 1}`,
                user_firstName: `FirstName${i + 1}`,
                user_lastName: `LastName${i + 1}`,
                user_bio: `This is the bio of user${i + 1}.`,
                user_avatar: `https://randomuser.me/api/portraits/lego/${i + 1}.jpg`,
                user_coverImage: `https://via.placeholder.com/800x200.png?text=Cover+Image+User${i + 1}`,
                user_email: `user${i + 1}@example.com`,
                user_password: await hashSync(`password`, 10),
            }))
        );

        const createdUsers = await User.insertMany(users);
        console.log('Users seeded successfully.');

        // Create chats
        const groupChats = Array.from({ length: 3 }).map((_, i) => ({
            chat_id: uuid(),
            isGroupChat: true,
            chat_name: `Group Chat ${i + 1}`,
            creator: createdUsers[i].user_id,
            members: [
                { user_id: createdUsers[i].user_id, role: 'admin' },
                {
                    user_id:
                        createdUsers[i + 1]?.user_id || createdUsers[0].user_id,
                    role: 'member',
                },
                {
                    user_id:
                        createdUsers[i + 2]?.user_id || createdUsers[1].user_id,
                    role: 'member',
                },
            ],
            lastMessage: `Welcome to Group Chat ${i + 1}`,
        }));

        const directChats = Array.from({ length: 5 }).map((_, i) => ({
            chat_id: uuid(),
            isGroupChat: false,
            members: [
                { user_id: createdUsers[i].user_id, role: 'member' },
                {
                    user_id:
                        createdUsers[i + 1]?.user_id || createdUsers[0].user_id,
                    role: 'member',
                },
            ],
            lastMessage: `This is a direct message between User${i + 1} and User${i + 2}.`,
        }));

        const chats = [...groupChats, ...directChats];
        await Chat.insertMany(chats);
        console.log('Chats seeded successfully.');

        console.log('Database seeding completed.');
        process.exit(0); // Exit the process after seeding
    } catch (err) {
        console.error('Error seeding the database:', err);
        process.exit(1);
    }
};
