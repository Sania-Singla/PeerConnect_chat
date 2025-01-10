import {
    MongoUsers,
    MongoPosts,
    MongoLikes,
    MongoFollowers,
    MongoComments,
    MongoCategories,
    MongoChats,
    MongoMessages,
    MongoGroupChats,
    MongoOnlineUsers,
} from '../models/MongoDB/index.js';

export default function getServiceObject(serviceType) {
    try {
        switch (process.env.DATABASE_TYPE) {
            case 'MongoDB': {
                switch (serviceType) {
                    case 'users':
                        return new MongoUsers();
                    case 'posts':
                        return new MongoPosts();
                    case 'likes':
                        return new MongoLikes();
                    case 'comments':
                        return new MongoComments();
                    case 'followers':
                        return new MongoFollowers();
                    case 'categories':
                        return new MongoCategories();
                    case 'chats':
                        return new MongoChats();
                    case 'messages':
                        return new MongoMessages();
                    case 'groupChats':
                        return new MongoGroupChats();
                    case 'onlineUsers':
                        return new MongoOnlineUsers();
                    default: {
                        throw new Error('Unsupported service type');
                    }
                }
            }
            default: {
                throw new Error('Unsupported DB Type');
            }
        }
    } catch (err) {
        return console.log({
            message: 'something went wrong while generating service object',
            error: err.message,
        });
    }
}
