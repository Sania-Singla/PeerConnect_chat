import {
    SQLusers,
    SQLposts,
    SQLlikes,
    SQLfollowers,
    SQLcomments,
    SQLcategories,
} from '../models/SQL/index.js';

import {
    MongoUsers,
    MongoPosts,
    MongoLikes,
    MongoFollowers,
    MongoComments,
    MongoCategories,
    MongoIndividualChats,
    MongoGroupChats,
} from '../models/MongoDB/index.js';

export default function getServiceObject(serviceType) {
    try {
        switch (process.env.DATABASE_TYPE) {
            case 'MySQL': {
                switch (serviceType) {
                    case 'users':
                        return new SQLusers();
                    case 'posts':
                        return new SQLposts();
                    case 'likes':
                        return new SQLlikes();
                    case 'comments':
                        return new SQLcomments();
                    case 'followers':
                        return new SQLfollowers();
                    case 'categories':
                        return new SQLcategories();
                    default: {
                        throw new Error('Unsupported service type');
                    }
                }
            }
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
                    case 'individualChats':
                        return new MongoIndividualChats();
                    case 'groupChats':
                        return new MongoGroupChats();
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
