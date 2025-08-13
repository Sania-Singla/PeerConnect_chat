import * as mongoModels from '../models/mongo/index.js';

const serviceMap = {
    MongoDB: {
        User: mongoModels.UserModel,
        Post: mongoModels.PostModel,
        Follower: mongoModels.FollowerModel,
        Like: mongoModels.LikeModel,
        Comment: mongoModels.CommentModel,
        Chat: mongoModels.ChatModel,
        Message: mongoModels.MessageModel,
        OnlineUser: mongoModels.OnlineUserModel,
        Request: mongoModels.RequestModel,
        Resume: mongoModels.ResumeModel,
    },
};

export function getServiceObject(serviceType) {
    try {
        const dbType = process.env.DATABASE_TYPE;
        if (!serviceMap[dbType]) {
            throw new Error('Unsupported DB Type');
        }

        const ServiceClass = serviceMap[dbType][serviceType];
        if (!ServiceClass) {
            throw new Error('Unsupported service type');
        }

        return new ServiceClass();
    } catch (err) {
        console.log({
            message: 'Something went wrong while generating service object',
            error: err,
        });
        process.exit(1);
    }
}
