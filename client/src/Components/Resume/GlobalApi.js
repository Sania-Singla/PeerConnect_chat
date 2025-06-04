const CreateNewResume = (data) => {
    const resumes = JSON.parse(localStorage.getItem('userResumes')) || [];
    localStorage.setItem(
        'userResumes',
        JSON.stringify(resumes.concat({ createdAt: new Date(), ...data }))
    );
};

const GetUserResumes = () =>
    JSON.parse(localStorage.getItem('userResumes')) || [];

const UpdateResumeDetail = (id, data) => {
    const resumes = JSON.parse(localStorage.getItem('userResumes'));
    if (resumes?.length) {
        const updatedResumes = resumes.map((r) => {
            if (r.resumeId === id) {
                return { ...r, ...data };
            } else return r;
        });
        localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
    }
};

const GetResumeById = (id) => {
    const resumes = JSON.parse(localStorage.getItem('userResumes')) || [];
    return resumes.find((r) => r.resumeId === id);
};

const DeleteResumeById = (id) => {
    const resumes = JSON.parse(localStorage.getItem('userResumes')) || [];
    localStorage.setItem(
        'userResumes',
        JSON.stringify(resumes.filter((r) => r.resumeId !== id))
    );
};

export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById,
};
