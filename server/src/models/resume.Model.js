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

    async savePersonalInfo(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        personal: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            phone: data.phone,
                            address: {
                                state: data.address.state,
                                country: data.address.country,
                            },
                            linkedin: data.linkedin,
                            github: data.github,
                        },
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveSummary(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        'personal.summary': data.summary,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveEducation(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        education: {
                            institution: data.institution,
                            degree: data.degree,
                            major: data.major,
                            description: data.description,
                            startDate: data.startDate,
                            endDate: data.endDate,
                        },
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveExperience(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        experiences: {
                            position: data.position,
                            company: data.company,
                            address: {
                                city: data.address.city,
                                state: data.address.state,
                                country: data.address.country,
                            },
                            startDate: data.startDate,
                            currentlyWorking: data.currentlyWorking,
                            endDate: data.endDate,
                            description: data.description,
                        },
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveSkills(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        skills: data.map((skill) => ({
                            name: skill.name,
                            rating: skill.rating,
                        })),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveAchievements(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        achievements: data.map((achievement) => ({
                            title: achievement.title,
                            description: achievement.description,
                            date: achievement.date,
                        })),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async saveProjects(resumeId, data) {
        try {
            return await Resume.findOneAndUpdate(
                { resumeId },
                {
                    $set: {
                        projects: data.map((project) => ({
                            title: project.title,
                            description: project.description,
                            technologies: project.technologies,
                            github: project.github,
                        })),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
