import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';
import { getOtherMembers } from '../helpers/index.js';

export const chatObject = getServiceObject('chats');

// all chats
const getMyChats = tryCatch('get my chats', async (req, res) => {
    const myId = req.user.user_id;

    const chats = await chatObject.getMyChats(myId);

    const transformedChats = chats.map((chat) => {
        const otherMembers = getOtherMembers(chat.members, myId);

        return {
            ...chat,
            chat_name: isGroupChat
                ? chat_name
                : `${otherMembers[0].user_firstName} ${otherMembers[0].user_lastName}`,
            avatar: isGroupChat
                ? otherMembers.slice(0, 3).map(({ user_avatar }) => user_avatar)
                : otherMembers[0].user_avatar,
        };
    });

    return res.status(OK).json(transformedChats);
});

// only group chats
const getMyGroups = tryCatch('get my groups', async (req, res, next) => {
    const myId = req.user.user_id;

    const chats = await chatObject.getMyChats(myId);

    const transformedChats = chats.map((chat) => {
        const otherMembers = getOtherMembers(chat.members, myId);

        return {
            ...chat,
            avatar: otherMembers
                .slice(0, 3)
                .map(({ user_avatar }) => user_avatar),
        };
    });

    return res.status(OK).json(transformedChats);
});

const createGroup = tryCatch(
    'creating new group chat',
    async (req, res, next) => {
        const { chat_name = '', members = [] } = req.body; // members excluding me

        // todo: check if chat between these members already exists

        if (!chat_name) {
            return next(
                new ErrorHandler(
                    'chat name is required for group chat',
                    BAD_REQUEST
                )
            );
        }

        if (!members.length) {
            return next(
                new ErrorHandler(
                    'atleast 1 more member is required',
                    BAD_REQUEST
                )
            );
        }

        const chat = await chatObject.createGroup({
            members,
            creator: req.user.user_id,
            chat_name,
        });

        // todo: Socket.io event to update chats on sidebar

        return res.status(OK).json(chat);
    }
);

const deleteChat = tryCatch('delete chat', async (req, res, next) => {
    const { chatId } = req.params;
    const chat = req.chat; // resource exists middleware

    if (chat.isGroupChat && chat.creator !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'only the creator can delete the group',
                BAD_REQUEST
            )
        );
    }

    await chatObject.deleteChat(chatId);

    // todo: emit event to refetch chats
    return res.status(OK).json({ message: 'chat has been deleted' });
});

const leaveGroup = tryCatch('leave group', async (req, res, next) => {
    const { chatId } = req.params;
    const memberLeaving = req.user.user_id;
    const chat = req.chat; // middleware

    if (!chat.isGroupChat) {
        return next(new ErrorHandler('this is not a group chat', BAD_REQUEST));
    }

    if (!chat.members.includes(memberLeaving)) {
        return next(
            new ErrorHandler(' you are not a member of this group', BAD_REQUEST)
        );
    }

    if (chat.members.length === 1) {
        await chatObject.deleteChat(chatId);
        return res.status(OK).json({ message: 'group no longer exists' });
    }

    const result = await chatObject.leaveGroup(chatId, memberLeaving);

    // todo: socket emit inform other about what user left the group

    return res.status(OK).json(result);
});

const addMembers = tryCatch('add members to group', async (req, res, next) => {
    const { chatId } = req.params;
    const { newMembers = [] } = req.body;
    const chat = req.chat; // middleware

    if (!chat.isGroupChat) {
        return next(
            new ErrorHandler(
                'Cannot add members to a non-group chat',
                BAD_REQUEST
            )
        );
    }

    if (chat.creator !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'Only the creator can add members to the group',
                BAD_REQUEST
            )
        );
    }

    if (!newMembers.length) {
        return next(new ErrorHandler('No members selected', BAD_REQUEST));
    }

    const result = await chatObject.addMembers(chatId, newMembers);

    // TODO: Emit socket event to notify members of the updated group (refetch chats maybe for them)

    return res.status(OK).json(result);
});

