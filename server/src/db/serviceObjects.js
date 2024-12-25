import {
    SQLusers,
    SQLposts,
    SQLlikes,
    SQLfollowers,
    SQLcomments,
    SQLcategories,
} from '../models/SQL/index.js';

import {
    MongoDBusers,
    MongoDBposts,
    MongoDBlikes,
    MongoDBfollowers,
    MongoDBcomments,
    MongoDBcategories,
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
                        return new MongoDBusers();
                    case 'posts':
                        return new MongoDBposts();
                    case 'likes':
                        return new MongoDBlikes();
                    case 'comments':
                        return new MongoDBcomments();
                    case 'followers':
                        return new MongoDBfollowers();
                    case 'categories':
                        return new MongoDBcategories();
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
