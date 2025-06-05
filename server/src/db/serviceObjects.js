import {
    UserModel,
    PostModel,
    FollowerModel,
    LikeModel,
    CommentModel,
    ChatModel,
    MessageModel,
    OnlineUserModel,
    RequestModel,
    ResumeModel,
} from '../models/index.js';

const serviceMap = {
    MongoDB: {
        User: UserModel,
        Post: PostModel,
        Follower: FollowerModel,
        Like: LikeModel,
        Comment: CommentModel,
        Chat: ChatModel,
        Message: MessageModel,
        OnlineUser: OnlineUserModel,
        Request: RequestModel,
        Resume: ResumeModel,
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
