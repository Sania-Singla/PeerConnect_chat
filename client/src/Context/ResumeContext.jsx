import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const ResumeContextProvider = ({ children }) => {
    const [resumeInfo, setResumeInfo] = useState({});
    const [emptyResume, setEmptyResume] = useState({
        experience: [
            {
                position: '',
                company: '',
                address: {
                    country: '',
                    state: '',
                },
                startDate: '',
                endDate: '',
                description: '',
                currentlyWorking: false,
            },
        ],
        education: [
            {
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
        projects: [
            {
                title: '',
                description: '',
                technologies: '',
                link: '',
            },
        ],
        achievements: [{ title: '', description: '', date: '' }],
        skills: [{ name: '', rating: 0 }],
    });

    return (
        <ResumeContext.Provider
            value={{ resumeInfo, setResumeInfo, emptyResume, setEmptyResume }}
        >
            {children}
        </ResumeContext.Provider>
    );
};

const useResumeContext = () => useContext(ResumeContext);

export { useResumeContext, ResumeContextProvider };
