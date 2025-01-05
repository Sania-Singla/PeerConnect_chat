import { Icolabs } from '../../interfaces/colab.Interface.js';
import { Colab } from '../../schemas/MongoDB/index.js';

export class MongoColabs extends Icolabs {
    async addCollaboration(colabId, myId, otherUserId) {
        try {
            const colab = await Colab.create({
                colab_id: colabId,
                admins: [myId],
                normalMembers: [otherUserId],
            });
            return colab.toObject();
        } catch (err) {
            throw err;
        }
    }

    // need for brain stroming
    async removeCollaboration(colabId) {
        try {
            return await Colab.findOneAndDelete({
                colab_id: colabId,
            });
        } catch (err) {
            throw err;
        }
    }

    async createGroup(admin, normalMembers, colabId) {
        try {
            const group = await Colab.create({
                colab_id: colabId,
                admins: [admin],
                normalMembers,
            });
            return group.toObject();
        } catch (err) {
            throw err;
        }
    }

    async leaveGroup(colabId, userId) {
        try {
            return await Colab.findOneAndUpdate(
                {
                    colab_id: colabId,
                    $or: [
                        { admins: userId }, // Check if userId is in `admins`
                        { normalMembers: userId }, // Check if userId is in `normalMembers`
                    ],
                },
                {
                    $pull: {
                        admins: userId, // Remove from `admins`
                        normalMembers: userId, // Remove from `normalMembers`
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    // need for brain stroming
    async deleteGroup(colabId) {
        try {
            return await Colab.findOneAndDelete({ colab_id: colabId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async removeSomeoneFromGroup(colabId, userId) {
        try {
            const colab = await Colab.findOne({ colab_id: colabId });
            if (colab.admins.includes(userId)) {
                return { message: 'cannot remove an admin from the group' };
            } else {
                colab.normalMembers = colab.normalMembers.filter(
                    (memberId) => memberId !== userId
                );
                await colab.save();
                return colab.toObject();
            }
        } catch (err) {
            throw err;
        }
    }

    async addSomeoneToGroup(colabId, userId) {
        try {
            return await Colab.findOneAndUpdate(
                {
                    colab_id: colabId,
                },
                {
                    $addToSet: {
                        normalMembers: userId, // Add `userId` to `normalMembers` if not already present
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async promoteToAdmin(colabId, userId) {
        try {
            return await Colab.findOneAndUpdate(
                {
                    colab_id: colabId,
                },
                {
                    $addToSet: {
                        admins: userId, // Add `userId` to `admins` if not already present
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
