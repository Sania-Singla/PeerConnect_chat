import { Resume } from '../schemas/index.js';

export class ResumeModel {
    async getResume(resumeId) {
        try {
            return await Resume.findOne({ resumeId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getResumes(userId) {
        try {
            return await Resume.find({ userId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async createResume(userId, title) {
        try {
            const resume = await Resume.create({ title, userId });
            return resume.toObject();
        } catch (err) {
            throw err;
        }
    }

    async deleteResume(resumeId) {
        try {
            return await Resume.findOneAndDelete({ resumeId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async updateTheme(resumeId, theme) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                { $set: { themeColor: theme } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveSection(sectionName, resumeId, data) {
        try {
            const updates = {};
            switch (sectionName) {
                case 'personal':
                    updates.personal = data;
                    break;
                case 'summary':
                    updates['personal.summary'] = data.summary;
                    break;
                case 'education':
                    updates.education = data;
                    break;
                case 'experience':
                    updates.experience = data;
                    break;
                case 'skills':
                    updates.skills = data;
                    break;
                case 'achievements':
                    updates.achievements = data;
                    break;
                case 'projects':
                    updates.projects = data;
                    break;
                default:
                    throw new Error('Invalid section');
            }

            return await Resume.findOneAndUpdate(
                { resumeId },
                { $set: updates },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