const removeMember = tryCatch(
    'removing a member from group',
    async (req, res, next) => {
        const { chatId, memberId } = req.params;
        const chat = req.chat; // middleware

        if (!chat.isGroupChat) {
            return next(
                new ErrorHandler(
                    'Cannot remove members from a non-group chat',
                    BAD_REQUEST
                )
            );
        }

        if (chat.creator !== req.user.user_id) {
            return next(
                new ErrorHandler(
                    'Only the creator can remove members from the group',
                    BAD_REQUEST
                )
            );
        }

        if (!chat.members.includes(memberId)) {
            return next(
                new ErrorHandler(
                    'The user is not a member of this group',
                    BAD_REQUEST
                )
            );
        }

        const result = await chatObject.removeMember(chatId, memberId);

        // TODO: Emit socket event to notify remaining members about the removal
        return res.status(OK).json(result);
    }
);

const renameGroup = tryCatch('renaming the group', async (req, res, next) => {
    const { chatId } = req.params;
    const { newName } = req.body;
    const chat = req.chat; // middleware

    if (!chat.isGroupChat) {
        return next(
            new ErrorHandler('Cannot rename a non-group chat', BAD_REQUEST)
        );
    }

    if (!chat.members.includes(req.user.user_id)) {
        return next(
            new ErrorHandler('You are not a member of this group', BAD_REQUEST)
        );
    }

    if (
        chat.members.find(({ user_id }) => user_id === req.user.user_id)
            ?.role !== 'admin'
    ) {
        return next(
            new ErrorHandler('Only an admin can rename the group', BAD_REQUEST)
        );
    }

    if (!newName || !newName.trim()) {
        return next(
            new ErrorHandler('New group name cannot be empty', BAD_REQUEST)
        );
    }

    const result = await chatObject.renameGroup(chatId, newName);

    // TODO: Emit socket event to notify members about the group name change
    return res.status(OK).json(result);
});

const getGroupDetails = tryCatch(
    'get group details',
    async (req, res, next) => {
        const { chatId } = req.params;
        const chat = req.chat; // middleware

        if (!chat.isGroupChat) {
            return next(
                new ErrorHandler(
                    'Cannot fetch details for a non-group chat',
                    BAD_REQUEST
                )
            );
        }

        const group = await chatObject.getGroupDetails(chatId);

        return res.status(OK).json(group);
    }
);

const sendRequest = tryCatch('send request', async (req, res, next) => {
    const { userId } = req.params;
    const sender = req.user.user_id;

    const result = await chatObject.sendRequest(sender, userId);

    if (typeof result === 'string') {
        return next(new ErrorHandler(result, BAD_REQUEST));
    } else {
        return res.status(OK).json(result);
    }
});

// could remove the request as well for cleanup
const rejectRequest = tryCatch('reject request', async (req, res, next) => {
    const { requestId } = req.params;
    const request = req.request; // resource exist middleware

    if (request.receiver_id !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'we are not authorized to reject the request',
                BAD_REQUEST
            )
        );
    }
    await chatObject.rejectRequest(requestId);
    return res.status(OK).json({ message: 'request has been rejected' });
});

// could remove the request as well for cleanup if dont want to show on frontend
const acceptRequest = tryCatch('accept request', async (req, res, next) => {
    const { requestId } = req.params;
    const request = req.request; // resource exist middleware

    if (request.receiver_id !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'we are not authorized to accept the request',
                BAD_REQUEST
            )
        );
    }

    const newChat = await chatObject.acceptRequest(requestId);

    // todo: emit event to refetch chats because new 1-1 chat has been created

    return res.status(OK).json({ message: 'request has been accepted' });
});

export {
    getGroupDetails,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMember,
    createGroup,
    leaveGroup,
    deleteChat,
    renameGroup,
    sendRequest,
    acceptRequest,
    rejectRequest,
};
