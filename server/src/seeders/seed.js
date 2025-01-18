import { v4 as uuid } from 'uuid';
import { User, Chat, Message } from '../schemas/MongoDB/index.js';
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
            lastMessage: {
                message: 'Welcome to Group Chat ${i + 1}',
                time: new Date(),
            },
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

const chatIds = [
    'fba8fcb9-5365-4b3f-b18d-a20b3c7568e0',
    '683ff346-308d-49cd-9774-0d00e06d8bb0',
];

const userIds = [
    'eafb8c41-91bd-464f-ad68-51a3212fdc9c',
    '8cc150e4-e57e-4434-a674-a2b243feb6d2',
    '34587c03-a7c4-4a51-9365-9bc2968eaa95',
];

export async function seedMessages() {
    try {
        Message.deleteMany({}); // Generate dummy messages

        const messages = [];
        for (let i = 0; i < 20; i++) {
            const randomChatId =
                chatIds[Math.floor(Math.random() * chatIds.length)];
            const randomSenderId =
                userIds[Math.floor(Math.random() * userIds.length)];

            // Generate random attachments
            const attachments = [];
            const attachmentCount = Math.floor(Math.random() * 3); // 0 to 2 attachments
            for (let j = 0; j < attachmentCount; j++) {
                attachments.push(
                    `https://dummyimage.com/600x400/000/fff&text=Attachment+${i + 1}-${j + 1}`
                );
            }

            messages.push({
                message_id: uuid(),
                chat_id: randomChatId,
                sender_id: randomSenderId,
                text: `Sample message text #${i + 1}`,
                attachments,
                message_createdAt: new Date(),
                message_updatedAt: new Date(),
            });
        }

        // Insert dummy messages into the database
        await Message.insertMany(messages);

        console.log('Dummy messages seeded successfully');
        process.exit(0); // Exit the process successfully
    } catch (err) {
        console.error('Error seeding messages:', err);
        process.exit(1); // Exit the process with an error
    }
}
