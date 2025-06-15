import { Editor } from '../schemas/index.js';
// WE NEED TO WORK ON CURSOR DUDE, amd history of code per member and all, will do this later
export class EditorModel {
    // we need to create seperate functions for create amd save, as
    // --- it would not not make sense,on each save click u have to check if the room doesnt exist , then create else save code,
    // --- and we would have to send whole data ig each time when we save code
    async createRoom({ ownerId, roomId, roomType, members = [], code }) {
        try {
            const initialMembers =
                roomType === 'private'
                    ? [
                          {
                              memberId: ownerId,
                              memberType: 'owner',
                              accessType: 'edit',
                          },
                          ...members,
                      ]
                    : [
                          {
                              memberId: ownerId,
                              memberType: 'owner',
                              accessType: 'edit',
                          },
                      ];
            const room = await Editor.create({
                ownerId,
                roomId,
                roomType,
                members: initialMembers,
                code, //send boiler plate code OR set in default
            });
            return room.toObject();
        } catch (err) {
            throw err;
        }
    }

    //for private(when owner wanna add member) and public(when admin accepts member request) both!
    async addAMember({ roomId, member }) {
        try {
            return await Editor.findOneAndUpdate(
                { roomId },
                {
                    $push: {
                        members: member,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async removeMember({ roomId, memberId }) {
        try {
            return await Editor.findOneAndUpdate(
                { roomId },
                {
                    $pull: { members: { memberId } },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveCode({ roomId, code }) {
        try {
            return await Editor.findOneAndUpdate(
                {
                    roomId,
                },
                {
                    $set: {
                        code,
                    },
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    //like chnage a member to admin / owner (if in case)/ member
    async changeMemberType({ roomId, memberId, memberType }) {
        try {
            return await Editor.findOneAndUpdate(
                {
                    roomId,
                    'members.memberId': memberId,
                },
                {
                    $set: {
                        'members.$.memberType': memberType,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    // if wanna make private to public or vice-versa, ("mainly" private to public make sense)
    async changeRoomType({ roomId, roomType }) {
        try {
            return await Editor.findOneAndUpdate(
                { roomId },
                {
                    $set: {
                        roomType,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async changeAccessType({ roomId, memberId, accessType }) {
        try {
            return await Editor.findOneAndUpdate(
                {
                    roomId,
                    'members.memberId': memberId,
                },
                {
                    $set: {
                        'members.$.accessType': accessType,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async deleteRoom(roomId) {
        try {
            return await Editor.findOneAndDelete({ roomId }).lean();
        } catch (err) {
            throw err;
        }
    }
}
