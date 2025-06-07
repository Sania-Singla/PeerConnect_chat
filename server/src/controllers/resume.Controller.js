import { getServiceObject } from '../db/serviceObjects.js';
import { tryCatch } from '../utils/tryCatch.js';
import { OK } from '../constants/errorCodes.js';

export const resumeObject = getServiceObject('Resume');

const saveSection = tryCatch('save personal info', async (req, res) => {
    const { resumeId } = req.params;
    const { sectionName } = req.query;
    const { data } = req.body;

    const resume = await resumeObject.saveSection(sectionName, resumeId, data);
    return res.status(OK).json(resume);
});

const createResume = tryCatch('create new resume', async (req, res) => {
    const { user_id } = req.user;
    const { title } = req.body;

    const resume = await resumeObject.createResume(user_id, title);

    return res.status(OK).json({ resumeId: resume.resumeId });
});

const updateTheme = tryCatch('update theme', async (req, res) => {
    const { resumeId } = req.params;
    const { theme } = req.body;
    const resume = await resumeObject.updateTheme(resumeId, theme);
    return res.status(OK).json(resume);
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

export {
    saveSection,
    deleteResume,
    updateTheme,
    getResume,
    getResumes,
    createResume,
};
