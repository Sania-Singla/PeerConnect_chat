import { getServiceObject } from '../db/serviceObjects.js';
import { tryCatch } from '../utils/tryCatch.js';
import { OK } from '../constants/errorCodes.js';

export const resumeObject = getServiceObject('Resume');

const saveSection = tryCatch('save personal info', async (req, res) => {
    const { resumeId } = req.params;
    const { sectionName } = req.query;
    const { data } = req.body;

    let model;

    switch (sectionName) {
        case 'education':
            model = resumeObject.saveEducation;
            break;
        case 'experience':
            model = resumeObject.saveExperience;
            break;
        case 'skills':
            model = resumeObject.saveSkills;
            break;
        case 'achievements':
            model = resumeObject.saveAchievements;
            break;
        case 'projects':
            model = resumeObject.saveProjects;
            break;
        case 'personalInfo':
            model = resumeObject.savePersonalInfo;
            break;
        case 'summary':
            model = resumeObject.saveSummary;
            break;
        default:
            throw new Error('Invalid section name');
    }

    const resume = await model(resumeId, data);

    return res.status(OK).json(resume);
});

const createResume = tryCatch('create new resume', async (req, res) => {
    const { user_id } = req.user;
    const { title } = req.body;

    const resume = await resumeObject.createResume(user_id, title);

    return res.status(OK).json({ resumeId: resume.resumeId });
});

const getResume = tryCatch('get resume', async (req, res) => {
    const { resumeId } = req.params;
    const resume = await resumeObject.getResume(resumeId);
    return res.status(OK).json(resume);
});

const deleteResume = tryCatch('delete resume', async (req, res) => {
    const { resumeId } = req.params;
    const resume = await resumeObject.deleteResume(resumeId);
    return res.status(OK).json(resume);
});

const getResumes = tryCatch('get resumes', async (req, res) => {
    const resumes = await resumeObject.getResumes(req.user.user_id);
    return res.status(OK).json(resumes);
});

export { saveSection, deleteResume, getResume, getResumes, createResume };
