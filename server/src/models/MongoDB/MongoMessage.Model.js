import { Imessages } from '../../interfaces/message.Interface.js';
import { Message, Chats } from '../../schemas/MongoDB/index.js';

//Message , sender id , reciever id, message id, message
//Chats, participants array, messages array
export class MongoMessages extends Imessages {
    async sendMessage(messageId, senderId, recieverId, message) {
        const result = await Message.create({
            message_id: messageId,
            sender_id: senderId,
            reciever_id: recieverId,
            message,
        });
        return result.toObject();
    }

    async getMessages(senderId, recieverId){
        const result = await Chats.find({
            users: {
                $all : [senderId, recieverId]
            }
        }).populate('messages').lean();

        return result.messages;
    }
}
